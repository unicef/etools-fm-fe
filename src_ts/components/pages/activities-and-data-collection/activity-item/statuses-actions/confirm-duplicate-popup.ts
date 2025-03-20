import {CSSResultArray, LitElement, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {SharedStyles} from '../../../../styles/shared-styles';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';
import '@unicef-polymer/etools-unicef/src/etools-checkbox/etools-checkbox';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {CardStyles} from '../../../../styles/card-styles';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';

@customElement('confirm-duplicate-popup')
export class ConfirmDuplicatePopup extends LitElement {
  @property() protected dialogOpened = true;
  @property() protected showChecklist = false;
  @property() protected withChecklist = false;

  set dialogData({showChecklist}: ConfirmDuplicatePopupData) {
    this.showChecklist = showChecklist;
  }

  render(): TemplateResult | void {
    return html`
      ${InputStyles} ${DialogStyles}
      <style>
        .d-block {
          display: block;
        }
        p {
          margin: 32px 8px;
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
        @confirm-btn-clicked="${() => this.confirmSubmit()}"
      >
        <div class="container-dialog">
          ${translate('CONFIRM_DUPLICATE_ACTIVITY')}
          ${this.showChecklist
            ? html`
                <p>
                  <etools-checkbox class="checkbox" @sl-change="${(e: any) => (this.withChecklist = e.target.checked)}">
                    ${translate('DUPLICATE_CHECKLIST')}
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
    fireEvent(this, 'dialog-closed', {confirmed: true, withChecklist: this.withChecklist});
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, CardStyles];
  }
}
