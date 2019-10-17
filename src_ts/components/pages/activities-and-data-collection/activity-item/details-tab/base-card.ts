import { LitElement, property } from 'lit-element';
import { getDifference } from '../../../../utils/objects-diff';
import { store } from '../../../../../redux/store';
import { updateActivityDetails } from '../../../../../redux/effects/activity-details.effects';
import clone from 'ramda/es/clone';
import { DataMixin } from '../../../../common/mixins/data-mixin';

export class BaseCard extends DataMixin<IActivityDetails, typeof LitElement>(LitElement) {
    @property() public isReadonly: boolean = true;

    public save(): void {
        this.isReadonly = false;
        const diff: Partial<IActivityDetails> = getDifference<IActivityDetails>(this.originalData, this.editedData, {
            toRequest: true
        });
        if (Object.entries(diff).length && this.editedData.id) {
            store.dispatch<AsyncEffect>(updateActivityDetails(this.editedData.id, diff));
        } else {
            this.isReadonly = true;
        }
    }

    public cancel(): void {
        this.isReadonly = true;
        this.editedData = clone(this.originalData);
    }
}
