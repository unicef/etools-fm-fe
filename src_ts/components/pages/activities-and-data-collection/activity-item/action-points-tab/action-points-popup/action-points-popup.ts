import {
  css,
  CSSResult,
  customElement,
  LitElement,
  property,
  PropertyValues,
  queryAll,
  TemplateResult
} from 'lit-element';
import {template} from './action-points-popup.tpl';
import {fireEvent} from '../../../../../utils/fire-custom-event';
import {store} from '../../../../../../redux/store';
import {
  actionPointsCategoriesSelector,
  actionPointsOfficesSelector,
  staticDataDynamic
} from '../../../../../../redux/selectors/static-data.selectors';
import {ACTION_POINTS_CATEGORIES, ACTION_POINTS_OFFICES, USERS} from '../../../../../../endpoints/endpoints-list';
import {loadStaticData} from '../../../../../../redux/effects/load-static-data.effect';
import {DataMixin} from '../../../../../common/mixins/data-mixin';
import {SectionsMixin} from '../../../../../common/mixins/sections-mixin';
import {Unsubscribe} from 'redux';
import {createActionPoint, updateActionPoint} from '../../../../../../redux/effects/action-points.effects';
import {
  actionPointsUpdateSelector,
  actionPointsUpdateStatusSelector
} from '../../../../../../redux/selectors/action-points.selectors';
import {InterventionsMixin} from '../../../../../common/mixins/interventions-mixin';
import {PartnersMixin} from '../../../../../common/mixins/partners-mixin';
import {CpOutputsMixin} from '../../../../../common/mixins/cp-outputs-mixin';
import {getDifference} from '../../../../../utils/objects-diff';
import {PaperTextareaElement} from '@polymer/paper-input/paper-textarea';
import {setTextareasMaxHeight} from '../../../../../utils/textarea-max-rows-helper';
import {INTERVENTION, OUTPUT, PARTNER} from '../../../../../common/dropdown-options';

//TODO names
type RelatedType = {id: number; name: string}[];
type DataFields = 'partner' | 'cp_output' | 'intervention';

@customElement('action-points-popup')
export class ActionPointsPopup extends InterventionsMixin(
  PartnersMixin(CpOutputsMixin(SectionsMixin(DataMixin()<EditableActionPoint>(LitElement))))
) {
  @queryAll('paper-textarea') textareas!: PaperTextareaElement[];
  @property() dialogOpened: boolean = true;
  @property() users: User[] = [];
  @property() offices: ActionPointsOffice[] = store.getState().staticData.offices;
  @property() categories: ActionPointsCategory[] = store.getState().staticData.actionPointsCategories;
  @property() selectedRelatedTo: string | null = null;

  @property() savingInProcess: boolean | null = false;

  @property() relationContent: RelatedType = [];

  statusOptions: DefaultDropdownOption<string>[] = [
    {value: 'open', display_name: 'Open'},
    {value: 'completed', display_name: 'Completed'}
  ];

  mappings: Map<string, DataFields> = new Map<string, DataFields>([
    [PARTNER, 'partner'],
    [OUTPUT, 'cp_output'],
    [INTERVENTION, 'intervention']
  ]);

  set dialogData({action_point, activity_id}: ActionPointPopupData) {
    this.data = action_point
      ? this.extractIds(action_point)
      : {
          id: null,
          description: '',
          category: null,
          assigned_to: null,
          section: null,
          office: null,
          due_date: null,
          high_priority: false,
          partner: null,
          cp_output: null,
          intervention: null
        };
    this.activityId = activity_id;
    this.selectedRelatedTo = this.getRelatedTo(this.editedData);
  }

  private activityId!: number;
  private userUnsubscribe!: Unsubscribe;
  private updateActionPointUnsubscribe!: Unsubscribe;
  private updateActionPointStatusUnsubscribe!: Unsubscribe;
  private actionPointsOfficesUnsubscribe!: Unsubscribe;
  private actionPointsCategoriesUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    const data: IStaticDataState = (store.getState() as IRootState).staticData;
    if (!data.users) {
      store.dispatch<AsyncEffect>(loadStaticData(USERS));
    }
    if (!this.offices) {
      store.dispatch<AsyncEffect>(loadStaticData(ACTION_POINTS_OFFICES));
    }
    if (!this.categories) {
      store.dispatch<AsyncEffect>(loadStaticData(ACTION_POINTS_CATEGORIES));
    }

    this.userUnsubscribe = store.subscribe(
      staticDataDynamic(
        (users: User[] | undefined) => {
          if (!users) {
            return;
          }
          this.users = users;
        },
        [USERS]
      )
    );

    this.updateActionPointStatusUnsubscribe = store.subscribe(
      actionPointsUpdateStatusSelector((updateInProcess: boolean | null) => {
        this.savingInProcess = updateInProcess;
      })
    );

    this.updateActionPointUnsubscribe = store.subscribe(
      actionPointsUpdateSelector((isUpdateSuccessful: boolean) => {
        if (isUpdateSuccessful) {
          this.dialogOpened = false;
          this.onClose();
        } else {
          this.errors = store.getState().actionPointsList.error.data;
        }
      }, false)
    );

    this.actionPointsOfficesUnsubscribe = store.subscribe(
      actionPointsOfficesSelector((offices: ActionPointsOffice[] | undefined) => {
        if (offices) {
          this.offices = offices;
        }
      })
    );

    this.actionPointsCategoriesUnsubscribe = store.subscribe(
      actionPointsCategoriesSelector((categories: ActionPointsCategory[] | undefined) => {
        if (categories) {
          this.categories = categories;
        }
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.userUnsubscribe();
    this.actionPointsOfficesUnsubscribe();
    this.actionPointsCategoriesUnsubscribe();
    this.updateActionPointUnsubscribe();
    this.updateActionPointStatusUnsubscribe();
  }

  onClose(): void {
    fireEvent(this, 'response', {confirmed: false});
  }

  save(): void {
    this.errors = {};
    const target: Partial<EditableActionPoint> =
      this.originalData !== null
        ? getDifference<EditableActionPoint>(this.originalData, this.editedData, {toRequest: true})
        : this.editedData;
    const isEmpty: boolean = !Object.keys(target).length;

    if (isEmpty) {
      this.dialogOpened = false;
      this.onClose();
    } else if (!this.editedData.id) {
      store.dispatch<AsyncEffect>(createActionPoint(this.activityId, this.editedData));
    } else {
      store.dispatch<AsyncEffect>(updateActionPoint(this.activityId, this.editedData.id, this.editedData));
    }
  }

  getRelatedNames(): RelatedType {
    switch (this.selectedRelatedTo) {
      case PARTNER:
        return this.partners.map((item: EtoolsPartner) => {
          return {id: item.id, name: item.name};
        });
      case OUTPUT:
        return this.outputs.map((item: EtoolsCpOutput) => {
          return {id: item.id, name: item.name};
        });
      case INTERVENTION:
        return this.interventions.map((item: EtoolsIntervention) => {
          return {id: item.id, name: item.title};
        });
      default:
        return [];
    }
  }

  switchRelationContent(relationType: string): void {
    if (relationType && relationType !== this.selectedRelatedTo) {
      this.selectedRelatedTo = relationType;
      this.editedData.partner = null;
      this.editedData.cp_output = null;
      this.editedData.intervention = null;
    }
  }

  //todo refactor
  updateEditableDataRelationContent(selectedItem: EtoolsPartner | EtoolsCpOutput | EtoolsIntervention): void {
    if (this.selectedRelatedTo) {
      const FIELD: DataFields | undefined = this.mappings.get(this.selectedRelatedTo);
      if (FIELD) {
        this.updateModelValue(FIELD, selectedItem && selectedItem.id);
      }
    }
  }

  getSelectedRelatedName(): number | null | undefined {
    switch (this.selectedRelatedTo) {
      case PARTNER:
        return this.editedData.partner;
      case OUTPUT:
        return this.editedData.cp_output;
      case INTERVENTION:
        return this.editedData.intervention;
      default:
        return null;
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    setTextareasMaxHeight(this.textareas);
  }

  private extractIds(actionPoint: ActionPoint): EditableActionPoint {
    return {
      id: actionPoint.id,
      category: actionPoint.category,
      assigned_to: actionPoint.assigned_to.id,
      high_priority: actionPoint.high_priority,
      due_date: actionPoint.due_date,
      description: actionPoint.description,
      office: actionPoint.office.id,
      section: actionPoint.section.id,
      partner: actionPoint.partner ? actionPoint.partner.id : null,
      cp_output: actionPoint.cp_output ? actionPoint.cp_output.id : null,
      intervention: actionPoint.intervention ? actionPoint.intervention.id : null
    };
  }

  private getRelatedTo({partner, cp_output, intervention}: Partial<EditableActionPoint>): string | null {
    if (partner) {
      return PARTNER;
    } else if (cp_output) {
      return OUTPUT;
    } else if (intervention) {
      return INTERVENTION;
    } else {
      return null;
    }
  }

  static get styles(): CSSResult[] {
    return [
      css`
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .priority-container {
          display: flex;
          height: 62px;
        }

        .priority {
          display: flex;
          align-items: center;
          padding: 0 12px;
        }

        datepicker-lite {
          white-space: nowrap;
        }
      `
    ];
  }
}
