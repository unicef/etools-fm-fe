import {css, CSSResult} from 'lit-element';

// language=CSS
export const LocationWidgetStyles: CSSResult = css`
  :host {
    position: relative;
    width: 100%;
    min-width: 800px;
  }

  .widget-container {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .widget-container .history {
    position: relative;
    display: flex;
    margin: 0 10px 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid var(--gray-lighter);
  }

  .widget-container .history .close-btn {
    cursor: pointer;
  }

  .widget-container .history paper-input {
    margin-right: 22px;
  }

  .widget-container .history paper-input div[slot] {
    margin-left: 5px;
    color: #dd0000;
  }

  .widget-container a.link {
    color: var(--primary-color);
    cursor: pointer;
  }

  .widget-container .map-and-list {
    position: relative;
    display: flex;
    width: 100%;
    padding: 10px;
    max-height: 320px;
    box-sizing: border-box;
  }

  .widget-container .map-and-list #map {
    flex: 1;
    height: 300px;
    margin-right: 25px;
  }

  .widget-container .map-and-list .list {
    flex: 1;
    overflow: hidden;
  }

  .widget-container .map-and-list .list paper-input {
    margin-top: -20px;
  }

  .widget-container .map-and-list .list .locations-list {
    position: relative;
    overflow: hidden;
    overflow-y: auto;
    height: calc(100% - 43px);
  }

  .widget-container .map-and-list .list .site-line,
  .widget-container .map-and-list .list .location-line {
    position: relative;
    display: flex;
    padding: 5px;
    margin-bottom: 2px;
  }

  .widget-container .map-and-list .list .site-line:last-child,
  .widget-container .map-and-list .list .location-line:last-child {
    margin-bottom: 0;
  }

  .widget-container .map-and-list .list .site-line:hover,
  .widget-container .map-and-list .list .location-line:hover {
    background-color: var(--gray-06);
    cursor: pointer;
  }

  .widget-container .map-and-list .list .site-line .gateway-name,
  .widget-container .map-and-list .list .location-line .gateway-name {
    flex: none;
    width: 100px;
    color: var(--gray-light);
  }

  .widget-container .map-and-list .list .site-line .location-name,
  .widget-container .map-and-list .list .location-line .location-name {
    flex: auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 5px;
  }

  .widget-container .map-and-list .list .site-line .deselect-btn,
  .widget-container .map-and-list .list .location-line .deselect-btn {
    flex: none;
    width: 50px;
    text-align: center;
    color: #dd0000;
  }

  .widget-container .map-and-list .list .site-line .deselect-btn span,
  .widget-container .map-and-list .list .location-line .deselect-btn span {
    display: none;
  }

  .widget-container .map-and-list .list .site-line.selected,
  .widget-container .map-and-list .list .location-line.selected .deselect-btn {
    background-color: #f3e5bf;
  }

  .widget-container .map-and-list .list .site-line.selected .deselect-btn span,
  .widget-container .map-and-list .list .location-line.selected .deselect-btn span {
    display: inline;
  }

  .locations-list div:not(.missing-sites) ~ .no-search-results,
  .locations-list div.missing-sites:not([hidden]) + .no-search-results {
    display: none;
  }
`;
