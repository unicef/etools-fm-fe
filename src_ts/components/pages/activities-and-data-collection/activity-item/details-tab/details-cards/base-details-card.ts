import {LitElement, property} from 'lit-element';
import {getDifference} from '../../../../../utils/objects-diff';
import {store} from '../../../../../../redux/store';
import {createActivityDetails, updateActivityDetails} from '../../../../../../redux/effects/activity-details.effects';
import clone from 'ramda/es/clone';
import {DataMixin} from '../../../../../common/mixins/data-mixin';
import {ActivityDetailsCreation, SetEditedDetailsCard} from '../../../../../../redux/actions/activity-details.actions';
import {
  activityDetailsData,
  activityDetailsError,
  activityDetailsIsLoad,
  detailsEditedCard
} from '../../../../../../redux/selectors/activity-details.selectors';
import {Unsubscribe} from 'redux';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {updateAppLocation} from '../../../../../../routing/routes';
import {getErrorText} from '../../../../../utils/utils';

export class BaseDetailsCard extends DataMixin()<IActivityDetails>(LitElement) {
  @property() isEditMode = false;
  @property() isUpdate = false;
  @property() editedCard: string | null = null;
  @property({type: Boolean}) isLoad = false;

  private isLoadUnsubscribe!: Unsubscribe;
  private activityDetailsUnsubscribe!: Unsubscribe;
  private errorUnsubscribe!: Unsubscribe;
  private editedCardUnsubscribe!: Unsubscribe;

  connectedCallback(): void {
    super.connectedCallback();
    this.activityDetailsUnsubscribe = store.subscribe(
      activityDetailsData((data: IActivityDetails | null) => {
        this.data = data;
      })
    );
    this.errorUnsubscribe = store.subscribe(
      activityDetailsError((errors: GenericObject | null) => {
        this.errors = errors || {};
      })
    );
    this.editedCardUnsubscribe = store.subscribe(
      detailsEditedCard((editedCard: null | string) => {
        this.editedCard = editedCard;
      })
    );
    this.isLoadUnsubscribe = store.subscribe(
      activityDetailsIsLoad((isLoad: boolean | null) => {
        this.isLoad = Boolean(isLoad);
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.isLoadUnsubscribe();
    this.activityDetailsUnsubscribe();
    this.errorUnsubscribe();
    this.editedCardUnsubscribe();
  }

  protected save(): void {
    const diff: Partial<IActivityDetails> = getDifference<IActivityDetails>(this.originalData || {}, this.editedData, {
      toRequest: true
    });
    if (Object.entries(diff).length) {
      this.isUpdate = true;
      if (this.editedData.id) {
        store.dispatch<AsyncEffect>(updateActivityDetails(this.editedData.id, diff)).then(() => this.finish());
      } else {
        store.dispatch<AsyncEffect>(createActivityDetails(diff)).then(({payload}: ActivityDetailsCreation) => {
          this.finish();
          if (payload && payload.id) {
            updateAppLocation(`activities/${payload.id}/details/`);
          }
        });
      }
    } else {
      this.isEditMode = false;
      store.dispatch(new SetEditedDetailsCard(null));
    }
  }

  protected finish(): void {
    const errorText = getErrorText(this.errors);
    this.isUpdate = false;
    if (!errorText.length) {
      this.isEditMode = false;
      store.dispatch(new SetEditedDetailsCard(null));
    } else {
      fireEvent(this, 'toast', {text: errorText});
    }
  }

  protected cancel(): void {
    this.isEditMode = false;
    this.data = clone(this.originalData);
    store.dispatch(new SetEditedDetailsCard(null));
  }

  protected startEdit(): void {
    this.isEditMode = true;
  }

  protected isFieldReadonly(field: string): boolean {
    if (this.editedData && (this.editedData as IActivityDetails).permissions) {
      return !(this.editedData as IActivityDetails).permissions.edit[field as keyof ActivityPermissionsObject];
    } else {
      return false;
    }
  }

  protected havePossibilityToEditCard(cardName: string, cardFields: string[]): boolean {
    const cardFieldsAreReadonly: boolean = cardFields.every((field: string) => this.isFieldReadonly(field));
    return (!this.editedCard || this.editedCard === cardName) && !cardFieldsAreReadonly;
  }
}
