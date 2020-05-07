import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {store} from '../../../../../redux/store';
import {activitySummary} from '../../../../../redux/reducers/activity-summary.reducer';
import {
  loadSummaryFindingsAndOverall,
  updateSummaryFindingsAndOverall
} from '../../../../../redux/effects/activity-summary-effects';
import {sortFindingsAndOverall} from '../../../../utils/findings-and-overall-sort';
import {Unsubscribe} from 'redux';
import {summaryFindingsAndOverallData} from '../../../../../redux/selectors/activity-summary.selectors';
import {findingsComponents} from '../../../../../redux/reducers/findings-components.reducer';
import './summary-card';
import {activeLanguageSelector} from '../../../../../redux/selectors/active-language.selectors';
import {routeDetailsSelector} from '../../../../../redux/selectors/app.selectors';
import {translate} from 'lit-translate';
import {SaveRoute} from '../../../../../redux/actions/app.actions';
import {ACTIVITIES_PAGE} from '../../activities-page';
import {SUMMARY_TAB} from '../activities-tabs';

store.addReducers({activitySummary, findingsComponents});

@customElement('activity-summary-tab')
export class ActivitySummaryTab extends LitElement {
  @property() activityId: number | null = null;
  @property({type: Boolean, attribute: 'readonly'}) readonly: boolean = false;

  @property() protected findingsAndOverall: GenericObject<SortedFindingsAndOverall> = {};
  @property() private rawFindingsAndOverall: FindingsAndOverall = {overall: null, findings: null};

  private findingsAndOverallUnsubscribe!: Unsubscribe;
  private activeLanguageUnsubscribe!: Unsubscribe;
  private routeDetailsUnsubscribe!: Unsubscribe;
  private isLoad: boolean = true;

  render(): TemplateResult {
    return html`
      <etools-loading
        ?active="${this.isLoad}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      ${Object.values(this.findingsAndOverall)
        .filter(({findings}: SortedFindingsAndOverall) => Boolean(findings.length))
        .map(({name, findings, overall}: SortedFindingsAndOverall) => {
          return html`
            <div class="findings-block">
              <summary-card
                .activityId="${this.activityId}"
                .tabName="${name}"
                .overallInfo="${overall}"
                .findings="${findings}"
                ?readonly="${this.readonly}"
                @update-data="${({detail}: CustomEvent) => this.updateOverallAndFindings(detail)}"
              ></summary-card>
            </div>
          `;
        })}
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    store.dispatch(new SaveRoute(`${ACTIVITIES_PAGE}/${this.activityId}/${SUMMARY_TAB}`));
    store.dispatch<AsyncEffect>(loadSummaryFindingsAndOverall(this.activityId as number));
    this.routeDetailsUnsubscribe = store.subscribe(
      routeDetailsSelector(({params}: IRouteDetails) => {
        this.activityId = params && (params.id as number);
        store.dispatch<AsyncEffect>(loadSummaryFindingsAndOverall(this.activityId as number));
      })
    );

    /**
     * Sorts and sets findings and overall data on store.dataCollection.checklist.findingsAndOverall changes
     */
    this.findingsAndOverallUnsubscribe = store.subscribe(
      summaryFindingsAndOverallData(({overall, findings}: FindingsAndOverall) => {
        this.rawFindingsAndOverall = {overall, findings};
        this.findingsAndOverall = sortFindingsAndOverall(overall, findings);
        this.isLoad = false;
      }, false)
    );

    this.activeLanguageUnsubscribe = store.subscribe(
      activeLanguageSelector(() => {
        this.findingsAndOverall = sortFindingsAndOverall(
          this.rawFindingsAndOverall.overall,
          this.rawFindingsAndOverall.findings
        );
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.findingsAndOverallUnsubscribe();
    this.activeLanguageUnsubscribe();
    this.routeDetailsUnsubscribe();
  }

  /**
   * Updates Findings on @update-data event from summary-card (data-collection-card initially) component
   */
  protected updateOverallAndFindings(requestData: DataCollectionRequestData<SummaryFinding, SummaryOverall>): void {
    if (!this.activityId) {
      return;
    }

    store.dispatch<AsyncEffect>(updateSummaryFindingsAndOverall(this.activityId, requestData));
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      css`
        :host {
          display: block;
        }
        .findings-block {
          margin: 24px;
        }
        .findings-block:last-child {
          margin-bottom: 0;
        }
      `
    ];
  }
}
