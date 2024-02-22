import {html, TemplateResult} from 'lit';
// language=HTML
export const InputStyles: TemplateResult = html`
  <style>
    etools-icon-button[hidden] {
      display: inline-block !important;
      visibility: hidden;
    }

    .file-link etools-icon {
      color: var(--dark-icon-color);
    }

    etools-icon {
      color: var(--dark-secondary-text-color);
    }

    .file-link a {
      padding-left: 5px;
      color: var(--accent-color);
      text-decoration: none;
      font-weight: 500;
    }

    a.link-button {
      color: var(--module-primary);
      font-weight: 500;
      cursor: pointer;
    }

    etools-dropdown,
    etools-dropdown-multi,
    etools-input,
    etools-textarea,
    paper-dropdown-menu,
    etools-currency-amount-input,
    datepicker-lite {
      outline: none !important;
      color: var(--gray-dark, rgba(0, 0, 0, 0.87));
      box-sizing: border-box;

      --etools-currency-container-label-floating: {
        -webkit-transform: none;
        -moz-transform: none;
        -ms-transform: none;
        -o-transform: none;
        transform: none;
        top: -21px;
        width: 100%;
        font-size: var(--etools-font-size-12, 12px);
      }
    }

    etools-currency-amount-input.required:not([disabled]) {
      --etools-currency-container-label: {
        background: url('/fm/assets/images/required.svg') no-repeat 98% 14%/7px;
        width: auto !important;
        max-width: 90%;
        right: auto;
        padding-right: 15px;
        color: var(--gray-50);
      }
    }

    etools-currency-amount-input[disabled] {
      --etools-currency-container-underline-disabled: {
        border-bottom: 1px dashed rgba(0, 0, 0, 0.2) !important;
      }
      --etools-currency-container-label: {
        color: var(--gray-50);
      }
    }

    etools-checkable-input {
      --etools-checkable-input-label: {
        font-size: var(--etools-font-size-16, 16px);
        font-weight: 400;
        line-height: 21px;
      }
    }

    etools-currency-amount-input {
      padding: 0 12px;
      box-sizing: border-box;
    }

    etools-content-panel:not([list])::part(ecp-content) {
      padding: 8px 12px;
      padding-inline-start: 12px;
    }

    etools-currency-amount-input {
      --etools-currency-container-input: {
        line-height: 0;
      }
    }

    .text-control {
      padding: 14px;
    }

    .text-control label {
      color: var(--gray-mid);
      font-size: var(--paper-font-caption_-_font-size);
      font-weight: var(--paper-font-caption_-_font-weight);
    }

    .text-control .value {
      padding-bottom: 3px;
    }
  </style>
`;
