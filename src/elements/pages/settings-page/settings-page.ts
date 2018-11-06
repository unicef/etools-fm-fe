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
        const endpoint = this.getEndpoint('methodTypes');
        this.dispatchOnStore(loadPermissions(endpoint.url, 'methodTypes'));
    }
}

customElements.define(SettingsPage.is, SettingsPage);
