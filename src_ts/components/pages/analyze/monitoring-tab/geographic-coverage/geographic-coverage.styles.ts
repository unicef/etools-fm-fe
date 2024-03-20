import {css, CSSResult} from 'lit';
// language=CSS
export const geographicCoverageStyles: CSSResult = css`
  :host {
    --mark-no-visits-color: #efefef;
    --mark-one-five-color: #ff0000;
    --mark-six-ten: #ffed00;
    --mark-eleven: #00e021;
  }
  #geomap {
    min-height: 400px;
    z-index: 0;
  }
  .monitoring-activity__geographic-coverage {
  }
  .geographic-coverage {
    display: flex;
    flex-direction: column;
  }
  .geographic-coverage__header {
    display: flex;
    flex-wrap: wrap;
    padding: 2%;
    justify-content: space-between;
  }
  .geographic-coverage__header-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-basis: 50%;
  }
  .sorting-dropdown {
    flex-basis: 30%;
  }
  .coverage-legend-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 2%;
  }
  .coverage-legend {
    display: flex;
    flex-basis: 40%;
    margin: 1%;
  }
  .coverage-legend__mark {
    min-width: 17px;
    min-height: 17px;
    max-width: 17px;
    max-height: 17px;
    margin-right: 2%;
    display: flex;
    justify-content: center;
  }
  .coverage-legend__mark-no-visits {
    background-color: var(--mark-no-visits-color);
  }
  .coverage-legend__mark-one-five {
    background-color: var(--mark-one-five-color);
  }
  .coverage-legend__mark-six-ten {
    background-color: var(--mark-six-ten);
  }
  .coverage-legend__mark-eleven {
    background-color: var(--mark-eleven);
  }
  .coverage-legend__label {
  }
`;
