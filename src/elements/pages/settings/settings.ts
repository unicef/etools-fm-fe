import { loadPermissions } from '../../redux-store/effects/load-permissions.effect';

class Settings extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.ReduxMixin], Polymer.Element) {
    public static get is() { return 'fm-settings'; }

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
                    {name: 'cp outputs', query: 'cp-outputs'},
                    {name: 'sites', query: 'sites'},
                    {name: 'methods', query: 'methods'}
                ]
            }
        };
    }

    public static get observers() {
        return [
            '_routeChanged(route.path)'
        ];
    }

    public _routeChanged(path: string) {
        const prefix = _.get(this, 'route.prefix', '');
        if (!~prefix.indexOf('settings')) { return; }
        if (!path.match(/[^\\/]/g)) {
            this.set('route.path', '/cp-outputs');
        }
    }

    public connectedCallback() {
        super.connectedCallback();
        const methodTypesEndpoint = this.getEndpoint('methodTypes');
        const siteLocationsEndpoint = this.getEndpoint('siteLocations');
        this.dispatchOnStore(loadPermissions(methodTypesEndpoint.url, 'methodTypes'));
        this.dispatchOnStore(loadPermissions(siteLocationsEndpoint.url, 'siteLocations'));
    }
}

customElements.define(Settings.is, Settings);
