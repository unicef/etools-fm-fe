class SettingsPage extends Polymer.Element {
    public static get is() { return 'settings-page'; }

    public static get properties() {
        return {
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

}

customElements.define(SettingsPage.is, SettingsPage);
