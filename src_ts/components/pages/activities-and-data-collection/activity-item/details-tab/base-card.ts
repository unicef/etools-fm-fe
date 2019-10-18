import { LitElement, property } from 'lit-element';
import { getDifference } from '../../../../utils/objects-diff';
import { store } from '../../../../../redux/store';
import { updateActivityDetails } from '../../../../../redux/effects/activity-details.effects';
import clone from 'ramda/es/clone';
import { DataMixin } from '../../../../common/mixins/data-mixin';
import { SetEditedDetailsCard } from '../../../../../redux/actions/activity-details.actions';
import { activityDetailsIsUpdate, detailsEditedCard } from '../../../../../redux/selectors/activity-details.selectors';

export class BaseCard extends DataMixin<IActivityDetails, typeof LitElement>(LitElement) {
    @property() public isReadonly: boolean = true;
    @property() public isUpdate: boolean = false;
    @property() public editedCard: string | null = null;

    public connectedCallback(): void {
        super.connectedCallback();
        store.subscribe(activityDetailsIsUpdate((isUpdate: boolean | null) => {
            this.isUpdate = Boolean(isUpdate);
            if (isUpdate === false) {
                this.isReadonly = true;
                store.dispatch(new SetEditedDetailsCard(null));
            }
        }));
        store.subscribe(detailsEditedCard((editedCard: null | string) => {
            this.editedCard = editedCard;
        }));
    }

    public save(): void {
        this.isReadonly = false;
        const diff: Partial<IActivityDetails> = getDifference<IActivityDetails>(this.originalData, this.editedData, {
            toRequest: true
        });
        if (Object.entries(diff).length && this.editedData.id) {
            store.dispatch<AsyncEffect>(updateActivityDetails(this.editedData.id, diff));
        } else {
            this.isReadonly = true;
            store.dispatch(new SetEditedDetailsCard(null));
        }
    }

    public cancel(): void {
        this.isReadonly = true;
        this.editedData = clone(this.originalData);
        store.dispatch(new SetEditedDetailsCard(null));
    }
}
