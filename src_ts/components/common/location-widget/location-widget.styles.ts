import {css, CSSResult} from 'lit';

// language=CSS
export const LocationWidgetStyles: CSSResult = css`
  :host {
    position: relative;
    width: 100%;
  }

  .widget-container {
    position: relative;
    display: flex;
    flex-direction: column;
    z-index: 0;
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

  .widget-container .history etools-input {
    margin-inline-end: 22px;
    max-width: 200px;
  }

  .widget-container .history etools-input div[slot] {
    margin-left: 5px;
    color: #dd0000;
  }

  .widget-container .history etools-input::part(readonly-input) {
    border-bottom: 1px solid black;
    padding-bottom: 3px;
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
    margin-inline-end: 25px;
  }

  .widget-container .map-and-list .list {
    flex: 1;
    overflow: hidden;
  }

  .locations-list {
    display: flex;
    flex: 1;
    flex-flow: column;
    height: calc(100% - 43px);
    position: relative;
    overflow-y: auto;
  }

  .widget-container .map-and-list .list etools-input {
    margin-top: -20px;
  }

  .site-line,
  .location-line {
    position: relative;
    display: flex;
    padding: 5px;
    margin-bottom: 2px;
  }

  .site-line:last-child,
  .location-line:last-child {
    margin-bottom: 0;
  }

  .site-line:hover,
  .location-line:hover {
    background-color: var(--gray-06);
    cursor: pointer;
  }

  .site-line .gateway-name,
  .location-line .gateway-name {
    flex: none;
    width: 100px;
    color: var(--gray-light);
  }

  .site-line .location-name,
  .location-line .location-name {
    flex: auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 5px;
  }

  .site-line .deselect-btn,
  .location-line .deselect-btn {
    flex: none;
    width: 50px;
    text-align: center;
    color: #dd0000;
  }

  .site-line .deselect-btn span,
  .location-line .deselect-btn span {
    display: none;
  }

  .site-line.selected,
  .location-line.selected .deselect-btn {
    background-color: #f3e5bf;
  }

  .site-line.selected .deselect-btn span,
  .location-line.selected .deselect-btn span {
    display: inline;
  }
  .missing-sites,
  .no-search-results {
    position: absolute;
    top: 0;
    left: 0;
  }
`;
