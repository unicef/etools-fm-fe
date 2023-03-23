import {CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import '../../common/layout/page-content-header/page-content-header';
import '../../common/layout/etools-tabs';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {pageContentHeaderSlottedStyles} from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import {SharedStyles} from '../../styles/shared-styles';
import {buttonsStyles} from '../../styles/button-styles';
import {getEndpoint} from '../../../endpoints/endpoints';
import {SITES_EXPORT} from '../../../endpoints/endpoints-list';
import {store} from '../../../redux/store';
import {routeDetailsSelector} from '../../../redux/selectors/app.selectors';
import {specificLocations} from '../../../redux/reducers/site-specific-locations.reducer';
import {rationale} from '../../../redux/reducers/rationale.reducer';
import {EtoolsRouter, updateAppLocation} from '../../../routing/routes';
import {hasPermission, Permissions} from '../../../config/permissions';
import {ACTIVITIES_PAGE} from '../activities-and-data-collection/activities-page';
import {PagePermissionsMixin} from '../../common/mixins/page-permissions-mixin';
import {translate} from 'lit-translate';
import {applyPageTabsTranslation} from '../../utils/translation-helper';
import {Unsubscribe} from 'redux';
import {activeLanguageSelector} from '../../../redux/selectors/active-language.selectors';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';

store.addReducers({specificLocations, rationale});

const PAGE = 'management';
const SITES_TAB = 'sites';
const RATIONALE_TAB = 'rationale';
const NAVIGATION_TABS: PageTab[] = [
  {
    tab: RATIONALE_TAB,
    tabLabel: 'MANAGEMENT.NAVIGATION_TABS.RATIONALE',
    hidden: false
  },
  {
    tab: SITES_TAB,
    tabLabel: 'MANAGEMENT.NAVIGATION_TABS.SITES',
    hidden: false
  }
];

@customElement('management-page')
export class ManagementPage extends PagePermissionsMixin(MatomoMixin(LitElement)) implements IEtoolsPage {
  @property() pageTabs: PageTab[] = applyPageTabsTranslation(NAVIGATION_TABS);

  @property() activeTab: string = RATIONALE_TAB;
  private activeLanguageUnsubscribe!: Unsubscribe;

  static get styles(): CSSResultArray {
    return [SharedStyles, pageContentHeaderSlottedStyles, pageLayoutStyles, buttonsStyles];
  }

  render(): TemplateResult | void {
    const canView: boolean = this.canView();
    return canView
      ? html`
          <page-content-header with-tabs-visible>
            <h1 slot="page-title">${translate('MANAGEMENT.TITLE')}</h1>

            <div slot="title-row-actions" class="content-header-actions" ?hidden="${this.activeTab !== SITES_TAB}">
              <paper-button id="export" tracker="Export" @tap="${this.exportData}">
                <iron-icon icon="file-download"></iron-icon>${translate('MANAGEMENT.EXPORT')}
              </paper-button>
            </div>

            <etools-tabs
              id="tabs"
              slot="tabs"
              .tabs="${this.pageTabs}"
              @iron-select="${({detail}: any) => this.onSelect(detail.item)}"
              .activeTab="${this.activeTab}"
            ></etools-tabs>
          </page-content-header>

          ${this.getTabElement()}
        `
      : html``;
  }

  connectedCallback(): void {
    super.connectedCallback();
    store.subscribe(
      routeDetailsSelector(({routeName, subRouteName}: IRouteDetails) => {
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

  onSelect(selectedTab: HTMLElement): void {
    const tabName: string = selectedTab.getAttribute('name') || '';
    if (this.activeTab === tabName) {
      return;
    }
    updateAppLocation(`${PAGE}/${tabName}`);
  }

  getTabElement(): TemplateResult {
    switch (this.activeTab) {
      case SITES_TAB:
        return html` <sites-tab></sites-tab> `;
      case RATIONALE_TAB:
        return html` <rationale-tab></rationale-tab> `;
      default:
        return html` Tab Not Found `;
    }
  }

  exportData(e: CustomEvent): void {
    this.trackAnalytics(e);
    const url: string = getEndpoint(SITES_EXPORT).url;
    const routeDetails: IRouteDetails | null = EtoolsRouter.getRouteDetails();
    const params: string = routeDetails && routeDetails.queryParamsString ? `?${routeDetails.queryParamsString}` : '';
    window.open(url + params, '_blank');
  }

  canView(): boolean {
    if (!this.permissionsReady) {
      return false;
    }
    if (!hasPermission(Permissions.VIEW_PLANING)) {
      updateAppLocation(ACTIVITIES_PAGE);
    }
    return true;
  }
}
