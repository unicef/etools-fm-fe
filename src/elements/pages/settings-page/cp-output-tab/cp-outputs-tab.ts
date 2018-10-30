class CpOutputsTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.PermissionController,
    FMMixins.ReduxMixin,
    FMMixins.QueryParamsMixin], Polymer.Element) {
    public static get is() {
        return 'cp-outputs-tab';
    }

    public static get properties() {
        return {
            queryParams: {
                type: Object,
                observer: '_updateQueries',
                notify: true
            }
        };
    }

    public static get observers() {
        return [
            '_setPath(path)'
        ];
    }

    public _setPath(path: string) {
        if (!~path.indexOf('cp-outputs')) { return; }
        this.clearQueries();
        this.updateQueries(this._queryParams, null, true);
    }

    public _updateQueries(): any {
        if (!~this.path.indexOf('cp-outputs')) { return; }
        this._queryParams = this.queryParams;
    }
}

customElements.define(CpOutputsTab.is, CpOutputsTab);
