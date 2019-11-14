import {css, CSSResult} from 'lit-element';
// language=CSS
export const CpDetailsItemStyles: CSSResult = css`
  :host {
    position: relative;
    display: block;
  }

  .full-report-container {
    position: relative;
    padding: 10px 25px;
  }

  .cp-indicators {
    position: relative;
    margin-bottom: 25px;
  }

  .line.title {
    color: var(--secondary-text-color);
    font-size: 12px;
  }

  .line {
    padding: 5px 15px;
    font-size: 14px;
    color: var(--primary-text-color);
  }
  .line.gray {
    background-color: var(--gray-lighter);
  }

  .target {
    text-align: right;
    padding-left: 70px;
  }

  .partners-data {
    padding-right: 25px;
  }

  .partners-data .prog-visits {
    text-align: right;
  }

  .partners-data div {
    position: relative;
  }

  .partner {
    line-height: 25px;
  }

  .partner .partners-data {
    border-right: solid 1px #dcdbdc;
    border-bottom: solid 1px #dcdbdc;
    overflow: hidden;
  }

  .partner .intervention-data {
    border-bottom: solid 1px #dcdbdc;
    overflow: hidden;
  }

  .partner .intervention-data .links {
    justify-content: space-evenly;
  }

  .partner .intervention-details {
    padding: 9px 9px 9px 45px;
    background-color: #ecebeb;
  }

  .partner .intervention-details .results-text {
    white-space: pre-line;
  }

  iron-icon.grey {
    margin-left: 10px;
    color: var(--secondary-text-color);
  }
`;