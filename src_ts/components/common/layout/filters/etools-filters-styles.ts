import {css, CSSResult} from 'lit-element';

// language=CSS
export const etoolsFiltersStyles: CSSResult = css`
  :host {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;

    -ms-flex-direction: row;
    -webkit-flex-direction: row;
    flex-direction: row;

    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;

    box-sizing: border-box;
    min-height: 62px;
    height: auto;
  }

  #filters {
    display: flex;
    flex-direction: row;
    align-items: center;

    -ms-flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;

    -ms-flex: 1 1 0.000000001px;
    -webkit-flex: 1;
    flex: 1;
    -webkit-flex-basis: 0.000000001px;
    flex-basis: 0.000000001px;

    margin-right: auto;
    margin-bottom: var(--etools-filters-margin-bottom);
  }

  #filters .filter {
    min-width: 160px;
    width: auto;
    min-height: 62px;
    height: auto;
  }

  #filters etools-dropdown.filter {
    /* TODO: 160px as requested makes etools-dropdown a little bit too small, no resize here...
    we might need to change this in the future (used only on reports filters) */
    width: 160px;
  }

  #filters .search {
    min-width: 280px;
  }

  iron-icon[icon='search'] {
    color: var(--secondary-text-color, rgba(0, 0, 0, 0.54));
  }

  #filters .filter.date {
    white-space: nowrap;
    --paper-input-container: {
      width: 182px;
    }
    min-width: 180px;
  }

  #filters > *:not(:last-child) {
    margin-right: 16px;
  }

  #filters .filter.toggle {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;

    -ms-flex-direction: row;
    -webkit-flex-direction: row;
    flex-direction: row;

    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;

    cursor: pointer;
    font-weight: normal;
    font-size: 16px;
  }

  #filters .filter.toggle paper-toggle-button {
    margin-left: 10px;
  }

  #filters-selector {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;

    -ms-flex-direction: column;
    -webkit-flex-direction: column;
    flex-direction: column;

    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;

    -ms-align-self: stretch;
    -webkit-align-self: stretch;
    align-self: stretch;

    padding: 0 0 0 8px;
    margin: 8px 0 8px 24px;
    border-left: 2px solid var(--light-divider-color, rgba(0, 0, 0, 0.12));
  }

  #filterMenu {
    max-width: 126px;
    padding: 0;
    --paper-menu-button-content: {
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  #filterMenu .button {
    color: var(--primary-color, rgba(0, 0, 0, 0.87));
    font-weight: 500;
    margin: 0;
  }

  #filterMenu .button iron-icon {
    margin-right: 5px;
  }

  #filterMenu paper-listbox {
    min-width: 250px;
  }

  #filterMenu paper-icon-item {
    --paper-item-icon-width: auto;
    font-weight: normal;
  }

  #filterMenu paper-icon-item iron-icon {
    margin-right: 8px;
  }

  #filterMenu paper-icon-item[selected] {
    font-weight: normal;
    background: var(--etools-filters-menu-selected-bg, #dcdcdc);
  }

  paper-icon-item {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;

    -ms-flex-direction: row;
    -webkit-flex-direction: row;
    flex-direction: row;

    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;

    -ms-flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;

    min-height: 48px;
    box-sizing: border-box;
    width: 100%;
    cursor: pointer;
  }

  .clear-all-filters {
    min-height: 48px;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;

    -ms-flex-direction: row;
    -webkit-flex-direction: row;
    flex-direction: row;

    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    color: var(--primary-color, rgba(0, 0, 0, 0.87));
    padding-right: 16px;
    border-bottom: 1px solid var(--light-divider-color, rgba(0, 0, 0, 0.12));
  }
`;
