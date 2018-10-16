class AppSidebarMenu extends APDMixins.AppConfig(Polymer.Element) {
    static get is() {return 'app-sidebar-menu';}

    static get properties() {
        return {
            page: String
        };
    }

    _toggleDrawer() {
        this.dispatchEvent(new CustomEvent('drawer-toggle-tap', {bubbles: true, composed: true}));
    }
}

window.customElements.define(AppSidebarMenu.is, AppSidebarMenu);
