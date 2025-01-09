import {css, LitElement, TemplateResult, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {template} from './tpm-action-points-popup.tpl';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {store} from '../../../../../../redux/store';
import {staticDataDynamic} from '../../../../../../redux/selectors/static-data.selectors';
import {ACTION_POINTS_CATEGORIES} from '../../../../../../endpoints/endpoints-list';
import {loadStaticData} from '../../../../../../redux/effects/load-static-data.effect';
import {DataMixin} from '../../../../../common/mixins/data-mixin';
import {SectionsMixin} from '../../../../../common/mixins/sections-mixin';
import {Unsubscribe} from 'redux';
import {updateTPMActionPoint} from '../../../../../../redux/effects/action-points.effects';
import {tpmActionPointsUpdateStatusSelector} from '../../../../../../redux/selectors/tpm-action-points.selectors';
import {InterventionsMixin} from '../../../../../common/mixins/interventions-mixin';
import {PartnersMixin} from '../../../../../common/mixins/partners-mixin';
import {CpOutputsMixin} from '../../../../../common/mixins/cp-outputs-mixin';
import {getDifference} from '../../../../../utils/objects-diff';
import {get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {CardStyles} from '../../../../../styles/card-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';

@customElement('tpm-action-points-popup')
export class TPMActionPointsPopup extends InterventionsMixin(
  PartnersMixin(CpOutputsMixin(SectionsMixin(DataMixin()<EditableTPMActionPoint>(LitElement))))
) {
  @property() dialogOpened = true;
  @property() categories!: ActionPointsCategory[];
  @property() showInactive = false;
  @property() savingInProcess: boolean | null = false;

  liteInterventions: LiteIntervention[] = [];

  set dialogData({tpm_action_point, activity_id}: TPMActionPointPopupData) {
    if (tpm_action_point) {
      this.data = this.extractIds(tpm_action_point);
    } else {
      this.data = {
        id: null,
        description: '',
        category: null,
        high_priority: false
      };
    }
    this.activityId = activity_id;
  }

  private activityId!: number;
  private updateActionPointStatusUnsubscribe!: Unsubscribe;
  private actionPointsCategoriesUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.categories = store.getState().staticData.actionPointsCategories;
    if (!this.categories) {
      store.dispatch<AsyncEffect>(loadStaticData(ACTION_POINTS_CATEGORIES));
    }

    this.updateActionPointStatusUnsubscribe = store.subscribe(
      tpmActionPointsUpdateStatusSelector((updateInProcess: boolean | null) => {
        this.savingInProcess = updateInProcess;
        if (!this.savingInProcess) {
          this.errors = store.getState().actionPointsList.error.data;
          if (!this.errors || !Object.keys(this.errors).length) {
            this.dialogOpened = false;
            this.onClose();
          }
        }
      }, false)
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
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.actionPointsCategoriesUnsubscribe();
    this.updateActionPointStatusUnsubscribe();
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  save(): void {
    this.errors = {};
    const target: Partial<EditableTPMActionPoint> =
      this.originalData !== null
        ? getDifference<EditableTPMActionPoint>(this.originalData, this.editedData, {toRequest: true})
        : this.editedData;
    const isEmpty = !Object.keys(target).length;

    if (isEmpty && this.editedData.id) {
      this.dialogOpened = false;
      this.onClose();
    } else {
      this.checkRequiredFields();
      if (!Object.keys(this.errors).length) {
        store.dispatch<AsyncEffect>(updateTPMActionPoint(this.activityId, this.editedData));
      }
    }
  }

  private checkRequiredFields(): void {
    const errorMessage = getTranslation('THIS_FIELD_IS_REQUIRED');
    if (!this.editedData.description) {
      this.errors.description = errorMessage;
    }
    if (!this.editedData.category) {
      this.errors.category = errorMessage;
    }
  }

  private extractIds(tpmActionPoint: TPMActionPoint): EditableTPMActionPoint {
    return {
      id: tpmActionPoint.id,
      category: tpmActionPoint.category,
      high_priority: tpmActionPoint.high_priority,
      description: tpmActionPoint.description
    };
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
