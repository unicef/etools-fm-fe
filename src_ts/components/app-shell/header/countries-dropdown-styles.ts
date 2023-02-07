import {html, TemplateResult} from 'lit-element';

// language=HTML
export const countriesDropdownStyles: TemplateResult = html`
  <style>
    *[hidden] {
      display: none !important;
    }

    :host {
      display: block;
    }

    :host(:hover) {
      cursor: pointer;
    }

    etools-dropdown {
      --paper-listbox: {
        max-height: 600px;
      }

      --esmm-icons: {
        color: var(--header-color);
        cursor: pointer;
      }

      --paper-input-container-underline: {
        display: none;
      }

      --paper-input-container-underline-focus: {
        display: none;
      }

      --paper-input-container-underline-disabled: {
        display: none;
      }

      --paper-input-container-shared-input-style: {
        color: var(--header-color);
        cursor: pointer;
        font-size: 16px;
        text-align: right;
        width: 100px;
      }

      --paper-menu-button-dropdown: {
        max-height: 380px;
      }
    }

    organizations-dropdown {
      width: 180px;
      margin-left: 5px;
    }

    etools-dropdown.warning {
      --paper-input-container: {
        padding-left: 3px;
        box-sizing: border-box;
        box-shadow: inset 0px 0px 0px 1.5px red;
      }
    }

    @media (max-width: 900px) {
      etools-dropdown {
        width: 100px;
      }
    }
  </style>
`;
