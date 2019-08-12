import { html, TemplateResult } from 'lit-element';

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
      width: 160px;

      --paper-listbox: {
        max-height: 600px;
      };

      --esmm-icons: {
        color: var(--header-color);
        cursor: pointer;
      };

      --paper-input-container-underline: {
        display: none;
      };

      --paper-input-container-underline-focus: {
        display: none;
      };

      --paper-input-container-underline-disabled: {
        display: none;
      };

      --paper-input-container-input: {
        color: var(--header-color);
        cursor: pointer;
        min-height: 24px;
        text-align: right;
        line-height: 21px; /* for IE */
      };

      --paper-menu-button-dropdown: {
        max-height: 380px;
      };
    }
  </style>

`;
