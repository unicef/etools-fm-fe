import {css, LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
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
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {SaveRoute} from '../../../../../redux/actions/app.actions';
import {SUMMARY_TAB} from '../activities-tabs';
import {repeat} from 'lit/directives/repeat.js';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

store.addReducers({activitySummary, findingsComponents});

@customElement('activity-summary-tab')
export class ActivitySummaryTab extends LitElement {
  @property() activityId: number | null = null;
  @property({type: Boolean, attribute: 'readonly'}) readonly = false;
  @property() activityDetails!: IActivityDetails;

  @property() protected findingsAndOverall: GenericObject<SortedFindingsAndOverall> = {};
  @property() private rawFindingsAndOverall: FindingsAndOverall = {overall: null, findings: null};

  private findingsAndOverallUnsubscribe!: Unsubscribe;
  private activeLanguageUnsubscribe!: Unsubscribe;
  private routeDetailsUnsubscribe!: Unsubscribe;
  private isLoad = true;

  render(): TemplateResult {
    return html`
      <etools-loading
        ?active="${this.isLoad}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      ${repeat(
        Object.values(this.findingsAndOverall).filter(({findings}: SortedFindingsAndOverall) =>
          Boolean(findings.length)
        ),
        (_item: any) => Date.now(),
        ({name, findings, overall, target, type}: SortedFindingsAndOverall) => {
          return html`
            <div class="findings-block">
              <summary-card
                .activityId="${this.activityId}"
                .activityDetails="${this.activityDetails}"
                .tabName="${name}"
                .target="${target}"
                .type="${type}"
                .overallInfo="${overall}"
                .findings="${findings}"
                ?readonly="${this.readonly}"
                @update-data="${({detail}: CustomEvent) => this.updateOverallAndFindings(detail)}"
              ></summary-card>
            </div>
          `;
        }
      )}
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    store.dispatch(new SaveRoute(`activities/${this.activityId}/${SUMMARY_TAB}`));
    this.routeDetailsUnsubscribe = store.subscribe(
      routeDetailsSelector(({params}: EtoolsRouteDetails) => {
        this.activityId = params && (params.id as number);
        if (this.activityId) {
          store.dispatch<AsyncEffect>(loadSummaryFindingsAndOverall(this.activityId));
        }
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
