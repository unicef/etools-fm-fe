class SitesTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.PermissionController,
    FMMixins.ReduxMixin,
    FMMixins.RouteHelperMixin], Polymer.Element) {
    public static get is() {
        return 'sites-tab';
    }
}

customElements.define(SitesTab.is, SitesTab);
