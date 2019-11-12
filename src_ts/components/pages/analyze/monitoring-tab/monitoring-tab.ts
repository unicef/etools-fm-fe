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

store.addReducers({monitoringActivities});

const PARTNER_TAB: string = 'partner';
const PD_SSFA_TAB: string = 'pd-ssfa';
const CP_OUTPUT_TAB: string = 'cp-output';

@customElement('monitoring-tab')
export class MonitoringTabComponent extends LitElement {
  pageTabs: PageTab[] = [
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
  @property() activeTab: string = PARTNER_TAB;
  @property() completed: number = 0;
  @property() planned: number = 0;
  @property() tabElement: TemplateResult = this.getTabElement();

  private readonly overallActivitiesUnsubscribe: Unsubscribe;

  constructor() {
    super();
    store.dispatch<AsyncEffect>(loadOverallStatistics());
    this.overallActivitiesUnsubscribe = store.subscribe(
      overallActivitiesSelector((overallActivities: OverallActivities) => {
        this.completed = overallActivities.visits_completed;
        this.planned = overallActivities.visits_planned;
      })
    );
  }

  render(): TemplateResult {
    return template.call(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.overallActivitiesUnsubscribe();
  }

  getCompletedPercentage(completed: number, planned: number): number | null {
    return planned ? Math.round((completed / planned) * 100) : null;
  }

  onSelect(selectedTab: HTMLElement): void {
    const tabName: string = selectedTab.getAttribute('name') || '';
    if (this.activeTab === tabName) {
      return;
    }
    this.activeTab = tabName;
    this.tabElement = this.getTabElement();
  }

  getTabElement(): TemplateResult {
    switch (this.activeTab) {
      case PARTNER_TAB:
        return html`
          <partnership-tab></partnership-tab>
        `;
      case PD_SSFA_TAB:
        return html`
          <pd-ssfa-tab></pd-ssfa-tab>
        `;
      case CP_OUTPUT_TAB:
        return html`
          <cp-output-tab></cp-output-tab>
        `;
      default:
        return html``;
    }
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
