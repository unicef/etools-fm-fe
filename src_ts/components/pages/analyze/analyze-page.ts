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
import {hasPermission, Permissions} from '../../../config/permissions';
import {PagePermissionsMixin} from '../../common/mixins/page-permissions-mixin';

const PAGE: string = 'analyze';

const MONITORING_ACTIVITY: string = 'monitoring-activity';
const COUNTRY_OVERVIEW: string = 'country-overview';

@customElement('analyze-page')
export class AnalyzePage extends PagePermissionsMixin(LitElement) implements IEtoolsPage {
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
    const canView: boolean = this.canView();
    return canView
      ? html`
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
        `
      : html``;
  }

  getTabElement(): TemplateResult {
    switch (this.activeTab) {
      case MONITORING_ACTIVITY:
        return html`
          <monitoring-tab></monitoring-tab>
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
