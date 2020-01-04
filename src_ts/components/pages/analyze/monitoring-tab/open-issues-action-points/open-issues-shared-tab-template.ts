import {CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {StyleInfo, styleMap} from 'lit-html/directives/style-map';
import {openIssuesSharedTabTemplateStyles} from './open-issues-shared-tab-template.styles';
import {translate} from 'lit-translate';

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
            <label class="coverage-legend__label"
              >${translate('ANALYZE.MONITORING_TAB.COVERAGE.OPEN_ISSUES.ISSUES')}</label
            >
          </div>
          <div class="legend">
            <div class="legend__mark legend__mark-action-points"></div>
            <label class="coverage-legend__label"
              >${translate('ANALYZE.MONITORING_TAB.COVERAGE.OPEN_ISSUES.ACTION_POINTS')}</label
            >
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
                  style="${styleMap(this.getProgressBarDivWidth(item, 'log_issues_count'))}"
                >
                  <div class="progressbar-value">${item.log_issues_count}</div>
                </div>
                <!--  Action points  -->
                <div
                  class="progressbar-action-points"
                  style="${styleMap(this.getProgressBarDivWidth(item, 'action_points_count'))}"
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

  getProgressBarDivWidth(
    item: OpenIssuesActionPoints,
    property: 'log_issues_count' | 'action_points_count'
  ): StyleInfo {
    const total: number = item.log_issues_count + item.action_points_count;
    if (total === 0) {
      return {width: '50%'};
    } else {
      const width: number = (item[property] / total) * 100;
      return width ? {width: `${width}%`} : {display: 'none', width: '0%'};
    }
  }

  static get styles(): CSSResult {
    return openIssuesSharedTabTemplateStyles;
  }
}
