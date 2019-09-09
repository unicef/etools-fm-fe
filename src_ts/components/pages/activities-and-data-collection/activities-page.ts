import { customElement, html, LitElement, TemplateResult } from 'lit-element';

@customElement('activities-page')
export class ActivitiesPageComponent extends LitElement {
    public render(): TemplateResult {
        return html`Activities list`;
    }
}
