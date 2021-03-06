import {CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {store} from '../../../redux/store';
import {routeDetailsSelector} from '../../../redux/selectors/app.selectors';
import {updateAppLocation} from '../../../routing/routes';
import {SharedStyles} from '../../styles/shared-styles';
import {pageContentHeaderSlottedStyles} from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import {buttonsStyles} from '../../styles/button-styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import '../../common/layout/page-content-header/page-content-header';
import '../../common/layout/etools-tabs';
import {questionTemplates} from '../../../redux/reducers/templates.reducer';
import {questions} from '../../../redux/reducers/questions.reducer';
import {issueTracker} from '../../../redux/reducers/issue-tracker.reducer';
import {specificLocations} from '../../../redux/reducers/site-specific-locations.reducer';
import {hasPermission, Permissions} from '../../../config/permissions';
import {PagePermissionsMixin} from '../../common/mixins/page-permissions-mixin';
import {applyPageTabsTranslation} from '../../utils/translation-helper';
import {Unsubscribe} from 'redux';
import {activeLanguageSelector} from '../../../redux/selectors/active-language.selectors';
import {translate} from 'lit-translate';

store.addReducers({questions, questionTemplates, issueTracker, specificLocations});

const PAGE = 'templates';

const ISSUE_TRACKER_TAB = 'issue-tracker';
const TEMPLATES_TAB = 'templates';
const QUESTIONS_TAB = 'questions';

const NAVIGATION_TABS: PageTab[] = [
  {
    tab: QUESTIONS_TAB,
    tabLabel: 'TEMPLATES_NAV.NAVIGATION_TABS.QUESTIONS',
    hidden: false
  },
  {
    tab: ISSUE_TRACKER_TAB,
    tabLabel: 'TEMPLATES_NAV.NAVIGATION_TABS.ISSUE_TRACKER',
    hidden: false
  },
  {
    tab: TEMPLATES_TAB,
    tabLabel: 'TEMPLATES_NAV.NAVIGATION_TABS.TEMPLATE',
    hidden: false
  }
];

@customElement('templates-page')
export class TemplatesPage extends PagePermissionsMixin(LitElement) implements IEtoolsPage {
  @property() pageTabs: PageTab[] = applyPageTabsTranslation(NAVIGATION_TABS);

  @property() activeTab: string = QUESTIONS_TAB;
  private activeLanguageUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    const canView: boolean = this.canView();
    return canView
      ? html`
          <page-content-header with-tabs-visible>
            <h1 slot="page-title">${translate('TEMPLATES_NAV.TITLE')}</h1>

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

  getTabElement(): TemplateResult {
    switch (this.activeTab) {
      case QUESTIONS_TAB:
        return html` <questions-tab></questions-tab> `;
      case ISSUE_TRACKER_TAB:
        return html` <issue-tracker-tab></issue-tracker-tab> `;
      case TEMPLATES_TAB:
        return html` <templates-tab></templates-tab> `;
      default:
        return html` Tab Not Found `;
    }
  }

  onSelect(selectedTab: HTMLElement): void {
    const tabName: string = selectedTab.getAttribute('name') || '';
    if (this.activeTab === tabName) {
      return;
    }
    updateAppLocation(`${PAGE}/${tabName}`);
  }

  canView(): boolean {
    if (!this.permissionsReady) {
      return false;
    }
    if (!hasPermission(Permissions.VIEW_SETTINGS)) {
      updateAppLocation('page-not-found');
    }
    return true;
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, pageContentHeaderSlottedStyles, pageLayoutStyles, buttonsStyles];
  }
}
