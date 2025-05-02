import {css, CSSResult} from 'lit';
// language=CSS
export const IssueTrackerTabStyles: CSSResult = css`
  :host {
    position: relative;
    display: block;
  }
  .no-rm {
    margin-right: 0;
  }
  .no-lm {
    margin-left: 0;
  }
  .issue-tracker-table-section {
    padding: 0;
  }
  .filters {
    display: flex;
    flex-flow: row wrap;
  }
  .filter {
    width: auto;
  }
  .files-column {
    color: var(--module-primary);
    cursor: pointer;
    font-weight: 500;
  }

  .editable-row .hover-block etools-icon {
    color: rgba(0, 0, 0, 0.54);
  }
`;
