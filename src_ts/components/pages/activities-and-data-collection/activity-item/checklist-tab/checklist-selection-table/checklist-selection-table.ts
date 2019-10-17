import { CSSResultArray, customElement, LitElement, property, query, TemplateResult } from 'lit-element';
import { template } from './checklist-selection-table.tpl';
import { clone } from 'ramda';
import { store } from '../../../../../../redux/store';
import { loadStaticData } from '../../../../../../redux/effects/load-static-data.effect';
import { elevationStyles } from '../../../../../styles/elevation-styles';
import { SharedStyles } from '../../../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../../../styles/page-layout-styles';
import { FlexLayoutClasses } from '../../../../../styles/flex-layout-classes';
import { CardStyles } from '../../../../../styles/card-styles';
import { TemplatesStyles } from '../../../../plan/templates-tab/templates-tab.styles';
import { ChecklistSelectionTableStyles } from './checklist-selection-table.styles';
import { updateActivityChecklist } from '../../../../../../redux/effects/activity-checklist.effects';
import { fireEvent } from '../../../../../utils/fire-custom-event';
import { getDifference } from '../../../../../utils/objects-diff';
import { checklistEditedCard } from '../../../../../../redux/selectors/activity-checklist.selectors';
import { SetEditedChecklistCard } from '../../../../../../redux/actions/activity-checklist.actions';
import { Unsubscribe } from 'redux';

const ENTER: 13 = 13;
const ESCAPE: 27 = 27;

@customElement('checklist-selection-table')
export class ChecklistSelectionTable extends LitElement {
    @property({ type: Array }) public questionsList: IChecklistItem[] = [];
    @property() public isEditMode: boolean = false;
    @property() public editedDetails: GenericObject = { opened: false };
    @property() public loadingInProcess: boolean = false;
    public tableTitle: string = 'wer';
    public activityId!: number;

    @property() protected blockEdit: boolean = false;

    @query('#details-input') private detailsInput!: HTMLInputElement;
    @property() private methods!: EtoolsMethod[];
    private editedCardUnsubscribe!: Unsubscribe;
    private originalQuestionsList: IChecklistItem[] = [];

    public get allQuestionsEnabled(): boolean {
        return !this.questionsList.some((question: IChecklistItem) => !question.is_enabled);
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        const data: EtoolsMethod[] = store.getState().staticData.methods;
        if (data) {
            this.methods = data;
        } else {
            store.dispatch<AsyncEffect>(loadStaticData('methods'))
                .then((fetchedData: any) => this.methods = fetchedData);
        }
        if (!this.activityId) {
            throw new Error('Please provide activityId for checklist-selection-table element');
        }

        this.editedCardUnsubscribe = store.subscribe(checklistEditedCard((editedCard: string | null) => {
            this.blockEdit = editedCard !== null && this.tableTitle !== editedCard;
        }, false));
    }
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.editedCardUnsubscribe();
    }

    public enableEditMode(): void {
        if (this.isEditMode) { return; }
        this.originalQuestionsList = clone(this.questionsList);
        this.isEditMode = true;
        store.dispatch(new SetEditedChecklistCard(this.tableTitle));
    }

    public cancelEdit(): void {
        this.questionsList = this.originalQuestionsList;
        this.originalQuestionsList = [];
        this.isEditMode = false;
        store.dispatch(new SetEditedChecklistCard(null));
    }

    public saveChanges(): void {
        const dataToRequest: Partial<IChecklistItem>[] | null = this.getChangedData();
        if (!dataToRequest) {
            this.cancelEdit();
            return;
        }

        this.loadingInProcess = true;
        this.isEditMode = false;
        store.dispatch<AsyncEffect>(updateActivityChecklist(this.activityId, dataToRequest))
            .then(() => {
                this.originalQuestionsList = [];
                store.dispatch(new SetEditedChecklistCard(null));
            })
            .catch(() => {
                this.isEditMode = true;
                fireEvent(this, 'toast', { text: 'Can not update checklist, please try again' });
            })
            .finally(() => this.loadingInProcess = false);
    }

    public serializeMethods(methodsIds: number[]): string {
        if (!this.methods) { return ''; }
        return methodsIds
            .map((id: number) => this.methods.find((method: EtoolsMethod) => method.id === id))
            .filter<EtoolsMethod>((method: EtoolsMethod | undefined): method is EtoolsMethod => method !== undefined)
            .map(({ name }: EtoolsMethod) => name)
            .join(', ');
    }

    public showDetailsInput(target: HTMLElement, id: number, details: string | null): void {
        if (!this.isEditMode) { return; }
        const { top, left, width } = target.getBoundingClientRect();
        this.editedDetails = {
            opened: true,
            details: details || '',
            width, top, left, id
        };
        setTimeout(() => this.detailsInput.focus(), 0);
    }

    public getDetailsInputStyles(): string {
        if (!this.editedDetails) { return ''; }
        return `width: ${ this.editedDetails.width || 0 }px;` +
            `top: ${ this.editedDetails.top || 0 }px;` +
            `left: ${ this.editedDetails.left || 0 }px;`;
    }

    public onDetailsKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === ENTER && !event.shiftKey) {
            this.updateItemDetails(this.editedDetails.id, this.editedDetails.details);
            event.preventDefault();
        } else if (event.keyCode === ESCAPE) {
            this.editedDetails = { opened: false };
            event.preventDefault();
        }
    }

    public onDetailsKeyUp(): void {
        this.editedDetails.details = this.detailsInput.value;
    }

    public updateItemDetails(id: number, details: string): void {
        // close editedDetails input popover
        this.editedDetails = { opened: false };

        // find edited template in list
        const selectedTemplate: IChecklistItem | undefined = this.questionsList.find((question: IChecklistItem) => question.id === id);
        if (!selectedTemplate) { return; }
        selectedTemplate.specific_details = details;
    }

    public toggleAll(newState: boolean): void {
        const currentState: boolean = this.allQuestionsEnabled;
        if (newState === currentState) { return; }
        this.questionsList.forEach((question: IChecklistItem) => question.is_enabled = newState);
        this.requestUpdate();
    }

    private getChangedData(): Partial<IChecklistItem>[] | null {
        const changes: Partial<IChecklistItem>[] = this.questionsList
            .map((checklistItem: IChecklistItem, index: number) => {
                const diff: Partial<IChecklistItem> = getDifference(this.originalQuestionsList[index], checklistItem, { toRequest: true });
                if (!Object.keys(diff).length) { return null; }

                return { ...diff, id: checklistItem.id };
            })
            .filter((data: Partial<IChecklistItem> | null): data is IChecklistItem => data !== null);
        return changes.length ? changes : null;
    }

    public static get styles(): CSSResultArray {
        return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, TemplatesStyles,
            ChecklistSelectionTableStyles];
    }

}