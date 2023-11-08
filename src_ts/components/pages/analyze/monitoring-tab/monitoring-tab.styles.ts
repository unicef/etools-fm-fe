import {css, CSSResult} from 'lit';
// language=CSS
export const monitoringActivityStyles: CSSResult = css`
  .monitoring-activity-container {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
  }

  .monitoring-activity__item {
    flex-grow: 1;
    flex-basis: 48%;
  }

  .monitoring-activity__overall-statistics {
    flex-basis: 100%;
  }

  .overall-completed-label {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    align-self: flex-end;
    margin: 1%;
  }

  .monitoring-activity__partnership-coverage {
  }

  .monitoring-activity__geographic-coverage {
  }

  .visits-card {
    display: flex;
    justify-content: space-around;
    min-height: 62px;
  }

  .visits-card__item {
    flex-basis: 50%;
    margin: 1%;
  }

  .completed-percentage-container {
    display: flex;
    align-items: center;
  }

  .tabs-container {
    border-bottom: 1px solid lightgrey;
  }
`;
