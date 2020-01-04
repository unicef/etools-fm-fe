import {html, TemplateResult} from 'lit-element';
// language=HTML
export const InputStyles: TemplateResult = html`
  <style>
    paper-icon-button[hidden] {
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
    paper-dropdown-menu,
    paper-textarea,
    paper-input,
    datepicker-lite {
      padding: 0 12px;
      color: var(--gray-mid);
      box-sizing: border-box;

      --paper-input-container-input: {
        display: block !important;
        font-size: 15px;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 3px;
      }

      --paper-input-prefix: {
        margin-right: 10px;
        color: var(--gray-mid);
      }

      --paper-input-error: {
        overflow: hidden;
      }
    }

    paper-textarea {
      --paper-input-container-input: {
        white-space: normal;
      }
      --paper-input-container-focus-color: var(--module-primary);
      --iron-autogrow-textarea-placeholder: {
        color: var(--gray-20) !important;
      }
      --iron-autogrow-textarea: {
        padding: 0;
      }
    }

    etools-dropdown,
    etools-dropdown-multi,
    paper-input,
    paper-textarea,
    paper-dropdown-menu,
    etools-currency-amount-input,
    datepicker-lite {
      outline: none !important;
      --esmm-placeholder-color: var(--gray-20);
      --esmm-multi-placeholder-color: var(--gray-20);
      --paper-input-container-color: var(--gray-20);
      --paper-input-container-focus-color: var(--module-primary);
      --paper-input-container-input: {
        color: var(--gray-dark);
      }
      --paper-input-container-label: {
        color: var(--gray-50);
      }

      --paper-input-container-invalid-color: var(--module-error);

      --paper-input-container-disabled: {
        color: var(--gray-light);
        opacity: 1;
      }
      --paper-input-char-counter: {
        color: var(--gray-light);
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
      --paper-input-container-underline: {
        border-color: rgba(0, 0, 0, 0.2) !important;
      }
    }

    etools-dropdown.no-data-fetched,
    etools-dropdown-multi.no-data-fetched,
    paper-input.no-data-fetched {
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

    etools-dropdown-multi[readonly]:not(.datepicker),
    etools-dropdown-multi[disabled].disabled-as-readonly,
    etools-dropdown[readonly]:not(.datepicker),
    etools-dropdown[disabled].disabled-as-readonly,
    paper-textarea[readonly]:not(.datepicker),
    paper-textarea[disabled].disabled-as-readonly,
    paper-dropdown-menu[readonly]:not(.datepicker),
    paper-dropdown-menu[disabled].disabled-as-readonly,
    paper-input[readonly]:not(.datepicker),
    paper-input[disabled].disabled-as-readonly. datepicker-lite[readonly],
    datepicker-lite[disabled].disabled-as-readonly {
      --paper-input-container: {
        opacity: 1 !important;
      }
      --paper-input-container-underline: {
        border-bottom: 1px dashed rgba(0, 0, 0, 0.2) !important;
        border-color: rgba(0, 0, 0, 0.2) !important;
        display: block !important;
      }
      --paper-input-container-underline-focus: {
        display: none;
      }
    }

    etools-dropdown-multi[disabled].without-border,
    etools-dropdown[disabled].without-border,
    paper-textarea[disabled].without-border,
    paper-input[disabled].without-border,
    datepicker-lite[disabled].without-border {
      --paper-input-container-label: {
        color: var(--gray-50) !important;
      }
      --esmm-placeholder-color: rgba(0, 0, 0, 0.16) !important;
      --esmm-multi-placeholder-color: rgba(0, 0, 0, 0.16) !important;
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
      --iron-autogrow-textarea-placeholder: {
        color: var(--gray-mid-dark) !important;
      }
      --paper-input-container-color: var(--gray-mid-dark);
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
    paper-textarea.required:not([disabled]),
    paper-textarea[required]:not([disabled]),
    paper-textarea[required].readonly-required,
    paper-input.required:not([disabled]),
    paper-input[required].readonly-required,
    paper-input[required]:not([disabled]) {
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
    paper-input.bold {
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
    paper-input.deleted {
      --paper-input-container-input: {
        color: #b0b0b0;
      }
    }

    etools-currency-amount-input[disabled].disabled-as-readonly {
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
    paper-input.readonly,
    paper-dropdown-menu.readonly,
    paper-textarea.readonly {
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

    etools-content-panel:not([list]) {
      --ecp-content: {
        padding: 8px 12px;
        padding-left: 12px;
      }
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
