import {html, TemplateResult} from 'lit';

// language=HTML
export const DialogStyles: TemplateResult = html`
  <style>
    etools-dialog etools-loading {
      font-size: 14px;
    }

    etools-dialog[no-padding]::part(ed-scrollable) {
      padding-top: 0 !important;
    }

    etools-dialog::part(ed-scrollable) {
      margin-top: 0;
      padding-top: 12px !important;
    }
    etools-dialog:not(.remove)::part(header) {
      background: var(--etools-dialog-primary-color, var(--primary-color));
    }
    etools-dialog:not(.remove)::part(close-button) {
      color: var(--primary-background-color);
    }
    etools-dialog.remove::part(header-actions) {
      background-color: var(--primary-background-color);
    }

    etools-dialog::part(ed-button-styles) {
      margin-top: 0;
    }

    etools-dialog::part(ed-title) {
      padding: 8px 45px 8px 24px;
    }

    etools-dialog {
      --etools-dialog-primary-color: var(--module-primary);
      --etools-dialog-content: {
        min-height: 80px;
        padding-bottom: 8px !important;
        padding-top: 8px !important;
      }
    }

    etools-dialog > etools-loading {
      margin-bottom: -56px;
    }

    etools-content-panel::part(ecp-header-title) {
      font-weight: 500;
      line-height: 48px;
      padding: 0 30px;
    }

    etools-content-panel::part(ecp-toggle-btn) {
      position: absolute;
      top: 3px;
      left: 13px;
      width: 45px;
      height: 45px;
    }

    etools-content-panel {
      position: relative;
    }

    etools-dialog .container {
      padding: 14px;
    }

    etools-dialog .content {
      padding: 0 14px;
    }

    etools-dialog {
      --etools-dialog-confirmation-content: {
        min-height: 0;
        margin-top: 0;
        margin-right: 0;
      }

      --etools-dialog-content: {
        width: 100%;
        max-width: 100% !important;

        overflow-x: hidden;
        overflow-y: auto;
        display: block;
        margin-top: 0;
      }
    }
  </style>
`;
