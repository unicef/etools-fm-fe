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
// import { addTranslates, ENGLISH } from '../../../localization/localisation';
// import { TEMPLATES_TRANSLATES } from '../../../localization/en/plan-page/templates-tab.translates';
// import { questionTemplates } from '../../../redux/reducers/templates.reducer';
// import { ISSUE_TRACKER_TRANSLATES } from '../../../localization/en/plan-page/issue-tracker.translates';

// store.addReducers({ questionTemplates });
// addTranslates(ENGLISH, [TEMPLATES_TRANSLATES]);

const PAGE: string = 'analyze';

const MONITORING_ACTIVITY: string = 'monitoring-activity';
const COUNTRY_OVERVIEW: string = 'country-overview';

@customElement('analyze-page')
export class AnalyzePage extends LitElement {
  pageTabs: PageTab[] = [
    {
      tab: MONITORING_ACTIVITY,
      tabLabel: 'Monitoring Activity',
      hidden: false
    },
    {
      tab: COUNTRY_OVERVIEW,
      tabLabel: 'Country Overview',
      hidden: false
    }
  ];

  @property() activeTab: string = MONITORING_ACTIVITY;

  static get styles(): CSSResultArray {
    return [SharedStyles, pageContentHeaderSlottedStyles, pageLayoutStyles, buttonsStyles];
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
  }

  render(): TemplateResult {
    return html`
      <page-content-header with-tabs-visible>
        <h1 slot="page-title">Analyze</h1>

        <etools-tabs
          id="tabs"
          slot="tabs"
          .tabs="${this.pageTabs}"
          @iron-select="${({detail}: any) => this.onSelect(detail.item)}"
          .activeTab="${this.activeTab}"
        ></etools-tabs>
      </page-content-header>

      ${this.getTabElement()}
    `;
  }

  getTabElement(): TemplateResult {
    switch (this.activeTab) {
      case MONITORING_ACTIVITY:
        return html`
          Monitoring Activity
        `;
      case COUNTRY_OVERVIEW:
        return html`
          <co-overview-tab></co-overview-tab>
        `;
      default:
        return html`
          Tab Not Found
        `;
    }
  }

  onSelect(selectedTab: HTMLElement): void {
    const tabName: string = selectedTab.getAttribute('name') || '';
    if (this.activeTab === tabName) {
      return;
    }
    updateAppLocation(`${PAGE}/${tabName}`);
  }
}
