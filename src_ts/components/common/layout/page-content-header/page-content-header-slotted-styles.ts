import { css, CSSResult } from 'lit-element';
import '@polymer/iron-flex-layout/iron-flex-layout.js';

/**
 * Used to style page content header title row actions child elements
 * (styling slotted content, using ::slotted will not work on Edge)
 */

// language=CSS
export const pageContentHeaderSlottedStyles: CSSResult = css`
    .content-header-actions {
        @apply --layout-horizontal;
        @apply --layout-end;
    }
`;
