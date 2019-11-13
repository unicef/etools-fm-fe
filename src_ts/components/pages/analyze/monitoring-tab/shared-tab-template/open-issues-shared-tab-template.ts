import {css, CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {StyleInfo, styleMap} from 'lit-html/directives/style-map';

//TODO think about name
@customElement('open-issues-shared-tab-template')
export class OpenIssuesSharedTabTemplate extends LitElement {
  @property() data!: OpenIssuesActionPoints[];

  render(): TemplateResult {
    return html`
      <div class="open-issues">
        <!--  Legend  -->
        <div class="open-issues__legend">
          <div class="legend">
            <div class="legend__mark legend__mark-issues"></div>
            <label class="coverage-legend__label">Issues</label>
          </div>
          <div class="legend">
            <div class="legend__mark legend__mark-action-points"></div>
            <label class="coverage-legend__label">Action Points</label>
          </div>
        </div>
        ${this.data.map(
          (item: OpenIssuesActionPoints) => html`
            <div class="progressbar-host">
              <!--  Top Label  -->
              <div class="progressbar__header">
                <label class="progressbar-label">${item.name}</label>
              </div>
              <!--  Progress bar  -->
              <div class="progressbar__content">
                <!--  Open issues  -->
                <div
                  class="progressbar-issues"
                  style="${styleMap(this.getProgressBarDivWidth(item.log_issues_count, item.action_points_count))}"
                >
                  <div class="progressbar-value">${item.log_issues_count}</div>
                </div>
                <!--  Action points  -->
                <div
                  class="progressbar-action-points"
                  style="${styleMap(this.getProgressBarDivWidth(item.action_points_count, item.log_issues_count))}"
                >
                  <div class="progressbar-value">${item.action_points_count}</div>
                </div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  getProgressBarDivWidth(numerator: number, denominator: number): StyleInfo {
    const total: number = numerator + denominator;
    return {
      display: numerator ? 'inline' : 'none',
      width: total > 0 ? `${(numerator / total) * 100}%` : '0'
    };
  }

  static get styles(): CSSResult {
    return css`
      :host {
        --open-issues-color: #fee8c8;
        --action-points-color: #ff9044;
      }
      .open-issues {
        display: flex;
        flex-direction: column;
      }
      .open-issues__legend {
        display: flex;
        flex-direction: column;
        margin: 2%;
      }
      .legend {
        display: flex;
      }
      .legend__mark {
        min-width: 17px;
        min-height: 17px;
        max-width: 17px;
        max-height: 17px;
        margin-right: 2%;
        display: flex;
        justify-content: center;
      }
      .legend__mark-issues {
        background-color: var(--open-issues-color);
      }
      .legend__mark-action-points {
        background-color: var(--action-points-color);
      }

      .progressbar-host {
        display: flex;
        flex-direction: column;
        margin: 2%;
      }

      .progressbar__header {
        display: flex;
        justify-content: space-between;
      }

      .progressbar__content {
        height: 30px;
        display: flex;
        align-items: center;
      }

      .progressbar-label {
        color: grey;
      }

      .progressbar-issues {
        background-color: var(--open-issues-color);
      }

      .progressbar-action-points {
        background-color: var(--action-points-color);
      }

      .progressbar-value {
        margin-left: 1%;
      }
    `;
  }
}
