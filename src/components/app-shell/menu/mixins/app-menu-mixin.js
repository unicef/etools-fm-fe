import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
/**
 * App menu functionality mixin
 * @polymer
 * @mixinFunction
 */
export const AppMenuMixin = dedupingMixin((superClass) => class extends superClass {
    constructor() {
        super(...arguments);
        this.smallMenu = false;
    }
    static get properties() {
        return {
            smallMenu: {
                type: Boolean
            }
        };
    }
    connectedCallback() {
        super.connectedCallback();
        this._initMenuListeners();
        this._initMenuSize();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._removeMenuListeners();
    }
    _initMenuListeners() {
        this._toggleSmallMenu = this._toggleSmallMenu.bind(this);
        this._resizeMainLayout = this._resizeMainLayout.bind(this);
        this._toggleDrawer = this._toggleDrawer.bind(this);
        this.addEventListener('toggle-small-menu', this._toggleSmallMenu);
        this.addEventListener('resize-main-layout', this._resizeMainLayout);
        this.addEventListener('drawer', this._toggleDrawer);
    }
    _removeMenuListeners() {
        this.removeEventListener('toggle-small-menu', this._toggleSmallMenu);
        this.removeEventListener('resize-main-layout', this._resizeMainLayout);
        this.removeEventListener('drawer', this._toggleDrawer);
    }
    _initMenuSize() {
        this.set('smallMenu', this._isSmallMenuActive());
    }
    _isSmallMenuActive() {
        /**
         * etoolsPmpSmallMenu localStorage value must be 0 or 1
         */
        let menuTypeStoredVal = localStorage.getItem('etoolsAppSmallMenuIsActive');
        if (!menuTypeStoredVal) {
            return false;
        }
        return !!parseInt(menuTypeStoredVal, 10);
    }
    _toggleSmallMenu(e) {
        e.stopImmediatePropagation();
        this.set('smallMenu', !this.smallMenu);
        this._smallMenuValueChanged(this.smallMenu);
    }
    _resizeMainLayout(e) {
        e.stopImmediatePropagation();
        this._updateDrawerStyles();
        this._notifyLayoutResize();
    }
    _smallMenuValueChanged(newVal) {
        let localStorageVal = newVal ? 1 : 0;
        localStorage.setItem('etoolsAppSmallMenuIsActive', String(localStorageVal));
    }
    _updateDrawerStyles() {
        let drawerLayout = this.$.layout;
        if (drawerLayout) {
            drawerLayout.updateStyles();
        }
        let drawer = this.$.drawer;
        if (drawer) {
            drawer.updateStyles();
        }
    }
    _notifyLayoutResize() {
        let layout = this.$.layout;
        if (layout) {
            layout.notifyResize();
        }
        let headerLayout = this.$.appHeadLayout;
        if (headerLayout) {
            headerLayout.notifyResize();
        }
    }
    _toggleDrawer() {
        this.$.drawer.toggle();
    }
});
