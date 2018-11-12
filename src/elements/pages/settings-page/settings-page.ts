import { loadPermissions } from '../../redux-store/effects/load-permissions.effect';

class SettingsPage extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.ReduxMixin], Polymer.Element) {
    public static get is() { return 'settings-page'; }

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

customElements.define(SettingsPage.is, SettingsPage);
