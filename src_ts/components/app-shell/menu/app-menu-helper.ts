import {PolymerElement} from '@polymer/polymer/polymer-element';
import {SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY} from '../../../config/config';
import {AppDrawerLayoutElement} from '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import {AppDrawerElement} from '@polymer/app-layout/app-drawer/app-drawer';
import {AppHeaderLayoutElement} from '@polymer/app-layout/app-header-layout/app-header-layout';

/**
 * Helper class to control app small menu behavior
 */
export class AppMenuHelper {

  private appShellEl: PolymerElement;
  private drawerLayout: AppDrawerLayoutElement;
  private drawer: AppDrawerElement;
  private appHeaderLayout: AppHeaderLayoutElement;
  private SMALL_MENU_PROP_NAME: string = 'smallMenu';

  constructor(appShellEl: PolymerElement) {
    if (appShellEl.get(this.SMALL_MENU_PROP_NAME) === undefined) {
      throw new Error('You need to define smallMenu property on app-shell element!');
    }
    this.appShellEl = appShellEl;
    this.drawerLayout = this.appShellEl.shadowRoot!.querySelector('#layout') as AppDrawerLayoutElement;
    this.drawer = this.appShellEl.shadowRoot!.querySelector('#drawer') as AppDrawerElement;
    this.appHeaderLayout = this.appShellEl.shadowRoot!
        .querySelector('#appHeadLayout') as AppHeaderLayoutElement;
  }

  public initMenuListeners(): void {
    this._toggleSmallMenu = this._toggleSmallMenu.bind(this);
    this._resizeMainLayout = this._resizeMainLayout.bind(this);
    this._toggleDrawer = this._toggleDrawer.bind(this);

    this.appShellEl.addEventListener('toggle-small-menu', this._toggleSmallMenu);
    this.appShellEl.addEventListener('resize-main-layout', this._resizeMainLayout);
    this.appShellEl.addEventListener('drawer', this._toggleDrawer);
  }

  public removeMenuListeners(): void {
    this.appShellEl.removeEventListener('toggle-small-menu', this._toggleSmallMenu);
    this.appShellEl.removeEventListener('resize-main-layout', this._resizeMainLayout);
    this.appShellEl.removeEventListener('drawer', this._toggleDrawer);
  }

  public initMenuSize(): void {
    this.appShellEl.set(this.SMALL_MENU_PROP_NAME, AppMenuHelper.isSmallMenuActive());
  }

  public static isSmallMenuActive(): boolean {
    /**
     * SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY value must be 0 or 1
     */
    const menuTypeStoredVal: string | null = localStorage.getItem(SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY);
    if (!menuTypeStoredVal) {
      return false;
    }
    return !!parseInt(menuTypeStoredVal, 10);
  }

  private _toggleSmallMenu(e: Event): void {
    e.stopImmediatePropagation();
    this.appShellEl.set(this.SMALL_MENU_PROP_NAME, !this.appShellEl.get(this.SMALL_MENU_PROP_NAME));
    AppMenuHelper.smallMenuValueChanged(this.appShellEl.get(this.SMALL_MENU_PROP_NAME));
  }

  protected _resizeMainLayout(e: Event) {
    e.stopImmediatePropagation();
    this._updateDrawerStyles();
    this._notifyLayoutResize();
  }

  public static smallMenuValueChanged(newVal: boolean) {
    const localStorageVal: number = newVal ? 1 : 0;
    localStorage.setItem(SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY, String(localStorageVal));
  }

  private _updateDrawerStyles(): void {
    this.drawerLayout.updateStyles();
    this.drawer.updateStyles();
  }

  private _notifyLayoutResize(): void {
    this.drawerLayout.notifyResize();
    this.appHeaderLayout.notifyResize();
  }

  private _toggleDrawer(): void {
    this.drawer.toggle();
  }
}
