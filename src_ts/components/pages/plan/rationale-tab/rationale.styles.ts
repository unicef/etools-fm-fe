import {css, CSSResult} from 'lit-element';
// language=CSS
export const RationaleStyles: CSSResult = css`
  :host {
    position: relative;
    display: block;
  }

  .history-info {
    color: var(--gray-light);
    font-size: 13px;
    font-style: italic;
    margin-right: 20px;
    letter-spacing: 0.04em;
  }

  .year-dropdown-container {
    padding: 16px 20px 0;
  }

  .year-dropdown {
    flex: none;
    min-width: auto;
    width: 110px;
  }

  paper-card {
    padding: 8px 0;
    display: block;
    margin-top: 25px;
    --paper-card_-_background-color: white;
    --paper-card_-_margin: 0 24px;
  }

  .text-control:not(:first-of-type) {
    padding: 0 14px 14px 14px;
  }
`;
