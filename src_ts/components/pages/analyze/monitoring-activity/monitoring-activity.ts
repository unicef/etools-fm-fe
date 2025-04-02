import {CSSResult, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {template} from './monitoring-activity.tpl.js';
import {SharedStyles} from '../../../styles/shared-styles.js';
import {pageLayoutStyles} from '../../../styles/page-layout-styles.js';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../styles/card-styles.js';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {store} from '../../../../redux/store.js';
import {monitoringActivities} from '../../../../redux/reducers/monitoring-activity.reducer.js';
import {loadOverallStatistics} from '../../../../redux/effects/monitoring-activity.effects.js';
import {Unsubscribe} from 'redux';
import {
  lastActivatedTabSelector,
  overallActivitiesSelector
} from '../../../../redux/selectors/monitoring-activities.selectors.js';
import {monitoringActivityStyles} from './monitoring-activity.styles.js';
import {
  COVERAGE_TABS,
  OPEN_ISSUES_PARTNER_TAB,
  PARTNER_TAB,
  PD_SPD_TAB,
  CP_OUTPUT_TAB,
  OPEN_ISSUES_CP_OUTPUT_TAB,
  OPEN_ISSUES_LOCATION_TAB
} from './monitoring-activity.navigation.constants.js';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';

import './coverage/partnership-tab/partnership-tab.js';
import './coverage/pd-spd-tab/pd-spd-tab.js';
import './coverage/cp-output-tab/cp-output-tab.js';
import './open-issues-action-points/open-issues-partnership-tab/open-issues-partnership-tab.js';
import './open-issues-action-points/open-issues-cp-output-tab/open-issues-cp-output-tab.js';
import './open-issues-action-points/open-issues-location-tab/open-issues-location-tab.js';

store.addReducers({monitoringActivities});

@customElement('monitoring-activity-tab')
export class MonitoringTabComponent extends LitElement {
  @property() isHactVisitSectionActivated = true;
  @property() completed = 0;
  @property() planned = 0;
  @property() invalidMapSize = false;
  coverageActiveTab: string = PARTNER_TAB;
  openIssuesActiveTab: string = OPEN_ISSUES_PARTNER_TAB;
  coverageTabs: PageTab[] = [];
  openIssuesTabs: PageTab[] = [];

  private overallActivitiesUnsubscribe!: Unsubscribe;
  private lastActivatedTabUnsubscribe!: Unsubscribe;

  connectedCallback(): void {
    super.connectedCallback();
    store.dispatch<AsyncEffect>(loadOverallStatistics());

    // conditional tabs routing: Hact visits section appearance depends on whether
    // Coverage 'By partner' tab is active. If it's not, then Open Issues section appear
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
    this.overallActivitiesUnsubscribe = store.subscribe(
      overallActivitiesSelector((overallActivities: OverallActivities) => {
        this.completed = overallActivities.visits_completed;
        this.planned = overallActivities.visits_planned;
      })
    );
    this.addEventListener('resize-map', this.resizeMap as any);

    this.coverageTabs = [
      {
        tab: PARTNER_TAB,
        tabLabel: translate('ANALYZE.MONITORING_TAB.NAVIGATION_TABS.BY_PARTNER') as any as string,
        hidden: false
      },
      {
        tab: PD_SPD_TAB,
        tabLabel: translate('ANALYZE.MONITORING_TAB.NAVIGATION_TABS.BY_PD_SPD') as any as string,
        hidden: false
      },
      {
        tab: CP_OUTPUT_TAB,
        tabLabel: translate('ANALYZE.MONITORING_TAB.NAVIGATION_TABS.BY_CP_OUTPUT') as any as string,
        hidden: false
      }
    ];

    this.openIssuesTabs = [
      {
        tab: OPEN_ISSUES_PARTNER_TAB,
        tabLabel: translate('ANALYZE.MONITORING_TAB.NAVIGATION_TABS.BY_PARTNER') as any as string,
        hidden: false
      },
      {
        tab: OPEN_ISSUES_CP_OUTPUT_TAB,
        tabLabel: translate('ANALYZE.MONITORING_TAB.NAVIGATION_TABS.BY_CP_OUTPUT') as any as string,
        hidden: false
      },
      {
        tab: OPEN_ISSUES_LOCATION_TAB,
        tabLabel: translate('ANALYZE.MONITORING_TAB.NAVIGATION_TABS.BY_LOCATION') as any as string,
        hidden: false
      }
    ];
  }

  render(): TemplateResult {
    return template.call(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.overallActivitiesUnsubscribe();
    this.lastActivatedTabUnsubscribe();
    this.removeEventListener('resize-map', this.resizeMap as any);
  }

  resizeMap(): void {
    this.invalidMapSize = !this.invalidMapSize;
  }

  getCompletedPercentage(completed: number, planned: number): number | null {
    return planned ? Math.round((completed / planned) * 100) : 0;
  }

  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles, layoutStyles, CardStyles, monitoringActivityStyles];
  }
}
