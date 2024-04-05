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

    etools-dropdown::part(display-input) {
      text-align: end;
    }

    countries-dropdown[dir='rtl'] {
      margin-inline: 30px 20px;
    }

    organizations-dropdown {
      max-width: 180px;
      margin-inline-start: 10px;
    }

    countries-dropdown {
      max-width: 160px;
      margin-inline-start: 10px;
    }

    #languageSelector {
      max-width: 160px;
    }

    etools-accesibility {
      margin-inline-end: 10px;
    }

    .w100 {
      width: 100%;
    }
    .dropdown {
      padding-block-start: 6px;
      margin-inline-start: auto;
      display: flex;
      margin-inline-end: 20px;
    }

    etools-dropdown.warning::part(combobox) {
      outline: 1.5px solid red !important;
      padding: 4px;
    }

    etools-dropdown {
      --sl-input-placeholder-color: var(--light-secondary-text-color);
      opacity: 1;
    }

    @media (max-width: 1024px) {
      #languageSelector,
      organizations-dropdown,
      countries-dropdown {
        max-width: 150px !important;
      }
    }

    @media (max-width: 768px) {
      etools-dropdown {
        max-width: 130px;
      }
    }
    @media (max-width: 576px) {
      #app-logo {
        display: none;
      }
      #languageSelector,
      organizations-dropdown,
      countries-dropdown {
        max-width: 130px !important;
      }
    }
  </style>
`;
