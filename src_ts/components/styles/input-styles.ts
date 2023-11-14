import {html, TemplateResult} from 'lit';
// language=HTML
export const InputStyles: TemplateResult = html`
  <style>
    etools-icon-button[hidden] {
      display: inline-block !important;
      visibility: hidden;
    }

    .file-link iron-icon {
      color: var(--dark-icon-color);
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
      padding: 0 12px;
      color: var(--gray-dark, rgba(0, 0, 0, 0.87));
      box-sizing: border-box;

      --esmm-placeholder-color: var(--gray-dark, rgba(0, 0, 0, 0.87));
      --esmm-multi-placeholder-color: var(--gray-dark, rgba(0, 0, 0, 0.87));
      --paper-input-container-focus-color: var(--primary-color, #0099ff);
      --paper-input-container-invalid-color: var(--module-error, #ea4022);

      --paper-input-container-input: {
        display: block !important;
        font-size: 15px;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 3px;
        color: var(--gray-dark, rgba(0, 0, 0, 0.87));
      }
      --paper-input-container-label: {
        color: var(--gray-50, rgba(0, 0, 0, 0.5));
      }

      --paper-input-char-counter: {
        color: var(--gray-light, rgba(0, 0, 0, 0.38));
      }

      --paper-input-container-label-floating: {
        -webkit-transform: none;
        -moz-transform: none;
        -ms-transform: none;
        -o-transform: none;
        transform: none;
        top: -21px;
        width: 100%;
        font-size: 12px;
      }

      --etools-currency-container-label-floating: {
        -webkit-transform: none;
        -moz-transform: none;
        -ms-transform: none;
        -o-transform: none;
        transform: none;
        top: -21px;
        width: 100%;
        font-size: 12px;
      }

      --paper-input-container-shared-input-style: {
        font-size: 16px;
        width: 100%;
      }

      --paper-input-prefix: {
        margin-right: 10px;
        color: var(--gray-mid, rgba(0, 0, 0, 0.54));
      }

      --paper-input-error: {
        overflow: hidden;
      }

      --iron-autogrow-textarea: {
        padding: 0;
      }
    }

    etools-dropdown.no-data-fetched,
    etools-dropdown-multi.no-data-fetched,
    etools-Input.no-data-fetched {
      --esmm-placeholder-color: var(--gray-dark);
      --paper-input-container-color: var(--gray-dark);
    }

    etools-currency-amount-input {
      --etools-currency-container-label: {
        color: var(--gray-50);
      }
      --paper-input-container-color: var(--gray-20);
      --paper-input-container-focus-color: var(--module-primary);
    }

    etools-dropdown-multi[disabled],
    etools-dropdown[disabled],
    etools-textarea[disabled],
    paper-dropdown-menu[disabled],
    etools-Input[disabled],
    datepicker-lite[disabled] {
      --paper-input-container: {
        opacity: 1 !important;
      }
      --paper-input-container-underline: {
        border-bottom: 1px dashed var(--gray-20, rgba(0, 0, 0, 0.2));
        display: block !important;
      }
      --paper-input-container-underline-focus: {
        display: none;
      }
      --paper-input-container-focus-color: var(
        --paper-input-container-label_-_color,
        var(--paper-input-container-color, var(--secondary-text-color))
      );
    }

    etools-dropdown-multi[readonly]:not(.datepicker),
    etools-dropdown[readonly]:not(.datepicker),
    etools-textarea[readonly]:not(.datepicker),
    paper-dropdown-menu[readonly]:not(.datepicker),
    etools-Input[readonly]:not(.datepicker),
    datepicker-lite[readonly]:not(.datepicker) {
      --paper-input-container-focus-color: var(
        --paper-input-container-label_-_color,
        var(--paper-input-container-color, var(--secondary-text-color))
      );
      --paper-input-container: {
        opacity: 1 !important;
      }
      --paper-input-container-underline: {
        border-bottom: none !important;
        display: none !important;
      }
      --paper-input-container-underline-focus: {
        display: none;
      }
      --paper-input-container-underline-disabled: {
        display: none;
      }
    }

    etools-dropdown-multi.required:not([disabled]),
    etools-dropdown-multi[required]:not([disabled]),
    etools-dropdown-multi[required].readonly-required,
    etools-dropdown.required:not([disabled]),
    etools-dropdown[required]:not([disabled]),
    etools-dropdown[required].readonly-required,
    paper-dropdown-menu.required:not([disabled]),
    paper-dropdown-menu[required]:not([disabled]),
    paper-dropdown-menu[required].readonly-required,
    etools-textarea.required:not([disabled]),
    etools-textarea[required]:not([disabled]),
    etools-textarea[required].readonly-required,
    etools-Input.required:not([disabled]),
    etools-Input[required].readonly-required,
    etools-Input[required]:not([disabled]) {
      --paper-input-container-label: {
        background: url('/fm/assets/images/required.svg') no-repeat 98% 14%/7px;
        width: auto !important;
        max-width: 90%;
        right: auto;
        padding-right: 15px;
        color: var(--gray-50);
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

    etools-dropdown-multi.bold,
    etools-dropdown.bold,
    etools-Input.bold {
      --paper-input-container-input: {
        font-weight: 500;
      }

      --paper-input-container-underline-focus: {
        display: none !important;
      }

      --paper-input-container-underline-disabled: {
        display: none !important;
      }

      --paper-input-container-underline: {
        display: none !important;
      }
    }

    etools-dropdown-multi.deleted,
    etools-dropdown.deleted,
    etools-Input.deleted {
      --paper-input-container-input: {
        color: #b0b0b0;
      }
    }

    etools-currency-amount-input[disabled] {
      --etools-currency-container-underline-disabled: {
        border-bottom: 1px dashed rgba(0, 0, 0, 0.2) !important;
      }
      --etools-currency-container-label: {
        color: var(--gray-50);
      }
      --paper-input-container: {
        opacity: 1 !important;
        color: var(--gray-dark) !important;
      }
    }

    etools-dropdown.readonly,
    etools-dropdown-multi.readonly,
    etools-input.readonly,
    paper-dropdown-menu.readonly,
    etools-textarea.readonly {
      --paper-input-container-underline: {
        display: none !important;
      }
    }

    etools-checkable-input {
      --etools-checkable-input-label: {
        font-size: 16px;
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
      padding-left: 12px;
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
