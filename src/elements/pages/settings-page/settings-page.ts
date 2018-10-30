class SettingsPage extends Polymer.Element {
    public static get is() { return 'settings-page'; }

    public static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            routeData: Object,
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

}

customElements.define(SettingsPage.is, SettingsPage);
