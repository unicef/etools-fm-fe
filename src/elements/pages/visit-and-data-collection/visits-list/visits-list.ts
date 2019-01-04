class VisitsList extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.RouteHelperMixin,
    FMMixins.ReduxMixin], Polymer.Element) {
    public static get is() { return 'visits-list'; }

    public static get properties() {
        return { };
    }

    public connectedCallback() {
        super.connectedCallback();
    }

}

customElements.define(VisitsList.is, VisitsList);
