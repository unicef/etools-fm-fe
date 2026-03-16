import {css, CSSResult} from 'lit';
// language=CSS
export const ActivitiesListStyles: CSSResult = css`
  .activities-table-section {
    padding: 0;
  }

  .activities-table-section .table-scroll {
    overflow-x: auto;
    overflow-y: hidden;
  }

  .activities-table-section .table-scroll .table-scroll-content {
    display: inline-block;
    min-width: 100%;
  }

  .activities-table-section .table-scroll .table-scroll-content > etools-data-table-header,
  .activities-table-section .table-scroll .table-scroll-content > etools-data-table-row,
  .activities-table-section .table-scroll .table-scroll-content > etools-data-table-footer {
    width: 100%;
  }

  .activities-table-section .table-scroll etools-data-table-column {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .activities-table-section .col-data {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .create-new {
    min-width: 125px;
    margin-right: -25px;
    text-transform: uppercase;
  }

  .filters {
    position: relative;
  }
`;
