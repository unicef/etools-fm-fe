import {css, CSSResultArray, customElement, html, property, TemplateResult} from 'lit-element';
import {DataCollectionCard} from '../../data-collection/data-collection-card/data-collection-card';
import '@polymer/paper-toggle-button';
import {fireEvent} from '../../../../utils/fire-custom-event';

@customElement('summary-card')
export class SummaryCard extends DataCollectionCard {
  @property({type: Object}) overallInfo: SummaryOverall | null = null;

  protected getFindingQuestion(finding: SummaryFinding): TemplateResult {
    return html`
      <div class="layout vertical question-container">
        <div class="question-text">${finding.activity_question.question.text}</div>
        <div class="question-details">${finding.activity_question.specific_details}</div>
        <div class="flex-2 layout horizontal wrap">
          ${finding.activity_question.findings.map(
            () => html`
              <div class="completed-finding"><div></div></div>
            `
          )}
        </div>
      </div>
    `;
  }

  protected getOverallFindingTemplate(): TemplateResult {
    return this.overallInfo
      ? html`
          <div class="overall-finding layout horizontal">
            <div class="flex-2 layout horizontal wrap" ?hidden="${!this.overallInfo.findings.length}">
              ${this.overallInfo.findings.map(
                () => html`
                  <div class="completed-finding"><div></div></div>
                `
              )}
            </div>
            <div class="flex-3">
              <paper-textarea
                id="details-input"
                class="without-border"
                .value="${(this.overallInfo && this.overallInfo.narrative_finding) || ''}"
                label="Overall finding"
                ?disabled="${!this.isEditMode}"
                placeholder="${this.isEditMode ? 'Enter Overall finding' : '-'}"
                @value-changed="${({detail}: CustomEvent) =>
                  this.updateOverallFinding({narrative_finding: detail.value})}"
              ></paper-textarea>
            </div>
          </div>
        `
      : html``;
  }

  protected getAdditionalButtons(): TemplateResult {
    return html`
      <div class="ontrack-container layout horizontal">
        Off Track
        <paper-toggle-button
          ?checked="${this.overallInfo?.on_track || false}"
          @checked-changed="${({detail}: CustomEvent) => this.toggleChange(detail.value)}"
        ></paper-toggle-button>
        On Track
      </div>
      ${super.getAdditionalButtons()}
    `;
  }

  private toggleChange(onTrackState: boolean): void {
    if (!this.overallInfo) {
      return;
    }
    if (Boolean(this.overallInfo.on_track) !== onTrackState) {
      const overall: Partial<SummaryOverall> = {
        id: this.overallInfo.id,
        on_track: onTrackState
      };
      fireEvent(this, 'update-data', {overall});
    }
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      ...DataCollectionCard.styles,
      css`
        .completed-finding {
          width: 50%;
        }
        .completed-finding div {
          position: relative;
          width: 120px;
          height: 48px;
          margin: 12px 0;
          background-color: var(--gray-light-background);
          line-height: 48px;
        }
        paper-toggle-button {
          margin: 0 4px 0 15px;
          --paper-toggle-button-unchecked-button-color: var(--error-color);
          --paper-toggle-button-unchecked-bar-color: var(--error-color);
        }
        .ontrack-container {
          margin-right: 40px;
        }
      `
    ];
  }
}
