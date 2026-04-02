import {CSSResultArray, LitElement, TemplateResult, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import {InputStyles} from '../../../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../../../styles/dialog-styles';
import {SharedStyles} from '../../../../../../../styles/shared-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {EtoolsInput} from '@unicef-polymer/etools-unicef/src/etools-input/etools-input';

@customElement('gpd-popup')
export class PartnerPopup extends LitElement {
  @property() dialogOpened = true;
  @property() refNumber = '';

  static get styles(): CSSResultArray {
    return [
      SharedStyles,
      layoutStyles,
      css`
        .format-label {
          margin-block-start: 12px;
          line-height: 16px;
        }
      `
    ];
  }

  addRefNumber(): void {
    if (this.validateRefNumber()) {
      fireEvent(this, 'dialog-closed', {confirmed: true, response: this.refNumber});
    }
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  validateRefNumber() {
    const elem = this.shadowRoot?.querySelector<EtoolsInput>('#txtRefNumber')!;
    return elem.validate();
  }

  // language=HTML
  render(): TemplateResult {
    return html`
      ${InputStyles} ${DialogStyles}
      <etools-dialog
        id="dialog"
        size="lg"
        keep-dialog-open
        .okBtnText="${translate('MAIN.BUTTONS.ADD')}"
        .cancelBtnText="${translate('CANCEL')}"
        dialog-title="${translate('ACTIVITY_DETAILS.ADD_GPD')}"
        ?opened="${this.dialogOpened}"
        @confirm-btn-clicked="${() => this.addRefNumber()}"
        @close="${this.onClose}"
      >
        <div class="container-dialog">
          <div class="row">
            <div class="col-10 col-md-8 offset-1">
              <etools-input
                id="txtRefNumber"
                label="${translate('ACTIVITY_DETAILS.REFERENCE_NUMBER')}"
                pattern="^\\d{2}/\\d{6}"
                no-label-float
                placeholder="__/______"
                required
                error-message="${translate('THIS_FIELD_IS_REQUIRED')}. ${translate('ACTIVITY_DETAILS.WRONG_FORMAT')}"
                .value="${this.refNumber || ''}"
                @blur="${() => this.validateRefNumber()}"
                @value-changed="${({detail}: CustomEvent) => (this.refNumber = detail && detail.value)}"
              ></etools-input>
              <div class="format-label">
                <label>${translate('ACTIVITY_DETAILS.REF_NUMBER_EXPECTED_FORMAT')} </label>
              </div>
            </div>
          </div>
        </div>
      </etools-dialog>
    `;
  }
}
