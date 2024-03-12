import {css, CSSResult} from 'lit';

// language=CSS
export const IssueTrackerPopupStyles: CSSResult = css`
  .related-to-type label {
    color: var(--secondary-text-color);
    font-size: var(--etools-font-size-12, 12px);
    padding: 0 12px;
  }

  .issue-tracker-input {
    padding-bottom: 10px;
  }
`;
