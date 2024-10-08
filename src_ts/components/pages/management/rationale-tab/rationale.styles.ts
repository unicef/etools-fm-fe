import {css, CSSResult} from 'lit';
// language=CSS
export const RationaleStyles: CSSResult = css`
  :host {
    position: relative;
    display: block;
  }

  .year-dropdown-container {
    padding: 16px 20px 0 24px;
  }

  .year-dropdown {
    flex: none;
    min-width: auto;
    width: 110px;
  }

  .text-control:not(:first-of-type) {
    padding: 0 14px 14px 14px;
  }
`;
