import {CSSResultArray, LitElement, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {SharedStyles} from '../../../../styles/shared-styles';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';
import '@unicef-polymer/etools-unicef/src/etools-checkbox/etools-checkbox';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import {translate} from 'lit-translate';
import {CardStyles} from '../../../../styles/card-styles';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';

@customElement('confirm-submit-popup')
export class ConfirmSubmitPopup extends LitElement {
  @property() protected dialogOpened = true;
  @property() protected confirmText = '';
  @property() protected disableConfirmBtn = false;
  @property() protected actionPointReminder = '';

  set dialogData({confirmText, actionPointReminder}: ConfirmSubmitPopupData) {
    this.confirmText = confirmText;
    this.actionPointReminder = actionPointReminder;
    this.disableConfirmBtn = !!actionPointReminder;
  }

  render(): TemplateResult | void {
    return html`
      ${InputStyles} ${DialogStyles}
      <style>
        .d-block {
          display: block;
        }
        p {
          margin-block-end: 8px;
        }
      </style>
      <etools-dialog
        id="dialog"
        size="md"
        keep-dialog-open
        theme="confirmation"
        ?opened="${this.dialogOpened}"
        .okBtnText="${translate('CONTINUE')}"
        .cancelBtnText="${translate('CANCEL')}"
        @close="${this.onClose}"
        ?disable-confirm-btn="${this.disableConfirmBtn}"
        @confirm-btn-clicked="${() => this.confirmSubmit()}"
      >
        <div class="container-dialog">
          ${this.confirmText ? html`<p><span>${this.confirmText}</span></p>` : ``}
          ${this.actionPointReminder
            ? html`
                <p>
                  <span class="d-block">${this.actionPointReminder}</span>
                  <etools-checkbox
                    class="checkbox"
                    @sl-change="${(e: any) => this.onActionPointConfirm(e.target.checked as boolean)}"
                  >
                    ${translate('NO_ACTION_POINT')}
                  </etools-checkbox>
                </p>
              `
            : ``}
        </div>
      </etools-dialog>
    `;
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  confirmSubmit(): void {
    fireEvent(this, 'dialog-closed', {confirmed: true});
  }

  onActionPointConfirm(confirm: boolean) {
    this.disableConfirmBtn = !confirm;
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, CardStyles];
  }
}
