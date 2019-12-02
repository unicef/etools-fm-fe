import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';

@customElement('activity-summary-tab')
export class ActivitySummaryTab extends LitElement {
  @property() activityId: number | null = null;
  render(): TemplateResult {
    return html`
      Hello from summary ${this.activityId}
    `;
  }
}
