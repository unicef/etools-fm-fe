import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

/**
 * @customElement
 * @polymer
 */
class EngagementQuestionnaires extends PolymerElement {

    public static get template(): HTMLTemplateElement {
        // language=HTML
        return html`
            <style>
                /* CSS rules for your element */
            </style>

            Questionnaires tab content...
        `;
    }

}

window.customElements.define('engagement-questionnaires', EngagementQuestionnaires);
