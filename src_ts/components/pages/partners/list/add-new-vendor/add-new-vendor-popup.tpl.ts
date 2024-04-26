import {AddNewVendorPopupComponent} from './add-new-vendor-popup';
import {html, TemplateResult} from 'lit';
import {translate} from 'lit-translate';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';
import {isRequired} from '../../../../utils/utils';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import {CardStyles} from '../../../../styles/card-styles';

export function template(this: AddNewVendorPopupComponent): TemplateResult {
  // language=HTML
  return html`
    ${InputStyles} ${DialogStyles}
    <style>
      ${CardStyles} .po-loading {
        position: absolute;
        top: 25px;
        left: auto;
        background-color: #fff;
      }
      .po-loading:not([active]) {
        display: none !important;
      }
      .p-relative {
        position: relative !important;
      }
      .row {
        min-height: 75px;
      }
    </style>

    <etools-dialog
      size="md"
      keep-dialog-open
      ?opened="${this.dialogOpened}"
      dialog-title="${translate('TPM.ADD_NEW_VENDOR')}"
      @confirm-btn-clicked="${() => this.processRequest()}"
      @close="${this.onClose}"
      .okBtnText="${translate('MAIN.BUTTONS.ADD')}"
      .cancelBtnText="${translate('CANCEL')}"
      ?disableConfirmBtn="${this.vendorRequestInProcess}"
      ?disableDismissBtn="${this.vendorRequestInProcess}"
      ?show-spinner="${this.savingInProcess}"
    >
      <div class="container-dialog row">
        <div class="col-data col-md-6 col-12">
          <etools-input
            id="inputVendorNumber"
            always-float-label
            .value="${this.editedData && this.editedData.vendor_number}"
            maxlength="30"
            label="${translate('TPM_DETAILS.VENDOR_NUMBER')}"
            @value-changed="${({detail}: CustomEvent) => this.updateModelValue('vendor_number', detail.value)}"
            ?required="${isRequired(this.permissions, 'vendor_number')}"
            ?readonly="${this.vendorRequestInProcess}"
            @blur="${this.validateVendorNumber}"
            @keyup="${this.onVendorNumberKeyUp}"
            error-message=${this.vendorNumberMessage}
            @click="${() => this.resetError('vendor_number', this)}"
          ></etools-input>
          <etools-loading .active="${this.vendorRequestInProcess}" no-overlay loading-text="" class="po-loading">
          </etools-loading>
        </div>
        <div class="col-data col-md-6 col-12">
          <etools-input
            always-float-label
            .value="${this.editedData && this.editedData.name}"
            label="${translate('TPM_DETAILS.TPM_NAME')}"
            disabled
            readonly
          ></etools-input>
        </div>

        <div class="col-data col-12">
          <etools-input
            always-float-label
            .value="${this.getPartnerAddress(this.editedData)}"
            label="${translate('TPM_DETAILS.ADDRESS')}"
            disabled
            readonly
          ></etools-input>
        </div>

        <div class="col-data col-md-6 col-12">
          <etools-input
            id="phoneInput"
            always-float-label
            .value="${this.editedData && this.editedData.phone_number}"
            label="${translate('TPM_DETAILS.PHONE_NUMBER')}"
            allowed-pattern="[\\d\\s-+()]"
            maxlength="20"
            @value-changed="${({detail}: CustomEvent) => this.updateModelValue('phone_number', detail.value)}"
            ?readonly="${!this.vendorLoaded || !this.canEditPhone || this.vendorRequestInProcess}"
            @click="${() => this.resetError('', this)}"
            ?required="${isRequired(this.permissions, 'phone_number')}"
          >
            <etools-icon slot="prefix" name="communication:phone"> </etools-icon>
          </etools-input>
        </div>
        <div class="col-data col-md-6 col-12">
          <etools-input
            id="emailInput"
            always-float-label
            type="email"
            .value="${this.editedData && this.editedData.email}"
            label="${translate('TPM_DETAILS.EMAIL')}"
            @value-changed="${({detail}: CustomEvent) => this.updateModelValue('email', detail.value)}"
            ?readonly="${!this.vendorLoaded || !this.canEditEmail || this.vendorRequestInProcess}"
            error-message=${this.emailValidationMessage}
            @click="${() => this.resetError('email', this)}"
            ?required="${isRequired(this.permissions, 'email')}"
          >
            <etools-icon slot="prefix" name="communication:email"> </etools-icon>
          </etools-input>
        </div>
      </div>
    </etools-dialog>
  `;
}
