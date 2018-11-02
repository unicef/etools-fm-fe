(function() {
    class SidebarMenu extends FMMixins.AppConfig(Polymer.Element) {
        public static get is() { return 'sidebar-menu'; }

        public static get properties() {
            return {
                page: String,
                items: {
                    type: Array,
                    value: () => [
                        {
                            view: 'settings',
                            name: 'Settings',
                            icon: 'settings',
                            link: 'settings'
                        }, {
                            view: 'overview-planing',
                            name: 'Overview Planing',
                            icon: 'av:playlist-add-check',
                            link: 'overview-planing'
                        }, {
                            view: 'assign-visits',
                            name: 'Assign Visits',
                            icon: 'communication:location-on',
                            link: 'assign-visits'
                        }, {
                            view: 'data-collection',
                            name: 'Visit & Data Collection',
                            icon: 'assignment',
                            link: 'data-collection'
                        }, {
                            view: 'analysis',
                            name: 'Analysis',
                            icon: 'av:equalizer',
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

        public toggleDrawer() {
            this.dispatchEvent(new CustomEvent('drawer-toggle-tap', {bubbles: true, composed: true}));
        }
    }

    window.customElements.define(SidebarMenu.is, SidebarMenu);
})();
