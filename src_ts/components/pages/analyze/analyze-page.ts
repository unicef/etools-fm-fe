import {CSSResultArray, LitElement, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {store} from '../../../redux/store';
import {routeDetailsSelector} from '../../../redux/selectors/app.selectors';
import {updateAppLocation} from '../../../routing/routes';
import {SharedStyles} from '../../styles/shared-styles';
// eslint-disable-next-line
import {pageContentHeaderSlottedStyles} from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import {buttonsStyles} from '@unicef-polymer/etools-unicef/src/styles/button-styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import '../../common/layout/page-content-header/page-content-header';
import '@unicef-polymer/etools-modules-common/dist/layout/etools-tabs';
import {hasPermission, Permissions} from '../../../config/permissions';
import {PagePermissionsMixin} from '../../common/mixins/page-permissions-mixin';
import {translate} from 'lit-translate';
import {applyPageTabsTranslation} from '../../utils/translation-helper';
import {Unsubscribe} from 'redux';
import {activeLanguageSelector} from '../../../redux/selectors/active-language.selectors';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

const PAGE = 'analyze';

const MONITORING_ACTIVITY = 'monitoring-activity';
const COUNTRY_OVERVIEW = 'country-overview';
const NAVIGATION_TABS: PageTab[] = [
  {
    tab: MONITORING_ACTIVITY,
    tabLabel: 'ANALYZE.NAVIGATION_TABS.MONITORING_ACTIVITY',
    hidden: false
  },
  {
    tab: COUNTRY_OVERVIEW,
    tabLabel: 'ANALYZE.NAVIGATION_TABS.COUNTRY_OVERVIEW',
    hidden: false
  }
];

@customElement('analyze-page')
export class AnalyzePage extends PagePermissionsMixin(LitElement) implements IEtoolsPage {
  @property() activeTab: string = MONITORING_ACTIVITY;
  @property() pageTabs: PageTab[] = applyPageTabsTranslation(NAVIGATION_TABS);
  private activeLanguageUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    const canView: boolean = this.canView();
    return canView
      ? html`
          <page-content-header with-tabs-visible>
            <h1 slot="page-title">${translate('ANALYZE.TITLE')}</h1>

            <etools-tabs-lit
              id="tabs"
              slot="tabs"
              .tabs="${this.pageTabs}"
              @sl-tab-show="${({detail}: any) => this.onSelect(detail.name)}"
              .activeTab="${this.activeTab}"
            ></etools-tabs-lit>
          </page-content-header>

          ${this.getTabElement()}
        `
      : html``;
  }

  connectedCallback(): void {
    super.connectedCallback();
    store.subscribe(
      routeDetailsSelector(({routeName, subRouteName}: EtoolsRouteDetails) => {
        if (routeName !== PAGE) {
          return;
        }
        this.activeTab = subRouteName as string;
      })
    );

    this.activeLanguageUnsubscribe = store.subscribe(
      activeLanguageSelector(() => (this.pageTabs = applyPageTabsTranslation(NAVIGATION_TABS)))
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.activeLanguageUnsubscribe();
  }

  getTabElement(): TemplateResult {
    switch (this.activeTab) {
      case MONITORING_ACTIVITY:
        return html` <monitoring-tab></monitoring-tab> `;
      case COUNTRY_OVERVIEW:
        return html` <co-overview-tab></co-overview-tab> `;
      default:
        return html` Tab Not Found `;
    }
  }

  onSelect(tabName: string): void {
    if (this.activeTab === tabName) {
      return;
    }
    updateAppLocation(`${PAGE}/${tabName}`);
  }

  canView(): boolean {
    if (!this.permissionsReady) {
      return false;
    }
    if (!hasPermission(Permissions.VIEW_ANALYZE)) {
      updateAppLocation('page-not-found');
    }
    return true;
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, pageContentHeaderSlottedStyles, pageLayoutStyles, buttonsStyles];
  }
}
