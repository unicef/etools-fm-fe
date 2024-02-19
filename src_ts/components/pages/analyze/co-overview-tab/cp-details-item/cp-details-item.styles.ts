import {css, CSSResult} from 'lit';
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
    font-size: var(--etools-font-size-12, 12px);
  }

  .line {
    padding: 5px 0;
    font-size: var(--etools-font-size-14, 14px);
    color: var(--primary-text-color);
  }
  .line.ram-indicator:nth-child(odd) {
    background-color: var(--secondary-background-color);
  }

  .target {
    text-align: right;
    padding-left: 70px;
    width: 210px;
  }

  .partners-data .prog-visits {
    text-align: right;
  }

  .partners-data .prog-visits-width {
    width: 65px;
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
  [class^="col-"].no-pl {
    padding-left: 0
  }
  .partner .intervention-data .links {
    justify-content: space-evenly;
  }

  .partner .intervention-details {
    padding: 9px 9px 9px 45px;
    background-color: var(--secondary-background-color);
  }

  etools-icon.grey {
    margin-left: 10px;
    color: var(--secondary-text-color);
  }

  .space-for-arrow {
    width: 45px;
  }

  .interact-icons {
    width: 150px;
  }

  .days-since-last-visit {
    width: 120px;
  }
`;
