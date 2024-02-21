import {LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {template} from './checklist-selection-table.tpl';
import {clone} from 'ramda';
import {store} from '../../../../../../redux/store';
import {loadStaticData} from '../../../../../../redux/effects/load-static-data.effect';
import {elevationStyles} from '../../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../../styles/card-styles';
import {TemplatesStyles} from '../../../../templates/templates-tab/templates-tab.styles';
import {ChecklistSelectionTableStyles} from './checklist-selection-table.styles';
import {updateActivityChecklist} from '../../../../../../redux/effects/activity-checklist.effects';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {getDifference} from '../../../../../utils/objects-diff';
import {checklistEditedCard} from '../../../../../../redux/selectors/activity-checklist.selectors';
import {SetEditedChecklistCard} from '../../../../../../redux/actions/activity-checklist.actions';
import {Unsubscribe} from 'redux';
import {get as getTranslation} from 'lit-translate';

const ENTER = 13;
const ESCAPE = 27;

@customElement('checklist-selection-table')
export class ChecklistSelectionTable extends LitElement {
  @property({type: Array}) questionsList: IChecklistItem[] = [];
  @property() isEditMode = false;
  @property() editedDetails: GenericObject = {opened: false};
  @property() loadingInProcess = false;
  @property() activityDetails: IActivityDetails | null = null;
  @property({type: Boolean, attribute: 'readonly'}) readonly = false;

  @property() protected blockEdit = false;

  @query('#details-input') private detailsInput!: HTMLInputElement;
  @property() private methods!: EtoolsMethod[];

  tableTitle = '';
  activityId!: number;

  private editedCardUnsubscribe!: Unsubscribe;
  private originalQuestionsList: IChecklistItem[] = [];

  static get styles(): CSSResultArray {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      FlexLayoutClasses,
      CardStyles,
      TemplatesStyles,
      ChecklistSelectionTableStyles
    ];
  }

  get allQuestionsEnabled(): boolean {
    return !this.questionsList.some((question: IChecklistItem) => !question.is_enabled);
  }

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    const data: EtoolsMethod[] = store.getState().staticData.methods;
    if (data) {
      this.methods = data;
    } else {
      store.dispatch<AsyncEffect>(loadStaticData('methods')).then((fetchedData: any) => (this.methods = fetchedData));
    }
    if (!this.activityId) {
      throw new Error('Please provide activityId for checklist-selection-table element');
    }

    this.editedCardUnsubscribe = store.subscribe(
      checklistEditedCard((editedCard: string | null) => {
        this.blockEdit = editedCard !== null && this.tableTitle !== editedCard;
      }, false)
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.editedCardUnsubscribe();
  }

  enableEditMode(): void {
    if (this.isEditMode) {
      return;
    }
    this.originalQuestionsList = clone(this.questionsList);
    this.isEditMode = true;
    store.dispatch(new SetEditedChecklistCard(this.tableTitle));
  }

  cancelEdit(): void {
    this.questionsList = this.originalQuestionsList;
    this.originalQuestionsList = [];
    this.isEditMode = false;
    store.dispatch(new SetEditedChecklistCard(null));
  }

  saveChanges(): void {
    const dataToRequest: Partial<IChecklistItem>[] | null = this.getChangedData();
    if (!dataToRequest) {
      this.cancelEdit();
      return;
    }

    this.loadingInProcess = true;
    this.isEditMode = false;
    store
      .dispatch<AsyncEffect>(updateActivityChecklist(this.activityId, dataToRequest))
      .then(() => {
        this.originalQuestionsList = [];
        store.dispatch(new SetEditedChecklistCard(null));
      })
      .catch(() => {
        this.isEditMode = true;
        fireEvent(this, 'toast', {text: getTranslation('ERROR_UPDATE_CHECKLIST')});
      })
      .finally(() => (this.loadingInProcess = false));
  }

  serializeMethods(methodsIds: number[]): string {
    if (!this.methods) {
      return '';
    }
    return methodsIds
      .map((id: number) => this.methods.find((method: EtoolsMethod) => method.id === id))
      .filter<EtoolsMethod>((method: EtoolsMethod | undefined): method is EtoolsMethod => method !== undefined)
      .map(({name}: EtoolsMethod) => name)
      .join(', ');
  }

  showDetailsInput(target: HTMLElement, id: number, details: string | null): void {
    if (!this.isEditMode) {
      return;
    }
    const {top, left, width} = target.getBoundingClientRect();
    this.editedDetails = {
      opened: true,
      details: details || '',
      width,
      top,
      left,
      id
    };
    setTimeout(() => this.detailsInput.focus(), 0);
  }

  getDetailsInputStyles(): string {
    if (!this.editedDetails) {
      return '';
    }
    return (
      `width: ${this.editedDetails.width || 0}px;` +
      `top: ${this.editedDetails.top || 0}px;` +
      `left: ${this.editedDetails.left || 0}px;`
    );
  }

  onDetailsKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === ENTER && !event.shiftKey) {
      this.updateItemDetails(this.editedDetails.id, this.editedDetails.details);
      event.preventDefault();
    } else if (event.keyCode === ESCAPE) {
      this.editedDetails = {opened: false};
      event.preventDefault();
    }
  }

  onDetailsKeyUp(): void {
    this.editedDetails.details = this.detailsInput.value;
  }

  updateItemDetails(id: number, details: string): void {
    // close editedDetails input popover
    this.editedDetails = {opened: false};

    // find edited template in list
    const selectedTemplate: IChecklistItem | undefined = this.questionsList.find(
      (question: IChecklistItem) => question.id === id
    );
    if (!selectedTemplate) {
      return;
    }
    selectedTemplate.specific_details = details;
  }

  toggleAll(newState: boolean): void {
    const currentState: boolean = this.allQuestionsEnabled;
    if (newState === currentState) {
      return;
    }
    this.questionsList.forEach((question: IChecklistItem) => (question.is_enabled = newState));
    this.requestUpdate();
  }

  private getChangedData(): Partial<IChecklistItem>[] | null {
    const changes: Partial<IChecklistItem>[] = this.questionsList
      .map((checklistItem: IChecklistItem, index: number) => {
        const diff: Partial<IChecklistItem> = getDifference(this.originalQuestionsList[index], checklistItem, {
          toRequest: true
        });
        if (!Object.keys(diff).length) {
          return null;
        }

        return {...diff, id: checklistItem.id};
      })
      .filter((data: Partial<IChecklistItem> | null): data is IChecklistItem => data !== null);
    return changes.length ? changes : null;
  }
}
