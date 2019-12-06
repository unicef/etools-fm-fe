import {css, CSSResultArray, customElement, html, property, TemplateResult} from 'lit-element';
import {DataCollectionCard} from '../../data-collection/data-collection-card/data-collection-card';
import '@polymer/paper-toggle-button';
import {fireEvent} from '../../../../utils/fire-custom-event';
import './completed-finding/completed-finding';

@customElement('summary-card')
export class SummaryCard extends DataCollectionCard {
  @property({type: Object}) overallInfo: SummaryOverall | null = null;

  private get filteredOverallFindings(): CompletedOverallFinding[] {
    return (
      (this.overallInfo &&
        this.overallInfo.findings.filter((finding: CompletedOverallFinding) => Boolean(finding.narrative_finding))) ||
      []
    );
  }

  protected getFindingQuestion(finding: SummaryFinding): TemplateResult {
    return html`
      <div class="layout vertical question-container">
        <div class="question-text">${finding.activity_question.question.text}</div>
        <div class="question-details">${finding.activity_question.specific_details}</div>
        <div class="flex-2 layout horizontal wrap">
          ${finding.activity_question.findings.map(
            (completedFinding: CompletedFinding) => html`
              <completed-finding
                .completedFinding="${completedFinding}"
                .completedFindingTitle="${this.getFindingAnswer(
                  completedFinding.value,
                  finding.activity_question.question
                )}"
              ></completed-finding>
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
            <div class="flex-2 layout horizontal wrap" ?hidden="${!this.filteredOverallFindings.length}">
              ${this.filteredOverallFindings.map(
                (finding: CompletedOverallFinding) => html`
                  <completed-finding
                    .completedFinding="${finding}"
                    .completedFindingTitle="${finding.narrative_finding}"
                  ></completed-finding>
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
          ?readonly="${this.readonly}"
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

  private getFindingAnswer(value: string, question: IChecklistQuestion): string {
    if (!question.options.length) {
      return value;
    } else {
      const option: QuestionOption | undefined = question.options.find(
        (option: QuestionOption) => option.value === value
      );
      return (option && option.label) || '';
    }
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      ...DataCollectionCard.styles,
      css`
        paper-toggle-button {
          margin: 0 4px 0 15px;
          --paper-toggle-button-unchecked-button-color: var(--error-color);
          --paper-toggle-button-unchecked-bar-color: var(--error-color);
        }
        paper-toggle-button[readonly] {
          pointer-events: none;
        }
        .ontrack-container {
          margin-right: 40px;
        }
      `
    ];
  }
}
