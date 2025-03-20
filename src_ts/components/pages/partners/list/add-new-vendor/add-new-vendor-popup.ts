import {LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {template} from './add-new-vendor-popup.tpl';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {DataMixin} from '../../../../common/mixins/data-mixin';
import {get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {validateRequiredFields} from '@unicef-polymer/etools-modules-common/dist/utils/validation-helper';
import {activateVendor, getVendorByNumber} from '../../../../../redux/effects/tpm-partners.effects';
import {EtoolsInput} from '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import {parseRequestErrorsAndShowAsToastMsgs} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-error-parser';
import {getDifference} from '../../../../utils/objects-diff';
import {store} from '../../../../../redux/store';
import {updateTPMPartnerDetails} from '../../../../../redux/effects/tpm-partner-details.effects';
import {canEditField} from '../../../../utils/utils';

@customElement('add-new-vendor-popup')
export class AddNewVendorPopupComponent extends DataMixin()<IActivityTpmPartnerExtended>(LitElement) {
  @property() dialogOpened = true;
  @property() vendorRequestInProcess = false;
  @property() vendorLoaded = false;
  @property() vendorNumberMessage!: string;
  @property() emailValidationMessage!: string;
  @property() previousVendorNumberChecked = '';
  @property() savingInProcess = false;
  @property() permissions!: GenericObject;
  @property() canEditEmail!: boolean;
  @property() canEditPhone!: boolean;
  @query('#emailInput') private emailEl!: EtoolsInput;
  @query('#inputVendorNumber') private inputVendorEl!: EtoolsInput;

  static get styles(): CSSResultArray {
    return [SharedStyles, pageLayoutStyles, layoutStyles];
  }

  set dialogData(data: GenericObject) {
    if (!data) {
      return;
    }
    this.permissions = data.permissions;
    this.setPermissions(this.permissions);
  }

  render(): TemplateResult {
    return template.call(this);
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  setPermissions(permissions: GenericObject): void {
    this.canEditEmail = canEditField(permissions, 'email');
    this.canEditPhone = canEditField(permissions, 'phone_number');
  }

  onVendorNumberKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter' || this.editedData?.vendor_number?.length === 10) {
      this.validateVendorNumber();
    }
  }

  validateVendorNumber(): void {
    if (this.editedData.vendor_number) {
      const vendor_number = this.editedData.vendor_number;
      if (vendor_number === this.previousVendorNumberChecked) {
        // vendor number didn't changed from last validation
        return;
      }
      this.previousVendorNumberChecked = vendor_number;
      // reset validation, message, set loading
      this.vendorRequestInProcess = true;
      this.vendorLoaded = false;
      this.vendorNumberMessage = '';
      this.inputVendorEl.removeAttribute('invalid');

      this.editedData = Object.assign({}, {vendor_number: vendor_number});
      getVendorByNumber(vendor_number)
        .then((data: IActivityTpmPartnerExtended) => {
          this.data = data;
          this.vendorLoaded = true;
        })
        .catch((err: any) => {
          console.log(err);
          this.vendorNumberMessage = getTranslation('TPM.VENDOR_NUMBER_NOT_FOUND');
          this.inputVendorEl.setAttribute('invalid', 'true');
        })
        .then(() => (this.vendorRequestInProcess = false));
    }
  }

  getPartnerAddress(partner: any): string {
    if (!partner) {
      return '';
    }
    return [partner.street_address, partner.postal_code, partner.city, partner.country]
      .filter((info) => !!info)
      .join(', ');
  }

  processRequest(): void {
    if (!this.validate()) {
      return;
    }

    const data: Partial<IActivityTpmPartnerExtended> =
      this.originalData !== null
        ? getDifference<Partial<IActivityTpmPartnerExtended>>(this.originalData, this.editedData, {toRequest: true})
        : this.editedData;
    const hasChanges = Object.keys(data).length;

    this.savingInProcess = true;
    activateVendor(String(this.editedData.id))
      .then(() => {
        if (hasChanges) {
          this.updateTpmPartner(this.editedData.id!, data);
        } else {
          this.afterSave();
        }
      })
      .catch((err: any) => {
        parseRequestErrorsAndShowAsToastMsgs(err, this);
      })
      .then(() => (this.savingInProcess = false));
  }

  updateTpmPartner(id: number, data: Partial<IActivityTpmPartnerExtended>): void {
    store
      .dispatch<AsyncEffect>(updateTPMPartnerDetails(id, data))
      .then(() => {
        this.afterSave();
      })
      .catch((err: any) => {
        parseRequestErrorsAndShowAsToastMsgs(err, this);
      });
  }

  afterSave(): void {
    this.savingInProcess = false;
    this.dialogOpened = false;
    fireEvent(this, 'dialog-closed', {confirmed: true});
  }

  validate(): boolean {
    if (!this.editedData.id) {
      this.vendorNumberMessage = getTranslation('TPM.VENDOR_NUMBER_NOT_FOUND');
      this.inputVendorEl.setAttribute('invalid', 'true');
      return false;
    }
    let requiredValidation = validateRequiredFields(this);
    if (requiredValidation) {
      requiredValidation = this.checkEmailIsValid();
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

  resetError(field: string, el: any): void {
    el.removeAttribute('invalid');
    if (field === 'email') {
      this.emailValidationMessage = '';
    }
    if (field === 'vendor_number') {
      this.vendorNumberMessage = '';
    }
  }
}
