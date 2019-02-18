import { loadVisitDetails } from '../../../redux-store/effects/visit-details.effects';
import { RunGlobalLoading, StopGlobalLoading } from '../../../redux-store/actions/global-loading.actions';

class VisitDetails extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.RouteHelperMixin,
    FMMixins.ReduxMixin], Polymer.Element) {
    public static get is() { return 'visit-details'; }

    public static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            lastTab: String,
            tabs: {
                type: Array,
                value: () => [
                    {name: 'details', query: 'details'},
                    {name: 'overview', query: 'overview'},
                    {name: 'data collection', query: 'data-collection'},
                    {name: 'summary', query: 'summary'},
                    {name: 'attachments', query: 'attachments'}
                ]
            }
        };
    }

    public static get observers() {
        return [
            '_routeChanged(routeData.id, route.prefix)'
        ];
    }

    public _routeChanged(id: number) {
        const prefix = R.pathOr('', ['route', 'prefix'], this);
        if (!~prefix.indexOf('visit-details')) { return; }
        const currentVisitId = this.getFromStore('visitDetails.currentVisitId');
        if (isNaN(+id)) {
            this.redirectToNotFound();
        } else if (+id !== +currentVisitId) {
            this.debounceLoading = Polymer.Debouncer.debounce(
                this.debounceLoading, Polymer.Async.timeOut.after(100), () => {
                    this.dispatchOnStore(new RunGlobalLoading({type: 'visit-data', message: 'Loading Visit Data...'}));
                    this.dispatchOnStore(loadVisitDetails(+id))
                        .catch((error: Response) => {
                            if (error.status === 404) { this.redirectToNotFound(); }
                        })
                        .then(() => this.dispatchOnStore(new StopGlobalLoading({type: 'visit-data'})));
                });
        }
    }

    public connectedCallback() {
        super.connectedCallback();
    }

    private redirectToNotFound() {
        this.debounceRedirect = Polymer.Debouncer.debounce(this.debounceRedirect,
            Polymer.Async.timeOut.after(100), () =>
                this.dispatchEvent(new CustomEvent('404', {bubbles: true, composed: true})));
    }
}

customElements.define(VisitDetails.is, VisitDetails);
