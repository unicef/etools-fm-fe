import {css, CSSResult} from 'lit-element';

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

  .locations-list {
    display: flex;
    flex: 1;
    flex-flow: column;
    height: calc(100% - 43px);
    position: relative;
    overflow-y: auto;
  }

  .widget-container .map-and-list .list paper-input {
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

  .marker-cluster-small {
    background-color: rgba(181, 226, 140, 0.6);
  }
  .marker-cluster-small div {
    background-color: rgba(110, 204, 57, 0.6);
  }

  .marker-cluster-medium {
    background-color: rgba(241, 211, 87, 0.6);
  }
  .marker-cluster-medium div {
    background-color: rgba(240, 194, 12, 0.6);
  }

  .marker-cluster-large {
    background-color: rgba(253, 156, 115, 0.6);
  }
  .marker-cluster-large div {
    background-color: rgba(241, 128, 23, 0.6);
  }
  .marker-cluster {
    background-clip: padding-box;
    border-radius: 20px;
  }
  .marker-cluster div {
    width: 30px;
    height: 30px;
    margin-left: 5px;
    margin-top: 5px;

    text-align: center;
    border-radius: 15px;
    font: 12px 'Helvetica Neue', Arial, Helvetica, sans-serif;
  }
  .marker-cluster span {
    line-height: 30px;
  }
  .leaflet-cluster-anim .leaflet-marker-icon,
  .leaflet-cluster-anim .leaflet-marker-shadow {
    -webkit-transition: -webkit-transform 0.3s ease-out, opacity 0.3s ease-in;
    -moz-transition: -moz-transform 0.3s ease-out, opacity 0.3s ease-in;
    -o-transition: -o-transform 0.3s ease-out, opacity 0.3s ease-in;
    transition: transform 0.3s ease-out, opacity 0.3s ease-in;
  }
  .leaflet-cluster-spider-leg {
    -webkit-transition: -webkit-stroke-dashoffset 0.3s ease-out, -webkit-stroke-opacity 0.3s ease-in;
    -moz-transition: -moz-stroke-dashoffset 0.3s ease-out, -moz-stroke-opacity 0.3s ease-in;
    -o-transition: -o-stroke-dashoffset 0.3s ease-out, -o-stroke-opacity 0.3s ease-in;
    transition: stroke-dashoffset 0.3s ease-out, stroke-opacity 0.3s ease-in;
  }
`;
