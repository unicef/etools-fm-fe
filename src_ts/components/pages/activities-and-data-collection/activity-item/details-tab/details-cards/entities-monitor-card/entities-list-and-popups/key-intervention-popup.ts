import {CSSResultArray, LitElement, TemplateResult, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {PartnersMixin} from '../../../../../../../common/mixins/partners-mixin';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import {InputStyles} from '../../../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../../../styles/dialog-styles';
import {SharedStyles} from '../../../../../../../styles/shared-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {EtoolsInput} from '@unicef-polymer/etools-unicef/src/etools-input/etools-input';

@customElement('key-intervention-popup')
export class PartnerPopup extends PartnersMixin(LitElement) {
  @property() dialogOpened = true;
  @property() workplanWBS = '';

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

  addKeyIntervention(): void {
    if (this.validateWBS()) {
      fireEvent(this, 'dialog-closed', {confirmed: true, response: this.workplanWBS});
    }
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  validateWBS() {
    const elem = this.shadowRoot?.querySelector<EtoolsInput>('#txtWorkplanWBS')!;
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
        dialog-title="${translate('ACTIVITY_DETAILS.ADD_KEY_INTERVENTIONS')}"
        ?opened="${this.dialogOpened}"
        @confirm-btn-clicked="${() => this.addKeyIntervention()}"
        @close="${this.onClose}"
      >
        <div class="container-dialog">
          <div class="row">
            <div class="col-10 col-md-8 offset-1">
              <etools-input
                id="txtWorkplanWBS"
                label="${translate('ACTIVITY_DETAILS.WORKPLAN_WBS')}"
                pattern="^(\\d{4})\\/([A-Z0-9]{2})\\/(\\d{2})\\/(\\d{3})\\/(\\d{3})\\/(\\d{3})\\/([A-Z0-9]{7})"
                no-label-float
                placeholder="____/__/__/___/___/___/______"
                required
                error-message="${translate('THIS_FIELD_IS_REQUIRED')}. ${translate('ACTIVITY_DETAILS.WRONG_FORMAT')}"
                .value="${this.workplanWBS || ''}"
                @blur="${() => this.validateWBS()}"
                @value-changed="${({detail}: CustomEvent) => (this.workplanWBS = detail && detail.value)}"
              ></etools-input>
              <div class="format-label">
                <label>${translate('ACTIVITY_DETAILS.WORKPLAN_WBS_EXPECTED_FORMAT')} </label>
              </div>
            </div>
          </div>
        </div>
      </etools-dialog>
    `;
  }
}
