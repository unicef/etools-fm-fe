import { CSSResult, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { template } from './monitoring-tab.tpl';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { CardStyles } from '../../../styles/card-styles';
import { elevationStyles } from '../../../styles/elevation-styles';
import { store } from '../../../../redux/store';
import { analyzeActivities } from '../../../../redux/reducers/analyze.reducer';
import { loadOverallStatistics } from '../../../../redux/effects/analyze.effects';
import { analyzeSelector } from '../../../../redux/selectors/analyze.selectors';
import { Unsubscribe } from 'redux';
import { overallStatisticsProgressbarDataConverter } from '../../../utils/progressbar-utils';

store.addReducers({ analyzeActivities });

@customElement('monitoring-tab')
export class MonitoringTabComponent extends LitElement {
  @property() public progressbarData: ProgressBarData | null = null;
  @property() public completed: number = 0;
  @property() public planned: number = 0;

  // private readonly debouncedLoading: Callback;
  private readonly overallActivitiesUnsubscribe: Unsubscribe;
  public constructor() {
      super();
      // cadetblue
      // this.debouncedLoading = debounce(store.dispatch<AsyncEffect>(loadOverallStatistics()), 100);
      store.dispatch<AsyncEffect>(loadOverallStatistics());
      this.overallActivitiesUnsubscribe = store.subscribe(analyzeSelector((analyzeState: IAnalyzeState) => {
          this.progressbarData = overallStatisticsProgressbarDataConverter(analyzeState.overallActivities);
          this.completed = this.progressbarData.completed;
          this.planned = this.progressbarData.planned;
      }));
  }

  public disconnectedCallback(): void {
      super.disconnectedCallback();
      this.overallActivitiesUnsubscribe();
  }

  public render(): TemplateResult {
      return template.call(this);
  }

  public static get styles(): CSSResult[] {
      return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles];
  }

  public getCompletedPercentage(completed: number, planned: number): number | null {
      return planned ? (completed / planned * 100) : null;
  }
}
