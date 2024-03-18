import {css, CSSResult} from 'lit';

/**
 * Used to style page content header title row actions child elements
 * (styling slotted content, using ::slotted will not work on Edge)
 */

// language=CSS
export const pageContentHeaderSlottedStyles: CSSResult = css`
  .content-header-actions {
    display: flex;
    margin-left: auto;
  }
`;
