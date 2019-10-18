import { LitElement, property } from 'lit-element';
import { getDifference } from '../../../../utils/objects-diff';
import { store } from '../../../../../redux/store';
import { updateActivityDetails } from '../../../../../redux/effects/activity-details.effects';
import clone from 'ramda/es/clone';
import { DataMixin } from '../../../../common/mixins/data-mixin';
import { SetEditedDetailsCard } from '../../../../../redux/actions/activity-details.actions';
import {
    activityDetailsData,
    activityDetailsIsLoad,
    detailsEditedCard
} from '../../../../../redux/selectors/activity-details.selectors';
import { Unsubscribe } from 'redux';

export class BaseDetailsCard extends DataMixin<IActivityDetails, typeof LitElement>(LitElement) {
    @property() public isReadonly: boolean = true;
    @property() public isUpdate: boolean = false;
    @property() public editedCard: string | null = null;
    @property({ type: Boolean }) public isLoad: boolean = false;

    private isLoadUnsubscribe!: Unsubscribe;
    public connectedCallback(): void {
        super.connectedCallback();
        store.subscribe(activityDetailsData((data: IActivityDetails | null) => {
            this.data = data;
        }));
        store.subscribe(detailsEditedCard((editedCard: null | string) => {
            this.editedCard = editedCard;
        }));
        this.isLoadUnsubscribe = store.subscribe(activityDetailsIsLoad((isLoad: boolean | null) => {
            this.isLoad = Boolean(isLoad);
        }));
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.isLoadUnsubscribe();
    }

    protected save(): void {
        this.isReadonly = false;
        const diff: Partial<IActivityDetails> = getDifference<IActivityDetails>(this.originalData || {}, this.editedData, {
            toRequest: true
        });
        if (Object.entries(diff).length && this.editedData.id) {
            this.isUpdate = true;
            store.dispatch<AsyncEffect>(updateActivityDetails(this.editedData.id, diff))
                .then(() => this.finish());
        } else {
            this.isReadonly = true;
            store.dispatch(new SetEditedDetailsCard(null));
        }
    }

    protected finish(): void {
        this.isReadonly = true;
        this.isUpdate = false;
        store.dispatch(new SetEditedDetailsCard(null));
    }

    protected cancel(): void {
        this.isReadonly = true;
        this.data = clone(this.originalData);
        store.dispatch(new SetEditedDetailsCard(null));
    }

    protected startEdit(): void {
        this.isReadonly = false;
    }
}
