import {LitElement, property} from 'lit-element';
import {getDifference} from '../../../../../utils/objects-diff';
import {store} from '../../../../../../redux/store';
import {updateActivityDetails} from '../../../../../../redux/effects/activity-details.effects';
import clone from 'ramda/es/clone';
import {DataMixin} from '../../../../../common/mixins/data-mixin';
import {SetEditedDetailsCard} from '../../../../../../redux/actions/activity-details.actions';
import {
  activityDetailsData,
  activityDetailsError,
  activityDetailsIsLoad,
  detailsEditedCard
} from '../../../../../../redux/selectors/activity-details.selectors';
import {Unsubscribe} from 'redux';
import {fireEvent} from '../../../../../utils/fire-custom-event';

export class BaseDetailsCard extends DataMixin()<IActivityDetails>(LitElement) {
  @property() isEditMode: boolean = false;
  @property() isUpdate: boolean = false;
  @property() editedCard: string | null = null;
  @property({type: Boolean}) isLoad: boolean = false;

  private isLoadUnsubscribe!: Unsubscribe;

  connectedCallback(): void {
    super.connectedCallback();
    store.subscribe(
      activityDetailsData((data: IActivityDetails | null) => {
        this.data = data;
      })
    );
    store.subscribe(
      activityDetailsError((errors: GenericObject | null) => {
        this.errors = errors || {};
      })
    );
    store.subscribe(
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
  }

  protected save(): void {
    const diff: Partial<IActivityDetails> = getDifference<IActivityDetails>(this.originalData || {}, this.editedData, {
      toRequest: true
    });
    if (Object.entries(diff).length && this.editedData.id) {
      this.isUpdate = true;
      store.dispatch<AsyncEffect>(updateActivityDetails(this.editedData.id, diff)).then(() => this.finish());
    } else {
      this.isEditMode = false;
      store.dispatch(new SetEditedDetailsCard(null));
    }
  }

  protected finish(): void {
    const errors: string[] = this.errors.data || [];
    this.isUpdate = false;
    if (!errors.length) {
      this.isEditMode = false;
      store.dispatch(new SetEditedDetailsCard(null));
    }
    for (const error of errors) {
      fireEvent(this, 'toast', {text: error});
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
    return (
      !this.editedData ||
      !(this.editedData as IActivityDetails).permissions.edit[field as keyof ActivityPermissionsObject]
    );
  }

  protected havePossibilityToEditCard(cardName: string, cardFields: string[]): boolean {
    const cardFieldsAreReadonly: boolean = cardFields.every((field: string) => this.isFieldReadonly(field));
    return (!this.editedCard || this.editedCard === cardName) && !cardFieldsAreReadonly;
  }
}
