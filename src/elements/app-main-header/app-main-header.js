'use strict';

class AppMainHeader extends APDMixins.AppConfig(Polymer.Element) {
    static get is() {return 'app-main-header';}

    static get properties() {
        return {
            user: {
                type: Object
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('main_refresh', this._refreshPage);
        this.addEventListener('sign-out', this._logout);
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

customElements.define(AppMainHeader.is, AppMainHeader);
