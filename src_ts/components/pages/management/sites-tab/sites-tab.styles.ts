import {css, CSSResult} from 'lit';
// language=CSS
export const SitesTabStyles: CSSResult = css`
  :host {
    position: relative;
    display: block;
  }
  .start {
    align-items: flex-start;
  }
  .no-pr {
    padding-right: 0;
  }
  .sites-table-section {
    padding: 0;
  }

  .filter-dropdown {
    margin-left: 20px;
    width: 240px;

    --esmm-list-wrapper: {
      margin-top: 0;
      padding-top: 12px;
      -ms-overflow-style: auto;
    }
  }

  .search-input {
    width: 260px;
  }

  .sites-list {
    position: relative;
    flex: auto;
    border-left: 1px solid #e0e0e0;
  }

  .parent-row {
    align-items: center;
  }

  .location {
    align-items: flex-start !important;
  }

  .admin-level-text {
    color: #a4a4a4;
  }

  .site-row {
    padding-right: 24px;
    border-top: 1px solid #e0e0e0;
  }

  .site-row:hover {
    background-color: #eeeeee;
  }
  .site-row:first-child {
    border-top: none;
  }
  .row .hover-block {
    right: 24px;
  }
  .site-row .active-marker {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #f59049;
  }
  .site-row .active-marker.active {
    background-color: #309a53;
  }

  #map {
    position: relative;
    width: calc(100% - 18px);
    height: 400px;
    margin: 8px;
    z-index: 0;
  }

  .current-coords {
    padding: 0 12px;
    color: #858585;
    white-space: pre;
    font-size: var(--etools-font-size-16, 16px);
  }

  .row .hover-block {
    padding: 0 20px;
  }
`;
