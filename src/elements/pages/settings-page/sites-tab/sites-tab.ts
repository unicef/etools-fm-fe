class SitesTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.PermissionController,
    FMMixins.ReduxMixin,
    FMMixins.QueryParamsMixin], Polymer.Element) {
    public static get is() {
        return 'sites-tab';
    }

    public static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            queryParams: {
                type: Object,
                observer: '_updateQueries'
            }
        };
    }

    public static get observers() {
        return [
            '_setActive(isActive)'
        ];
    }

    public _setActive(isActive: boolean) {
        if (!isActive) { return; }
        // this._initQueryParams();
    }

    public _updateQueries(): any {
        if (!this.isActive) { return; }
        this.preservedListQueryParams = this.queryParams;
        this.updateQueries(this.queryParams);
    }
}

customElements.define(SitesTab.is, SitesTab);
