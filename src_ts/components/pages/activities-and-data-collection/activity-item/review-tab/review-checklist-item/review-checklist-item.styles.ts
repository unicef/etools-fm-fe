import {css, CSSResult} from 'lit';
// language=CSS
export const ReviewChecklistItemStyles: CSSResult = css`
  .item-title {
    font-weight: 500;
    font-size: var(--etools-font-size-16, 16px);
  }
  etools-data-table-row {
    --list-divider-color: var(--gray-lighter);
  }
  .rdc-title {
    font-weight: 500;
    font-size: var(--etools-font-size-12, 12px);
    color: var(--gray-mid);
  }
  .checklist-line {
    padding: 4px 0;
    border-bottom: 1px solid var(--gray-lighter);
  }
  .checklist-line:last-child {
    border-bottom: none;
  }
`;
