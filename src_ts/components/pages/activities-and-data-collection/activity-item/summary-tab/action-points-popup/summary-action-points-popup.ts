import {css, LitElement, TemplateResult, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {template} from './summary-action-points-popup.tpl';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {store} from '../../../../../../redux/store';
import {staticDataDynamic} from '../../../../../../redux/selectors/static-data.selectors';
import {
  ACTION_POINTS_CATEGORIES,
  ACTION_POINTS_DETAILS,
  ACTION_POINTS_OFFICES,
  USERS
} from '../../../../../../endpoints/endpoints-list';
import {loadStaticData} from '../../../../../../redux/effects/load-static-data.effect';
import {DataMixin} from '../../../../../common/mixins/data-mixin';
import {SectionsMixin} from '../../../../../common/mixins/sections-mixin';
import {Unsubscribe} from 'redux';
import {getDifference} from '@unicef-polymer/etools-utils/dist/equality-comparisons.util';
import {INTERVENTION, LEVELS, OUTPUT, PARTNER} from '../../../../../common/dropdown-options';
import {applyDropdownTranslation} from '../../../../../utils/translation-helper';
import {get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {activeLanguageSelector} from '../../../../../../redux/selectors/active-language.selectors';
import {CardStyles} from '../../../../../styles/card-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {request} from '../../../../../../endpoints/request';
import {getEndpoint} from '../../../../../../endpoints/endpoints';

@customElement('summary-action-points-popup')
export class SummaryActionPointsPopup extends SectionsMixin(DataMixin()<EditableActionPoint>(LitElement)) {
  @property() dialogOpened = true;
  @property() users: User[] = [];
  @property() offices: ActionPointsOffice[] = store.getState().staticData.offices;
  @property() categories: ActionPointsCategory[] = store.getState().staticData.actionPointsCategories;
  @property() selectedRelatedTo: string | null = null;
  @property() activityDetails!: IActivityDetails;

  @property() savingInProcess: boolean | null = false;
  @property() levels: DefaultDropdownOption<string>[] = applyDropdownTranslation(LEVELS);
  @property() url: string | null = null;

  mappings: Map<string, RelatedToFields> = new Map<string, RelatedToFields>([
    [PARTNER, 'partner'],
    [OUTPUT, 'cp_output'],
    [INTERVENTION, 'intervention']
  ]);

  liteInterventions: LiteIntervention[] = [];

  set dialogData({action_point, activity_id, activityDetails}: ActionPointPopupData) {
    this.data = {
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

    if (action_point) {
      this.data = this.extractIds(action_point);
      this.url = action_point.url;
    }

    this.activityDetails = activityDetails;
    this.activityId = activity_id;
    this.liteInterventions = (this.activityDetails.interventions || []).map((x) => ({id: x.id, name: x.number}));
    this.selectedRelatedTo = this.getRelatedTo(this.editedData);
  }

  private activityId!: number;
  private userUnsubscribe!: Unsubscribe;
  private actionPointsOfficesUnsubscribe!: Unsubscribe;
  private actionPointsCategoriesUnsubscribe!: Unsubscribe;
  private activeLanguageUnsubscribe!: Unsubscribe;

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
          this.users = users.filter((u) => u.user_type === 'staff');
        },
        [USERS]
      )
    );

    this.actionPointsOfficesUnsubscribe = store.subscribe(
      staticDataDynamic(
        (offices: ActionPointsOffice[] | undefined) => {
          if (offices) {
            this.offices = offices;
          }
        },
        [ACTION_POINTS_OFFICES]
      )
    );

    this.actionPointsCategoriesUnsubscribe = store.subscribe(
      staticDataDynamic(
        (categories: ActionPointsCategory[] | undefined) => {
          if (categories) {
            this.categories = categories;
          }
        },
        [ACTION_POINTS_CATEGORIES]
      )
    );

    this.activeLanguageUnsubscribe = store.subscribe(
      activeLanguageSelector(() => {
        this.levels = applyDropdownTranslation(LEVELS);
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.userUnsubscribe();
    this.actionPointsOfficesUnsubscribe();
    this.actionPointsCategoriesUnsubscribe();
    this.activeLanguageUnsubscribe();
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  async save() {
    this.errors = {};
    const target: Partial<EditableActionPoint> =
      this.originalData !== null
        ? getDifference<EditableActionPoint>(this.originalData, this.editedData, {toRequest: true})
        : this.editedData;
    const isEmpty = !Object.keys(target).length;

    if (isEmpty && this.editedData.id) {
      this.dialogOpened = false;
      this.onClose();
      fireEvent(this, 'toast', {
        text: getTranslation('CHANGES_SAVED')
      });
    } else {
      this.checkRequiredFields();
      if (!Object.keys(this.errors).length) {
        let id = '';
        let method = 'POST';
        if (this.editedData.id) {
          id = `${this.editedData.id}/`;
          method = 'PATCH';
        }

        const {url}: IResultEndpoint = getEndpoint(ACTION_POINTS_DETAILS, {activityId: this.activityId, id});

        return await request<ActionPoint>(url, {method: method, body: JSON.stringify(this.editedData)})
          .then(() => {
            fireEvent(this, 'toast', {
              text: getTranslation('ACTION_POINT_CREATED')
            });
            this.onClose();
          })
          .catch((_error: GenericObject) => {
            fireEvent(this, 'toast', {
              text: getTranslation('ERROR_ACTION_POINT_CREATE')
            });
          });
      }
    }
  }

  getRelatedNames(): EtoolsPartner[] | EtoolsCpOutput[] | LiteIntervention[] {
    switch (this.selectedRelatedTo) {
      case PARTNER:
        return this.activityDetails.partners || [];
      case OUTPUT:
        return this.activityDetails.cp_outputs || [];
      case INTERVENTION:
        return this.liteInterventions;
      default:
        return [];
    }
  }

  setSelectedRelatedTo(relationType: string): void {
    if (relationType && relationType !== this.selectedRelatedTo) {
      this.selectedRelatedTo = relationType;
      this.editedData.partner = null;
      this.editedData.cp_output = null;
      this.editedData.intervention = null;
    }
  }

  updateEditableDataRelationContent(selectedItem: EtoolsPartner | EtoolsCpOutput | LiteIntervention): void {
    const FIELD: RelatedToFields | undefined = this.mappings.get(this.selectedRelatedTo || '');
    if (FIELD) {
      this.updateModelValue(FIELD, selectedItem && selectedItem.id);
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

  private checkRequiredFields(): void {
    const errorMessage = getTranslation('THIS_FIELD_IS_REQUIRED');
    if (!this.editedData.description) {
      this.errors.description = errorMessage;
    }
    if (!this.editedData.assigned_to) {
      this.errors.assigned_to = errorMessage;
    }
    if (!this.editedData.section) {
      this.errors.section = errorMessage;
    }
    if (!this.editedData.office) {
      this.errors.office = errorMessage;
    }
    if (!this.selectedRelatedTo) {
      this.errors.related_to = errorMessage;
    }
    if (!this.getSelectedRelatedName()) {
      this.errors.related_name = errorMessage;
    }
    if (!this.editedData.category) {
      this.errors.category = errorMessage;
    }
  }

  private extractIds(actionPoint: ActionPoint): EditableActionPoint {
    return {
      id: actionPoint.id || null,
      category: actionPoint.category || null,
      assigned_to: actionPoint.assigned_to?.id || null,
      high_priority: actionPoint.high_priority || false,
      due_date: actionPoint.due_date || null,
      description: actionPoint.description || '',
      office: actionPoint.office?.id || null,
      section: actionPoint.section?.id || null,
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
      CardStyles,
      layoutStyles,
      css`
        .priority-container {
          display: flex;
          height: 62px;
        }

        .priority {
          display: flex;
          align-items: flex-end;
        }
        .action-point-link {
          display: flex;
          align-items: center;
          padding: 0 12px;
        }

        datepicker-lite {
          white-space: nowrap;
          --etools-icon-fill-color: var(--secondary-text-color);
        }

        .additional-padding {
          padding-bottom: 8px;
        }
      `
    ];
  }
}
