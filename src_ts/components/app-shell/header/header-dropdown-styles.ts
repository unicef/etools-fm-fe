import {html, TemplateResult} from 'lit';

// language=HTML
export const headerDropdownStyles: TemplateResult = html`
  <style>
    *[hidden] {
      display: none !important;
    }

    :host {
      display: block;
      --sl-spacing-small: 0;
    }

    :host(:hover) {
      cursor: pointer;
    }

    :host([dir='rtl']) etools-dropdown {
      --paper-input-container-shared-input-style_-_max-width: 75px;
    }

    etools-dropdown::part(display-input) {
      text-align: end;
    }

    countries-dropdown[dir='rtl'] {
      margin-inline: 30px 20px;
    }

    organizations-dropdown {
      width: 180px;
    }

    countries-dropdown {
      width: 160px;
    }

    #languageSelector {
      width: 120px;
      margin-left: auto;
    }

    .w100 {
      width: 100%;
    }

    etools-dropdown.warning::part(combobox) {
      outline: 1.5px solid red !important;
      padding: 4px;
    }

    etools-dropdown::part(display-input)::placeholder {
      color: var(--sl-input-color);
      opacity: 1;
    }

    etools-dropdown::part(display-input)::-ms-input-placeholder {
      /* Edge 12-18 */
      color: var(--sl-input-color);
    }
    @media (max-width: 1024px) {
      etools-dropdown {
        min-width: 130px;
        width: 130px;
      }
      organizations-dropdown {
        width: 130px;
      }

      countries-dropdown {
        width: 130px;
      }
    }

    @media (max-width: 768px) {
      etools-dropdown {
        min-width: 130px;
        width: 130px;
      }
    }
    @media (max-width: 576px) {
      #app-logo {
        display: none;
      }

      etools-dropdown {
        min-width: auto;
      }
      #languageSelector {
        width: 110px;
      }
    }
  </style>
`;
