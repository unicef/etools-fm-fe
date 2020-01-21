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

store.addReducers({activitySummary, findingsComponents});

@customElement('activity-summary-tab')
export class ActivitySummaryTab extends LitElement {
  @property() activityId: number | null = null;
  @property({type: Boolean, attribute: 'readonly'}) readonly: boolean = false;

  @property() protected findingsAndOverall: GenericObject<SortedFindingsAndOverall> = {};
  @property() private rawFindingsAndOverall: FindingsAndOverall = {overall: null, findings: null};

  private findingsAndOverallUnsubscribe!: Unsubscribe;
  private activeLanguageUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    return html`
      ${Object.values(this.findingsAndOverall)
        .filter(({findings}: SortedFindingsAndOverall) => Boolean(findings.length))
        .map(({name, findings, overall}: SortedFindingsAndOverall) => {
          return html`
            <div class="findings-block">
              <summary-card
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
    store.dispatch<AsyncEffect>(loadSummaryFindingsAndOverall(this.activityId as number));

    /**
     * Sorts and sets findings and overall data on store.dataCollection.checklist.findingsAndOverall changes
     */
    this.findingsAndOverallUnsubscribe = store.subscribe(
      summaryFindingsAndOverallData(({overall, findings}: FindingsAndOverall) => {
        this.rawFindingsAndOverall = {overall, findings};
        this.findingsAndOverall = sortFindingsAndOverall(overall, findings);
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
