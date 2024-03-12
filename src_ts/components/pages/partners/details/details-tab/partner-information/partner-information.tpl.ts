import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import {html, TemplateResult} from 'lit';
import {translate} from 'lit-translate';
import {InputStyles} from '../../../../../styles/input-styles';
import {PartnerInformation} from './partner-information';
import '../../../../../common/layout/etools-card';
import {getMaxLength, isRequired} from '../../../../../utils/utils';
import {FormBuilderCardStyles} from '@unicef-polymer/etools-form-builder/dist/lib/styles/form-builder-card.styles';

export function template(this: PartnerInformation): TemplateResult {
  return html`
    ${InputStyles}
    <style>
      etools-input {
        width: 100%;
      }
      .card-content {
        padding-bottom: 20px;
      }
      .row {
        min-height: 75px;
      }
      etools-input[readonly].without-border {
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
       ${FormBuilderCardStyles}
    </style>

    <etools-card
      class="elevation page-content card-container"
      elevation="1"
      card-title="${translate('TPM_DETAILS.TPM_PARTNER_DETAILS')}"
      ?is-editable="${this.canEditAtLeastOneField}"
      ?edit="${!this.isReadonly}"
      @start-edit="${() => this.startEdit()}"
      @save="${() => this.save()}"
      @cancel="${() => this.cancel()}"
    >
      <div slot="content" class="card-content">
        <etools-loading
          ?active="${this.savingInProcess}"
          loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
        ></etools-loading>
        <div class="layout horizontal row">
          <div class="col-data flex-4">
            <etools-input
              class="without-border"
              .value="${this.editedData && this.editedData.vendor_number}"
              label="${translate('TPM_DETAILS.VENDOR_NUMBER')}"
              disabled
              readonly
            ></etools-input>
          </div>
          <div class="col-data flex-8">
            <etools-input
              class="without-border"
              .value="${this.getPartnerAddress(this.editedData)}"
              label="${translate('TPM_DETAILS.ADDRESS')}"
              disabled
              readonly
            ></etools-input>
          </div>
        </div>
        <div class="layout horizontal row">
          <div class="col-data flex-4">
            <etools-input
              class="without-border"
              .value="${this.editedData && this.editedData.name}"
              label="${translate('TPM_DETAILS.TPM_NAME')}"
              disabled
              readonly
            ></etools-input>
          </div>
          <div class="col-data flex-4">
            <etools-input
              id="emailInput"
              always-float-label
              type="email"
              .value="${this.editedData && this.editedData.email}"
              label="${translate('TPM_DETAILS.EMAIL')}"
              ?readonly="${this.isReadonly || !this.canEditEmail}"
              ?required="${isRequired(this.permissions, 'email')}"
              maxlength="${getMaxLength(this.permissions, 'email')}"
              @value-changed="${({detail}: CustomEvent) => this.updateModelValue('email', detail.value)}"
              error-message=${this.emailValidationMessage}
            >
              <etools-icon slot="prefix" name="communication:email"> </etools-icon>
            </etools-input>
          </div>
          <div class="col-data flex-4">
            <etools-input
              id="phoneInput"
              always-float-label
              .value="${this.editedData && this.editedData.phone_number}"
              label="${translate('TPM_DETAILS.PHONE_NUMBER')}"
              allowed-pattern="[\\d\\s-+()]"
              ?readonly="${this.isReadonly || !this.canEditPhone}"
              ?required="${isRequired(this.permissions, 'phone_number')}"
              maxlength="${getMaxLength(this.permissions, 'phone_number')}"
              @value-changed="${({detail}: CustomEvent) => this.updateModelValue('phone_number', detail.value)}"
            >
              <etools-icon slot="prefix" name="communication:phone"> </etools-icon>
            </etools-input>
          </div>
        </div>
      </div>
    </etools-card>
  `;
}
