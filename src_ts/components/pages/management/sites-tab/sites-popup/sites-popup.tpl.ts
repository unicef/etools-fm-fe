import {html, TemplateResult} from 'lit';
import {hasPermission, Permissions} from '../../../../../config/permissions';
import {SitesPopupComponent} from './sites-popup';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';

export function template(this: SitesPopupComponent): TemplateResult {
  return html`
    ${InputStyles} ${DialogStyles}
    <etools-dialog
      size="md"
      id="dialog"
      .opened="${this.dialogOpened}"
      dialog-title="${translate(this.editedData.id ? 'SITES.EDIT_SL' : 'SITES.ADD_SL')}"
      keep-dialog-open
      @confirm-btn-clicked="${() => this.saveSite()}"
      @close="${this.onClose}"
      @etools-dialog-opened="${() => this.mapInitialization()}"
      ?show-spinner="${this.savingInProcess}"
      .spinnerText="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
      .okBtnText="${translate(this.editedData.id ? 'MAIN.BUTTONS.SAVE' : 'MAIN.BUTTONS.ADD')}"
      .cancelBtnText="${translate('CANCEL')}"
    >
      <div class="container-dialog">
        <div class="row">
          <etools-input
            class="validate-input col-md-9 col-12"
            .value="${this.editedData.name}"
            @value-changed="${({detail}: CustomEvent) => this.updateModelValue('name', detail.value)}"
            maxlength="100"
            label="${translate('SITES.LABELS.NAME')}"
            placeholder="${!hasPermission(Permissions.EDIT_SITES)
              ? translate('MAIN.EMPTY_FIELD')
              : translate('SITES.PLACEHOLDERS.NAME')}"
            ?invalid="${this.errors && this.errors.name}"
            .errorMessage="${(this.errors && this.errors.name) || translate('THIS_FIELD_IS_REQUIRED')}"
            @focus="${() => {
              this.autoValidateName = true;
              this.resetFieldError('name');
            }}"
            @click="${() => this.resetFieldError('name')}"
            .autoValidate="${this.autoValidateName}"
            required
          ></etools-input>

          <etools-dropdown
            id="statusDropdown"
            class="validate-input col-md-3 col-12"
            .selected="${this.setStatusValue(!!this.editedData?.is_active)}"
            @etools-selected-item-changed="${({detail}: CustomEvent) => {
              this.updateModelValue('is_active', detail.selectedItem?.value);
            }}"
            trigger-value-change-event
            label="${translate('SITES.LABELS.STATUS')}"
            placeholder="${!hasPermission(Permissions.EDIT_SITES)
              ? translate('MAIN.EMPTY_FIELD')
              : translate('SITES.PLACEHOLDERS.STATUS')}"
            .options="${this.statusOptions}"
            option-label="display_name"
            option-value="id"
            ?invalid="${this.errors && this.errors.is_active}"
            .errorMessage="${this.errors && this.errors.is_active}"
            @focus="${() => this.resetFieldError('is_active')}"
            @click="${() => this.resetFieldError('is_active')}"
            allow-outside-scroll
            dynamic-align
          ></etools-dropdown>

          ${this.editedData.id
            ? html`
                <etools-input
                  class="col-12"
                  .value="${this.editedData && this.editedData.parent!.name}"
                  label="${translate('SITES.LABELS.ADMIN_LOCATION')}"
                  placeholder="${translate('SITES.PLACEHOLDERS.ADMIN_LOCATION')}"
                  disabled
                  readonly
                ></etools-input>
              `
            : ''}

          <div class="map col-12" id="map"></div>

          <label class="selected-sites-label col-md-2 col-12"> ${translate('SITES.SELECTED_SITE')}: </label>
          <etools-input
            class="validate-input col-md-5 col-12"
            .value="${this.latitude}"
            @value-changed="${({detail}: CustomEvent) => this.updateLatLng(detail && detail.value, 'latitude')}"
            label="${translate('MAIN.LATITUDE')}"
            placeholder="-"
          ></etools-input>
          <etools-input
            class="validate-input col-md-5 col-12"
            .value="${this.longitude}"
            @value-changed="${({detail}: CustomEvent) => this.updateLatLng(detail && detail.value, 'longitude')}"
            label="${translate('MAIN.LONGITUDE')}"
            placeholder="-"
          ></etools-input>
        </div>
      </div>
    </etools-dialog>
  `;
}
