import { html, TemplateResult } from 'lit-element';
import '@polymer/iron-flex-layout/iron-flex-layout.js';

/**
 * Used to style page content header title row actions child elements
 * (styling slotted content, using ::slotted will not work on Edge)
 */

// language=HTML
export const pageContentHeaderSlottedStyles: TemplateResult = html`
    <style>
        .content-header-actions {
            @apply --layout-horizontal;
            @apply --layout-end;
        }

        /* TODO: add more styles as needed */
    </style>`;
