import { CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { template } from './monitoring-tab.tpl';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { CardStyles } from '../../../styles/card-styles';
import { elevationStyles } from '../../../styles/elevation-styles';
import { store } from '../../../../redux/store';
import { monitoringActivities } from '../../../../redux/reducers/monitoring-activity.reducer';
import { loadOverallStatistics } from '../../../../redux/effects/monitoring-activity.effects';
import { monitoringActivitySelector } from '../../../../redux/selectors/monitoring-activity.selectors';
import { Unsubscribe } from 'redux';
import { convertOverallStatisticsProgressbarData } from '../../../utils/progressbar-utils';
import { updateAppLocation } from '../../../../routing/routes';
import { routeDetailsSelector } from '../../../../redux/selectors/app.selectors';

store.addReducers({ monitoringActivities });

const PAGE: string = 'analyze/monitoring-activity';
const PARTNER_TAB: string = 'partner';
const PD_SSFA_TAB: string = 'pd-ssfa';
const CP_OUTPUT_TAB: string = 'cp-output';

@customElement('monitoring-tab')
export class MonitoringTabComponent extends LitElement {
  public pageTabs: PageTab[] = [
      {
          tab: PARTNER_TAB,
          tabLabel: 'By Partner',
          hidden: false
      },
      {
          tab: PD_SSFA_TAB,
          tabLabel: 'By PD/SSFA',
          hidden: false
      },
      {
          tab: CP_OUTPUT_TAB,
          tabLabel: 'By CP Output',
          hidden: false
      }
  ];
  @property() public activeTab: string = PARTNER_TAB;
  @property() public progressbarData: ProgressBarData | null = null;
  @property() public completed: number = 0;
  @property() public planned: number = 0;

  // private readonly debouncedLoading: Callback;
  private readonly overallActivitiesUnsubscribe: Unsubscribe;
  private routeDetailsUnsubscribe!: Unsubscribe;
  public constructor() {
      super();
      // this.debouncedLoading = debounce(store.dispatch<AsyncEffect>(loadOverallStatistics()), 100);
      store.dispatch<AsyncEffect>(loadOverallStatistics());
      this.overallActivitiesUnsubscribe = store.subscribe(monitoringActivitySelector((monitoringActivitiesState: IMonitoringActivityState) => {
          this.progressbarData = convertOverallStatisticsProgressbarData(monitoringActivitiesState.overallActivities);
          // TODO remove
          this.progressbarData.planned = 123;
          this.progressbarData.completed = 83;
          this.completed = this.progressbarData.completed;
          this.planned = this.progressbarData.planned;
      }));
  }
    public connectedCallback(): void {
        super.connectedCallback();
        this.routeDetailsUnsubscribe = store.subscribe(routeDetailsSelector(({ params }: IRouteDetails) => {
            if (params) {
                this.activeTab = params.tab as string;
            }
        }));
    }

  public disconnectedCallback(): void {
      super.disconnectedCallback();
      this.overallActivitiesUnsubscribe();
      this.routeDetailsUnsubscribe();
  }

  public render(): TemplateResult {
      return template.call(this);
  }

  public static get styles(): CSSResult[] {
      return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles];
  }

  public getCompletedPercentage(completed: number, planned: number): number | null {
      return planned ? Math.round(completed / planned * 100) : null;
  }
// TODO
  public onSelect(selectedTab: HTMLElement): void {
      const tabName: string = selectedTab.getAttribute('name') || '';
      if (this.activeTab === tabName) { return; }
      updateAppLocation(`${PAGE}/${tabName}`);
  }

  public getTabElement(): TemplateResult {
      switch (this.activeTab) {
          case PARTNER_TAB:
              return html`<partnership-tab></partnership-tab>`;
          case PD_SSFA_TAB:
              return html`<pd-ssfa-tab></pd-ssfa-tab>`;
          case CP_OUTPUT_TAB:
              return html`<cp-output-tab></cp-output-tab>`;
          default:
              return html`d partner tab`;
      }
  }
}
