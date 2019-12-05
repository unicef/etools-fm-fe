import {CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {StyleInfo, styleMap} from 'lit-html/directives/style-map';
import {openIssuesSharedTabTemplateStyles} from './open-issues-shared-tab-template.styles';

type OpenIssuesProgressBarWidth = {
  log_issues_width: StyleInfo;
  action_points_width: StyleInfo;
};

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
                <div class="progressbar-issues" style="${styleMap(this.getProgressBarDivWidth(item).log_issues_width)}">
                  <div class="progressbar-value">${item.log_issues_count}</div>
                </div>
                <!--  Action points  -->
                <div
                  class="progressbar-action-points"
                  style="${styleMap(this.getProgressBarDivWidth(item).action_points_width)}"
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

  getProgressBarDivWidth(item: OpenIssuesActionPoints): OpenIssuesProgressBarWidth {
    const total: number = item.log_issues_count + item.action_points_count;
    if (total === 0) {
      return {
        log_issues_width: {width: '50%'},
        action_points_width: {width: '50%'}
      };
    } else {
      const getDisplayByWidth: (width: number) => StyleInfo | null = (width: number) =>
        width ? null : {display: 'none'};
      const log_issues_width: number = (item.log_issues_count / total) * 100;
      const action_points_width: number = (item.action_points_count / total) * 100;
      return {
        log_issues_width: Object.assign({}, {width: `${log_issues_width}%`}, getDisplayByWidth(log_issues_width)),
        action_points_width: Object.assign(
          {},
          {width: `${action_points_width}%`},
          getDisplayByWidth(action_points_width)
        )
      };
    }
  }

  static get styles(): CSSResult {
    return openIssuesSharedTabTemplateStyles;
  }
}
