'use strict';

class MainHeader extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig, FMMixins.ReduxMixin], Polymer.Element) {

    public static get is() { return 'main-header'; }

    public static get properties() {
        return {
            user: Object
        };
    }

    public connectedCallback() {
        super.connectedCallback();
        this.addEventListener('main_refresh', this.refreshPage);
        this.addEventListener('sign-out', this.logout);

        this.subscribeOnStore((store: FMStore) => store.userData, (user: IUserProfile) => {
            if (user) { this.user = user; }
        });
    }

    public ready() {
        super.ready();
        this.isStaging();
    }

    public openDrawer() {
        this.dispatchEvent(new CustomEvent('drawer'));
    }

    private isStaging() {
        if (this.isStagingServer()) {
            this.$.envWarningIf.if = true;
        }
    }

    private refreshPage(event: CustomEvent) {
        event.stopImmediatePropagation();
        this.$.refresh.refresh();
    }

    private logout() {
        this.resetOldUserData();
        window.location.href = `${window.location.origin}/saml2/logout/`;
    }
}

customElements.define(MainHeader.is, MainHeader);
