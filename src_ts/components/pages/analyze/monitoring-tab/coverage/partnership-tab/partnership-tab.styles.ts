import {css, CSSResult} from 'lit';
// language=CSS
export const partnershipTabStyles: CSSResult = css`
  .partner-coverage {
    display: flex;
    flex-direction: column;
    padding: 1%;
  }
  .partner-coverage__header {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 2%;
    justify-content: space-between;
  }
  .partner-coverage__header-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-basis: 50%;
  }
  .sorting-dropdown {
    flex-basis: 30%;
  }
  .coverage-legend {
    display: flex;
    justify-content: space-evenly;
  }
  .coverage-legend__mark {
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
  }
  .coverage-legend__mark-completed {
    background-color: #48b6c2;
  }
  .coverage-legend__mark-required {
    height: 100%;
    width: 0;
    border: 1px solid #ff9044;
  }
  .coverage-legend__label {
    flex-basis: 90%;
  }
  .progressbar-container {
    margin-bottom: 2%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
  .progressbar-container__header {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 36px;
    color: grey;
  }
`;
