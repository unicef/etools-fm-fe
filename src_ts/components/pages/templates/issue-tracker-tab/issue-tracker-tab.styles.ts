import {css, CSSResult} from 'lit';
// language=CSS
export const IssueTrackerTabStyles: CSSResult = css`
  :host {
    position: relative;
    display: block;
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
    min-width: 160px;
  }
  .filter:not(:last-of-type) {
    margin-right: 16px;
  }
  .files-column {
    color: var(--module-primary);
    cursor: pointer;
    font-weight: 500;
  }
`;
