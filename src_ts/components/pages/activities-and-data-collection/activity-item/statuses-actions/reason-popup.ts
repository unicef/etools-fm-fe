import {CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {SharedStyles} from '../../../../styles/shared-styles';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';
import '@polymer/paper-input/paper-textarea';
import {translate} from 'lit-translate';

@customElement('reason-popup')
export class ChecklistAttachments extends LitElement {
  @property() protected dialogOpened: boolean = true;
  @property() protected popupTitle: string | Callback = '';
  @property() protected label: string | Callback = '';
  @property() protected reason: string = '';
  @property() protected error: string = '';

  set dialogData({popupTitle, label}: ReasonPopupData) {
    this.popupTitle = popupTitle;
    this.label = label;
  }

  render(): TemplateResult | void {
    return html`
      ${InputStyles} ${DialogStyles}

      <etools-dialog
        id="dialog"
        size="md"
        no-padding
        keep-dialog-open
        ?opened="${this.dialogOpened}"
        .okBtnText="${translate('MAIN.BUTTONS.CONFIRM')}"
        dialog-title="${translate(this.popupTitle as string)}"
        @close="${this.onClose}"
        @confirm-btn-clicked="${() => this.confirmReason()}"
      >
        <div class="container">
          <paper-textarea
            id="details-input"
            .value="${this.reason}"
            max-rows="3"
            required
            label="${translate(this.label as string)}"
            placeholder="${translate('MAIN.ENTER') + ` ${this.label}`}"
            @value-changed="${({detail}: CustomEvent) => (this.reason = detail.value)}"
            @focus="${() => (this.error = '')}"
            ?invalid="${Boolean(this.error)}"
            error-message="${this.error}"
          ></paper-textarea>
        </div>
      </etools-dialog>
    `;
  }

  onClose(): void {
    fireEvent(this, 'response', {confirmed: false});
  }

  confirmReason(): void {
    if (!this.reason.trim()) {
      this.error = 'Field is required';
      return;
    }
    fireEvent(this, 'response', {confirmed: true, response: {comment: this.reason}});
  }

  static get styles(): CSSResultArray {
    return [SharedStyles];
  }
}
