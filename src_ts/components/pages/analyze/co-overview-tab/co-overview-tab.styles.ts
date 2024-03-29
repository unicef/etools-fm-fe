import {css, CSSResult} from 'lit';
// language=CSS
export const CoOverviewTabStyles: CSSResult = css`
  :host {
    position: relative;
  }

  etools-dropdown {
    width: 40%;
    min-width: 250px;
    max-width: 500px;
  }

  .card-title.full-report {
    max-width: max-content;
  }

  etools-icon {
    margin-left: 5px;
    margin-right: 10px;
    cursor: pointer;
  }

  etools-icon.flag-icon {
    margin-left: 10px;
    color: var(--secondary-text-color);
  }

  .spinner {
    position: relative;
    width: 100%;
    height: 200px;
  }
`;
