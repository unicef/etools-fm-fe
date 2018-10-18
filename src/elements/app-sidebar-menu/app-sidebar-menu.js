class AppSidebarMenu extends FMMixins.AppConfig(Polymer.Element) {
    static get is() {return 'app-sidebar-menu';}

    static get properties() {
        return {
            page: String,
            items: {
                type: Array,
                value: () => [
                    {
                        view: 'settings',
                        name: 'Settings',
                        icon: 'settings-applications',
                        link: 'settings'
                    },  {
                        view: 'overview-planing',
                        name: 'Overview Planing',
                        icon: 'assignment-turned-in',
                        link: 'overview-planing'
                    },  {
                        view: 'assign-visits',
                        name: 'Assign Visits',
                        icon: 'communication:location-on',
                        link: 'assign-visits'
                    },  {
                        view: 'data-collection',
                        name: 'Visit & Data Collection',
                        icon: 'assignment',
                        link: 'data-collection'
                    },  {
                        view: 'analysis',
                        name: 'Analysis',
                        icon: 'assessment',
                        link: 'analysis'
                    }
                ]
            },
            opened: {
                type: Boolean,
                reflectToAttribute: true
            }
        };
    }

    _toggleDrawer() {
        this.dispatchEvent(new CustomEvent('drawer-toggle-tap', {bubbles: true, composed: true}));
    }
}

window.customElements.define(AppSidebarMenu.is, AppSidebarMenu);
