import { css, CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { template } from './monitoring-tab.tpl';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { CardStyles } from '../../../styles/card-styles';
import { elevationStyles } from '../../../styles/elevation-styles';
import { store } from '../../../../redux/store';
import { monitoringActivities } from '../../../../redux/reducers/monitoring-activity.reducer';
import { loadOverallStatistics } from '../../../../redux/effects/monitoring-activity.effects';
import { overallActivitiesSelector } from '../../../../redux/selectors/overall-activities.selectors';
import { Unsubscribe } from 'redux';
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
  @property() public completed: number = 0;
  @property() public planned: number = 0;

  private readonly overallActivitiesUnsubscribe: Unsubscribe;
  private readonly routeDetailsUnsubscribe!: Unsubscribe;
  public constructor() {
      super();
      store.dispatch<AsyncEffect>(loadOverallStatistics());
      this.overallActivitiesUnsubscribe = store.subscribe(overallActivitiesSelector((overallActivities: OverallActivities) => {
          this.completed = overallActivities.visits_completed;
          this.planned = overallActivities.visits_planned;
      }));
      this.routeDetailsUnsubscribe = store.subscribe(routeDetailsSelector(({ params }: IRouteDetails) => {
          if (params) {
              this.activeTab = params.tab as string;
          }
      }));
  }

  public render(): TemplateResult {
      return template.call(this);
  }

  public disconnectedCallback(): void {
      super.disconnectedCallback();
      this.overallActivitiesUnsubscribe();
      this.routeDetailsUnsubscribe();
  }

  public getCompletedPercentage(completed: number, planned: number): number | null {
      return planned ? Math.round(completed / planned * 100) : null;
  }

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

  public static get styles(): CSSResult[] {
      const monitoringTabStyles: CSSResult = css`
            .monitoring-activity-container {
              display: flex;
              flex-wrap: wrap;
            }

            .monitoring-activity__item {
              flex-grow: 1;
            }

            .monitoring-activity__overall-statistics {
              flex-basis: 100%;
            }

            .monitoring-activity__partnership-coverage {
            }

            .monitoring-activity__geographic-coverage {
            }

            .monitoring-activity__hact-visits {
            }
            .visits-card {
              display: flex;
              justify-content: space-around;
              min-height: 62px;
            }

            .visits-card__item {
              flex-basis: 50%;
              margin: 1%;
            }

            .completed-percentage-container {
              display: flex;
              align-items: center;
            }

            .tabs-container {
              border-bottom: 1px solid lightgrey;
            }
      `;
      return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, monitoringTabStyles];
  }
}
