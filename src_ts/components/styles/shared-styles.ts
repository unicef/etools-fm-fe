import {css, CSSResult} from 'lit';
// language=CSS
export const SharedStyles: CSSResult = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  *[hidden] {
    display: none !important;
  }

  h1,
  h2 {
    color: var(--primary-text-color);
    margin: 0;
    font-weight: normal;
  }

  h1 {
    text-transform: capitalize;
    font-size: var(--etools-font-size-24, 24px);
  }

  h2 {
    font-size: var(--etools-font-size-20, 20px);
  }

  a {
    color: var(--primary-color);
    text-underline: none;
  }
  .col-data.table-header-padding {
    padding-left: 0;
    padding-right: 0;
  }
  section {
    padding: 18px 24px;
    background-color: var(--primary-background-color);
  }

  .toggle-button-control {
    display: flex;
    flex-direction: row;
    align-items: center;
    align-self: center;
    padding: 18px 0 18px 0px;
  }

  .toggle-button-control span {
    font-size: var(--etools-font-size-16, 16px);
    line-height: 18px;
  }

  .readonly {
    pointer-events: none;
  }

  pages-header-element {
    box-shadow: 1px -3px 9px 0 #000000;
  }

  .filters-section {
    padding: 0px 24px;
  }

  etools-content-panel::part(ecp-header) {
    background-color: var(--primary-background-color);
    border-bottom: 1px groove var(--dark-divider-color);
    color: var(--primary-text-color);
  }
  etools-content-panel::part(ecp-header-title) {
    padding: 0 0;
    text-align: left;
  }

  .horizontal .validate-input:not(:last-child) {
    padding-inline-end: 15px;
  }
  .w-100 {
    width: 100%;
  }
  @media (max-width: 576px) {
    h1 {
      font-size: var(--etools-font-size-18, 18px);
      width: 100%;
    }
  }
`;
