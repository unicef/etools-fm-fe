import {html, TemplateResult} from 'lit-element';

// language=HTML
export const countriesDropdownStyles: TemplateResult = html`
  <style>
    *[hidden] {
      display: none !important;
      --paper-input-container-shared-input-style_-_color: red;
      --paper-input-container-input_-_color: red;
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

    @media (max-width: 900px) {
      etools-dropdown {
        width: 100px;
      }
    }
  </style>
`;
