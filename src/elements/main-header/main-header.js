'use strict';

class MainHeader extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig, FMMixins.ReduxMixin], Polymer.Element) {

    static get is() {return 'main-header';}

    static get properties() {
        return {
            user: Object
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('main_refresh', this._refreshPage);
        this.addEventListener('sign-out', this._logout);

        this.subscribeOnStore(store => store.userData, (user) => {
            if (user) {this.user = user;}
        });
    }

    ready() {
        super.ready();
        this._isStaging();
    }

    _isStaging() {
        if (this.isStagingServer()) {
            this.$.envWarningIf.if = true;
        }
    }

    openDrawer() {
        this.dispatchEvent(new CustomEvent('drawer'));
    }

    _refreshPage(event) {
        event.stopImmediatePropagation();
        this.$.refresh.refresh();
    }

    _logout() {
        this.resetOldUserData();
        window.location.href = `${window.location.origin}/saml2/logout/`;
    }
}

customElements.define(MainHeader.is, MainHeader);
