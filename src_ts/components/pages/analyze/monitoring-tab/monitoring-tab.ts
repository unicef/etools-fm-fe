import {css, CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {template} from './monitoring-tab.tpl';
import {SharedStyles} from '../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../styles/flex-layout-classes';
import {CardStyles} from '../../../styles/card-styles';
import {elevationStyles} from '../../../styles/elevation-styles';
import {store} from '../../../../redux/store';
import {monitoringActivities} from '../../../../redux/reducers/monitoring-activity.reducer';
import {loadOverallStatistics} from '../../../../redux/effects/monitoring-activity.effects';
import {overallActivitiesSelector} from '../../../../redux/selectors/overall-activities.selectors';
import {Unsubscribe} from 'redux';
import {lastActivatedTabSelector} from '../../../../redux/selectors/last-activated-tab.selectors';

store.addReducers({monitoringActivities});

const PARTNER_TAB: string = 'partner';
const PD_SSFA_TAB: string = 'pd-ssfa';
const CP_OUTPUT_TAB: string = 'cp-output';
const COVERAGE_TABS: string[] = [PARTNER_TAB, PD_SSFA_TAB, CP_OUTPUT_TAB];

const OPEN_ISSUES_PARTNER_TAB: string = 'open-issues-partner';
const OPEN_ISSUES_CP_OUTPUT_TAB: string = 'open-issues-cp-output';
const OPEN_ISSUES_LOCATION_TAB: string = 'open-issues-location';

@customElement('monitoring-tab')
export class MonitoringTabComponent extends LitElement {
  coveragePageTabs: PageTab[] = [
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
  coverageOfActivePartnershipsContentMap: Map<string, TemplateResult> = new Map([
    [
      PARTNER_TAB,
      html`
        <partnership-tab></partnership-tab>
      `
    ],
    [
      PD_SSFA_TAB,
      html`
        <pd-ssfa-tab></pd-ssfa-tab>
      `
    ],
    [
      CP_OUTPUT_TAB,
      html`
        <cp-output-tab></cp-output-tab>
      `
    ]
  ]);
  openIssuesPageTabs: PageTab[] = [
    {
      tab: OPEN_ISSUES_PARTNER_TAB,
      tabLabel: 'By Partner',
      hidden: false
    },
    {
      tab: OPEN_ISSUES_CP_OUTPUT_TAB,
      tabLabel: 'By CP Output',
      hidden: false
    },
    {
      tab: OPEN_ISSUES_LOCATION_TAB,
      tabLabel: 'By Location',
      hidden: false
    }
  ];
  openIssuesContentMap: Map<string, TemplateResult> = new Map([
    [
      OPEN_ISSUES_PARTNER_TAB,
      html`
        <open-issues-partnership-tab></open-issues-partnership-tab>
      `
    ],
    [
      OPEN_ISSUES_CP_OUTPUT_TAB,
      html`
        <open-issues-cp-output-tab></open-issues-cp-output-tab>
      `
    ],
    [
      OPEN_ISSUES_LOCATION_TAB,
      html`
        <open-issues-location-tab></open-issues-location-tab>
      `
    ]
  ]);
  coverageActiveTab: string = PARTNER_TAB;
  openIssuesActiveTab: string = OPEN_ISSUES_PARTNER_TAB;
  @property() isHactVisitSectionActivated: boolean = this.coverageActiveTab == PARTNER_TAB;
  @property() completed: number = 0;
  @property() planned: number = 0;

  private readonly overallActivitiesUnsubscribe: Unsubscribe;
  private readonly lastActivatedTabUnsubscribe: Unsubscribe;

  constructor() {
    super();
    store.dispatch<AsyncEffect>(loadOverallStatistics());
    this.overallActivitiesUnsubscribe = store.subscribe(
      overallActivitiesSelector((overallActivities: OverallActivities) => {
        this.completed = overallActivities.visits_completed;
        this.planned = overallActivities.visits_planned;
      })
    );
    this.lastActivatedTabUnsubscribe = store.subscribe(
      lastActivatedTabSelector((lastActivatedTab: string) => {
        if (COVERAGE_TABS.includes(lastActivatedTab)) {
          this.coverageActiveTab = lastActivatedTab;
        } else {
          this.openIssuesActiveTab = lastActivatedTab;
        }
        this.isHactVisitSectionActivated = this.coverageActiveTab != PARTNER_TAB;
      })
    );
  }

  render(): TemplateResult {
    return template.call(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.overallActivitiesUnsubscribe();
    this.lastActivatedTabUnsubscribe();
  }

  getCompletedPercentage(completed: number, planned: number): number | null {
    return planned ? Math.round((completed / planned) * 100) : null;
  }

  static get styles(): CSSResult[] {
    const monitoringTabStyles: CSSResult = css`
      .monitoring-activity-container {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
      }

      .monitoring-activity__item {
        flex-grow: 1;
        flex-basis: 48%;
      }

      .monitoring-activity__overall-statistics {
        flex-basis: 100%;
      }

      .overall-completed-label {
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;
        align-self: flex-end;
        margin: 1%;
      }

      .monitoring-activity__partnership-coverage {
      }

      .monitoring-activity__geographic-coverage {
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
