import {css, CSSResult} from 'lit-element';

// language=CSS
export const CardStyles: CSSResult = css`
  .card-title-box {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 60px;
    padding: 0 10px 0 25px;
  }

  .card-title-box.with-bottom-line {
    border-bottom: 1px solid #9c9c9c;
  }

  .card-title-box .card-title {
    flex: auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 18px;
  }

  .card-title-box .card-title.counter {
    font-size: 20px;
    font-weight: 500;
  }

  .card-title-box .buttons-container {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
  }

  .panel-button {
    opacity: 0.45;
    transition: 0.15s;
  }

  .panel-button:hover {
    opacity: 0.57;
  }

  .card-content {
    padding: 0 10px;
  }

  .editable-row {
    position: relative;
  }

  .editable-row .hover-block {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    line-height: 48px;
    background-color: #eeeeee;
    z-index: 100;
  }

  .editable-row .hover-block paper-icon-button {
    color: rgba(0, 0, 0, 0.54);
    padding-left: 5px;
  }

  .editable-row:hover > .hover-block {
    display: block;
    cursor: pointer;
  }

  .col-data {
    height: auto;
    min-height: 47px;
    display: flex;
    align-items: center;
    min-width: 0;
    overflow: hidden;
    margin-right: 5px;
  }

  .col-data:last-child {
    margin-right: 0;
  }

  .col-data.edited-col {
    cursor: pointer;
  }

  .col-data .two-line-truncate {
    height: 38px;
    overflow: hidden;
  }

  .col-data.truncated,
  .col-data .truncate {
    flex-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .col-data .flexible-text {
    display: block;
    margin: 4px 0;
  }

  .row-details-content {
    font-size: 12px;
    padding-right: 100px;
  }

  .row-details-content .rdc-title {
    display: inline-block;
    color: var(--list-secondary-text-color, #757575);
    font-weight: bold;
    margin-bottom: 5px;
  }

  etools-data-table-row {
    --list-divider-color: #e0e0e0;
    --list-icon-color: rgba(0, 0, 0, 0.54);
  }

  etools-data-table-header {
    --list-divider-color: 1px solid rgba(244, 243, 242, 0.26);
    --list-bg-color: #f2eee8;
    border-bottom: 1px solid rgba(0, 0, 0, 0.26);
  }

  .card-container {
    padding: 0;
  }

  .remove-title {
    padding: 16px 25px 15px;
    font-size: 17px;
    color: rgba(0, 0, 0, 0.87);
    font-weight: 500;
    line-height: 28px;
  }

  paper-textarea {
    overflow: hidden;
  }

  a.link-cell {
    font-weight: 500;
    text-decoration: none;
    color: var(--module-primary);
  }
`;
