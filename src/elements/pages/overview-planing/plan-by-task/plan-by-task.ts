import { getEndpoint } from '../../../app-config/app-config';
import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';

class PlanByTask extends EtoolsMixinFactory.combineMixins([
    FMMixins.ProcessDataMixin,
    FMMixins.CommonMethods,
    FMMixins.ReduxMixin,
    FMMixins.RouteHelperMixin], Polymer.Element) {

    public static get is() { return 'plan-by-task'; }

    public static get properties() {
        return {
            selectedYear: {
                type: Number,
                observer: 'setYear'
            }
        };
    }

    public connectedCallback() {
        super.connectedCallback();
        this.addEventListener('add-new', () => this.openDialog());

    }

    public setYear(year: number) {
        if (year) {
            const endpoint = getEndpoint('planingTasks', {year});
            this.dispatchOnStore(loadPermissions(endpoint.url, 'planingTasks'));
        }
    }

    public openDialog() {

    }
}

customElements.define(PlanByTask.is, PlanByTask);