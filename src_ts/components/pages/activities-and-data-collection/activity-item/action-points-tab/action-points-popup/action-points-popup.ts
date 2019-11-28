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
import {staticDataDynamic} from '../../../../../../redux/selectors/static-data.selectors';
import {USERS} from '../../../../../../endpoints/endpoints-list';
import {loadStaticData} from '../../../../../../redux/effects/load-static-data.effect';
import {DataMixin} from '../../../../../common/mixins/data-mixin';
import {SectionsMixin} from '../../../../../common/mixins/sections-mixin';
import {Unsubscribe} from 'redux';
import {
  createActionPoint,
  loadActionPointsCategories,
  loadActionPointsOffices,
  updateActionPoint
} from '../../../../../../redux/effects/action-points.effects';
import {
  actionPointsCategoriesSelector,
  actionPointsOfficesSelector,
  actionPointsUpdateSelector
} from '../../../../../../redux/selectors/action-points.selectors';
import {InterventionsMixin} from '../../../../../common/mixins/interventions-mixin';
import {PartnersMixin} from '../../../../../common/mixins/partners-mixin';
import {CpOutputsMixin} from '../../../../../common/mixins/cp-outputs-mixin';
import {getDifference} from '../../../../../utils/objects-diff';
import {PaperTextareaElement} from '@polymer/paper-input/paper-textarea';
import {setTextareasMaxHeight} from '../../../../../utils/textarea-max-rows-helper';

type RelatedType = {id: number; name: string}[];

@customElement('action-points-popup')
export class ActionPointsPopup extends InterventionsMixin(
  PartnersMixin(CpOutputsMixin(SectionsMixin(DataMixin()<EditableActionPoint>(LitElement))))
) {
  @queryAll('paper-textarea') textareas!: PaperTextareaElement[];
  @property() dialogOpened: boolean = true;
  @property() users: User[] = [];
  @property() offices: OfficeSectionType[] = [];
  @property() categories: ActionPointsCategory[] = [];

  @property() relatedMap!: Map<string, RelatedType>;

  relationType: DefaultDropdownOption<string>[] = [
    {value: 'partner', display_name: 'Partner'},
    {value: 'cp_output', display_name: 'CP Output'},
    {value: 'intervention', display_name: 'Intervention'}
  ];
  @property() relationContent: RelatedType = [];

  statusOptions: DefaultDropdownOption<string>[] = [
    {value: 'open', display_name: 'Open'},
    {value: 'completed', display_name: 'Completed'}
  ];

  private activityId!: number;

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
  }

  private userUnsubscribe!: Unsubscribe;
  private updateActionPointUnsubscribe!: Unsubscribe;
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
    store.dispatch<AsyncEffect>(loadActionPointsOffices());
    store.dispatch<AsyncEffect>(loadActionPointsCategories());

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
      actionPointsOfficesSelector((offices: OfficeSectionType[]) => {
        this.offices = offices;
      })
    );
    this.actionPointsCategoriesUnsubscribe = store.subscribe(
      actionPointsCategoriesSelector((categories: ActionPointsCategory[]) => {
        this.categories = categories;
      })
    );
    //TODO wait for loading or invoke .map on each relatedType update in switchRelationContent() method
    this.relatedMap = new Map([
      [
        this.relationType[0].value,
        this.partners.map((item: EtoolsPartner) => {
          return {id: item.id, name: item.name};
        })
      ],
      [
        this.relationType[1].value,
        this.outputs.map((item: EtoolsCpOutput) => {
          return {id: item.id, name: item.name};
        })
      ],
      [
        this.relationType[2].value,
        this.interventions.map((item: EtoolsIntervention) => {
          return {id: item.id, name: item.title};
        })
      ]
    ]);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.userUnsubscribe();
    this.actionPointsOfficesUnsubscribe();
    this.actionPointsCategoriesUnsubscribe();
    this.updateActionPointUnsubscribe();
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

  extractIds(actionPoint: ActionPoint): EditableActionPoint {
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

  getRelationType({partner, cp_output, intervention}: Partial<EditableActionPoint>): string {
    if (partner) {
      return this.relationType[0].value;
    } else if (cp_output) {
      return this.relationType[1].value;
    } else if (intervention) {
      return this.relationType[2].value;
    } else {
      return '-';
    }
  }
  // TODO refactor if it possible
  switchRelationContent(relationType: string): void {
    if (!relationType) {
      return;
    }
    this.relationContent = this.relatedMap.get(relationType) || [];
    if (!this.relationContent.length) {
      return;
    }
    switch (relationType) {
      case this.relationType[0].value:
        if (!this.editedData.partner) {
          this.editedData.partner = this.relationContent[0].id;
        }
        this.editedData.cp_output = null;
        this.editedData.intervention = null;
        break;
      case this.relationType[1].value:
        if (!this.editedData.cp_output) {
          this.editedData.cp_output = this.relationContent[0].id;
        }
        this.editedData.partner = null;
        this.editedData.intervention = null;
        break;
      case this.relationType[2].value:
        if (!this.editedData.intervention) {
          this.editedData.intervention = this.relationContent[0].id;
        }
        this.editedData.partner = null;
        this.editedData.cp_output = null;
        break;
    }
  }

  updateEditableDataRelationContent(selectedItem: EtoolsPartner | EtoolsCpOutput | EtoolsIntervention): void {
    if (this.editedData.partner) {
      this.updateModelValue('partner', selectedItem && selectedItem.id);
    } else if (this.editedData.cp_output) {
      this.updateModelValue('cp_output', selectedItem && selectedItem.id);
    } else if (this.editedData.intervention) {
      this.updateModelValue('intervention', selectedItem && selectedItem.id);
    }
  }

  getRelatedContent({partner, cp_output, intervention}: Partial<EditableActionPoint>): number | null | undefined {
    if (partner) {
      return this.editedData.partner;
    } else if (cp_output) {
      return this.editedData.cp_output;
    } else if (intervention) {
      return this.editedData.intervention;
    } else {
      return null;
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    setTextareasMaxHeight(this.textareas);
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
