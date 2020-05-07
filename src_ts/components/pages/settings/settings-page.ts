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
import {questions} from '../../../redux/reducers/questions.reducer';
import {EtoolsRouter, updateAppLocation} from '../../../routing/routes';
import {hasPermission, Permissions} from '../../../config/permissions';
import {ACTIVITIES_PAGE} from '../activities-and-data-collection/activities-page';
import {PagePermissionsMixin} from '../../common/mixins/page-permissions-mixin';
import {translate} from 'lit-translate';
import {applyPageTabsTranslation} from '../../utils/translation-helper';
import {Unsubscribe} from 'redux';
import {activeLanguageSelector} from '../../../redux/selectors/active-language.selectors';

store.addReducers({specificLocations, questions});

const PAGE: string = 'settings';
const SITES_TAB: string = 'sites';
const QUESTIONS_TAB: string = 'questions';
const NAVIGATION_TABS: PageTab[] = [
  {
    tab: QUESTIONS_TAB,
    tabLabel: 'SETTINGS.NAVIGATION_TABS.QUESTIONS',
    hidden: false
  },
  {
    tab: SITES_TAB,
    tabLabel: 'SETTINGS.NAVIGATION_TABS.SITES',
    hidden: false
  }
];

@customElement('fm-settings')
export class FmSettingsComponent extends PagePermissionsMixin(LitElement) implements IEtoolsPage {
  @property() pageTabs: PageTab[] = applyPageTabsTranslation(NAVIGATION_TABS);

  @property() activeTab: string = QUESTIONS_TAB;
  private activeLanguageUnsubscribe!: Unsubscribe;

  render(): TemplateResult | void {
    const canView: boolean = this.canView();
    return canView
      ? html`
          <page-content-header with-tabs-visible>
            <h1 slot="page-title">${translate('SETTINGS.TITLE')}</h1>

            <div slot="title-row-actions" class="content-header-actions" ?hidden="${this.activeTab !== SITES_TAB}">
              <paper-button class="default left-icon" raised @tap="${() => this.exportData()}">
                <iron-icon icon="file-download"></iron-icon>${translate('SETTINGS.EXPORT')}
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
        return html`
          <sites-tab></sites-tab>
        `;
      case QUESTIONS_TAB:
        return html`
          <questions-tab></questions-tab>
        `;
      default:
        return html`
          Tab Not Found
        `;
    }
  }

  exportData(): void {
    const url: string = getEndpoint(SITES_EXPORT).url;
    const routeDetails: IRouteDetails | null = EtoolsRouter.getRouteDetails();
    const params: string = routeDetails && routeDetails.queryParamsString ? `?${routeDetails.queryParamsString}` : '';
    window.open(url + params, '_blank');
  }

  canView(): boolean {
    if (!this.permissionsReady) {
      return false;
    }
    if (!hasPermission(Permissions.VIEW_SETTINGS)) {
      updateAppLocation(ACTIVITIES_PAGE);
    }
    return true;
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, pageContentHeaderSlottedStyles, pageLayoutStyles, buttonsStyles];
  }
}
