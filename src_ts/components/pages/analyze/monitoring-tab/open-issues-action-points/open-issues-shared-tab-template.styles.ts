import {css, CSSResult} from 'lit-element';
// language=CSS
export const openIssuesSharedTabTemplateStyles: CSSResult = css`
  :host {
    --open-issues-color: #fee8c8;
    --action-points-color: #ff9044;
  }
  .open-issues {
    display: flex;
    flex-direction: column;
  }
  .open-issues__legend {
    display: flex;
    flex-direction: column;
    margin: 2%;
  }
  .legend {
    display: flex;
  }
  .legend__mark {
    min-width: 17px;
    min-height: 17px;
    max-width: 17px;
    max-height: 17px;
    margin-right: 2%;
    display: flex;
    justify-content: center;
  }
  .legend__mark-issues {
    background-color: var(--open-issues-color);
  }
  .legend__mark-action-points {
    background-color: var(--action-points-color);
  }

  .progressbar-host {
    display: flex;
    flex-direction: column;
    margin: 2%;
  }

  .progressbar__header {
    display: flex;
    justify-content: space-between;
  }

  .progressbar__content {
    height: 30px;
    display: flex;
    align-items: center;
  }

  .progressbar-label {
    color: grey;
  }

  .progressbar-issues {
    background-color: var(--open-issues-color);
  }

  .progressbar-action-points {
    background-color: var(--action-points-color);
  }

  .progressbar-value {
    margin-left: 1%;
  }
`;
