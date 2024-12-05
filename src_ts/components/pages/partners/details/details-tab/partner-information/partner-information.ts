import {LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {store} from '../../../../../../redux/store';
import {connect} from '@unicef-polymer/etools-utils/dist/pwa.utils';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../../../styles/card-styles';
import {template} from './partner-information.tpl';
import {DataMixin} from '../../../../../common/mixins/data-mixin';
import {getDifference} from '../../../../../utils/objects-diff';
import {GenericObject} from '@unicef-polymer/etools-types';
import {canEditField} from '../../../../../utils/utils';
import {updateTPMPartnerDetails} from '../../../../../../redux/effects/tpm-partner-details.effects';
import {parseRequestErrorsAndShowAsToastMsgs} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-error-parser';
import {get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {EtoolsInput} from '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import {
  resetRequiredFields,
  validateRequiredFields
} from '@unicef-polymer/etools-modules-common/dist/utils/validation-helper';

@customElement('partner-information')
export class PartnerInformation extends connect(store)(DataMixin()<IActivityTpmPartnerExtended>(LitElement)) {
  @property() errors: GenericObject = {};
  @property() isReadonly = true;
  @property() savingInProcess = false;
  @property() canEditEmail = false;
  @property() canEditPhone = false;
  @property() canEditAtLeastOneField = false;
  @property({type: String}) emailValidationMessage!: string;
  @query('#emailInput') private emailEl!: EtoolsInput;
  permissions!: GenericObject;

  static get styles(): CSSResultArray {
    return [SharedStyles, pageLayoutStyles, layoutStyles, CardStyles];
  }

  render(): TemplateResult {
    return template.call(this);
  }

  stateChanged(state: IRootState): void {
    if (state.tpmPartnerDetails) {
      if (
        state.tpmPartnerDetails.data &&
        JSON.stringify(this.editedData) !== JSON.stringify(state.tpmPartnerDetails.data)
      ) {
        this.data = state.tpmPartnerDetails.data;
      }
      if (
        state.tpmPartnerDetails.permissions &&
        JSON.stringify(this.permissions) !== JSON.stringify(state.tpmPartnerDetails.permissions)
      ) {
        this.permissions = state.tpmPartnerDetails.permissions;
        this.setPermissions(this.permissions);
      }
      if (
        state.tpmPartnerDetails.error &&
        JSON.stringify(this.errors) !== JSON.stringify(state.tpmPartnerDetails.error)
      ) {
        this.errors = state.tpmPartnerDetails.error ? state.tpmPartnerDetails.error : {};
        this.showErrorMessage();
      }
    }
  }

  setPermissions(permissions: GenericObject): void {
    this.canEditEmail = canEditField(permissions, 'email');
    this.canEditPhone = canEditField(permissions, 'phone_number');
    this.canEditAtLeastOneField = this.canEditEmail || this.canEditPhone;
  }

  save(): void {
    this.processRequest();
  }

  cancel(): void {
    this.editedData = JSON.parse(JSON.stringify(this.originalData));
    this.emailValidationMessage = '';
    resetRequiredFields(this);
    this.emailEl.removeAttribute('invalid');
    this.isReadonly = true;
  }

  startEdit(): void {
    this.originalData = JSON.parse(JSON.stringify(this.editedData));
    this.isReadonly = false;
  }

  processRequest(): void {
    if (!this.validate()) {
      return;
    }
    this.errors = {};
    const data: Partial<IActivityTpmPartnerExtended> =
      this.originalData !== null
        ? getDifference<Partial<IActivityTpmPartnerExtended>>(this.originalData, this.editedData, {toRequest: true})
        : this.editedData;
    const hasChanges = Object.keys(data).length;

    if (hasChanges) {
      this.savingInProcess = true;
      store.dispatch<AsyncEffect>(updateTPMPartnerDetails(this.editedData.id!, data)).then(() => {
        this.savingInProcess = false;
        this.isReadonly = true;
      });
    } else {
      this.cancel();
    }
  }

  showErrorMessage(): void {
    parseRequestErrorsAndShowAsToastMsgs(this.errors, this);
  }

  validate(): boolean {
    const requiredValidation = validateRequiredFields(this);
    if (requiredValidation) {
      return this.checkEmailIsValid();
    }
    return requiredValidation;
  }

  checkEmailIsValid(): boolean {
    this.emailEl.removeAttribute('invalid');
    const value = this.emailEl.value;
    const required = this.emailEl.required;

    /* eslint-disable max-len */
    var re =
      /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    /* eslint-enable max-len */

    if ((required && !value) || (value && !re.test(value as string))) {
      this.emailValidationMessage = getTranslation('TPM_DETAILS.VALID_EMAIL_REQUIRED');
      this.emailEl.setAttribute('invalid', 'true');
      return false;
    }
    return true;
  }

  getPartnerAddress(partner: any): string {
    if (!partner) {
      return '';
    }
    return [partner.street_address, partner.postal_code, partner.city, partner.country]
      .filter((info) => !!info)
      .join(', ');
  }
}
