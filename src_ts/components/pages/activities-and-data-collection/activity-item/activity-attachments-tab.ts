import { CSSResult, customElement, html, LitElement, TemplateResult } from 'lit-element';
import { elevationStyles } from '../../../styles/lit-styles/elevation-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { SharedStyles } from '../../../styles/shared-styles';

@customElement('activity-attachments-tab')
export class ActivityAttachmentsTab extends LitElement {
    // language=HTML
    public render(): TemplateResult {
        return html`
        ${SharedStyles} ${pageLayoutStyles}
        <section class="elevation page-content" elevation="1">
            Attachments
        </section>
        `;
    }

    public static get styles(): CSSResult[] {
        return [elevationStyles];
    }
}
