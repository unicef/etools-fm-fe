import {CSSResultArray, LitElement, PropertyValues, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {SharedStyles} from '../../../../styles/shared-styles';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import {get, translate} from 'lit-translate';
import {CardStyles} from '../../../../styles/card-styles';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';

@customElement('reason-popup')
export class ChecklistAttachments extends LitElement {
  @property() protected dialogOpened = true;
  @property() protected popupTitle: string | Callback = '';
  @property() protected label: string | Callback = '';
  @property() protected reason = '';
  @property() protected error = '';

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
        keep-dialog-open
        ?opened="${this.dialogOpened}"
        .okBtnText="${translate('MAIN.BUTTONS.CONFIRM')}"
        .cancelBtnText="${translate('CANCEL')}"
        dialog-title="${translate(this.popupTitle as string)}"
        @close="${this.onClose}"
        @confirm-btn-clicked="${() => this.confirmReason()}"
      >
        <div class="container">
          <etools-textarea
            id="details-input"
            .value="${this.reason}"
            required
            label="${translate(this.label as string)}"
            placeholder="${get('MAIN.ENTER') + ` ${get(this.label as string)}`}"
            @value-changed="${({detail}: CustomEvent) => (this.reason = detail.value)}"
            @focus="${() => (this.error = '')}"
            ?invalid="${Boolean(this.error)}"
            error-message="${this.error}"
            max-rows="3"
          ></etools-textarea>
        </div>
      </etools-dialog>
    `;
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  confirmReason(): void {
    if (!this.reason.trim()) {
      this.error = 'Field is required';
      return;
    }
    fireEvent(this, 'dialog-closed', {confirmed: true, response: {comment: this.reason}});
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, CardStyles];
  }
}
