import {html, TemplateResult} from 'lit-element';
import {translate} from '../../../../../localization/localisation';
import {hasPermission, Permissions} from '../../../../../config/permissions';
import {SitesPopupComponent} from './sites-popup';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';

export function template(this: SitesPopupComponent): TemplateResult {
  return html`
    ${InputStyles} ${DialogStyles}
    <etools-dialog
      size="md"
      id="dialog"
      no-padding
      .opened="${this.dialogOpened}"
      dialog-title="${translate(this.editedData.id ? 'SITES.EDIT_SL' : 'SITES.ADD_SL')}"
      keep-dialog-open
      @confirm-btn-clicked="${() => this.saveSite()}"
      @close="${this.onClose}"
      @iron-overlay-opened="${() => this.mapInitialization()}"
      .okBtnText="${translate(this.editedData.id ? 'MAIN.BUTTONS.SAVE' : 'MAIN.BUTTONS.ADD')}"
    >
      <etools-loading ?active="${this.savingInProcess}" loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}">
      </etools-loading>

      <div class="container">
        <div class="layout horizontal">
          <paper-input
            class="validate-input disabled-as-readonly flex-7"
            .value="${this.editedData.name}"
            @value-changed="${({detail}: CustomEvent) => this.updateModelValue('name', detail.value)}"
            maxlength="100"
            label="${translate('SITES.LABELS.NAME')}"
            placeholder="${!hasPermission(Permissions.EDIT_SITES)
              ? translate('MAIN.EMPTY_FIELD')
              : translate('SITES.PLACEHOLDERS.NAME')}"
            ?invalid="${this.errors && this.errors.name}"
            .errorMessage="${this.errors && this.errors.name}"
            @focus="${() => this.resetFieldError('name')}"
            @tap="${() => this.resetFieldError('name')}"
          ></paper-input>

          <etools-dropdown
            id="statusDropdown"
            class="validate-input disabled-as-readonly flex-2"
            .selected="${this.setStatusValue((this.editedData && this.editedData.is_active) || false)}"
            @etools-selected-item-changed="${({detail}: CustomEvent) =>
              this.updateModelValue('is_active', detail.selectedItem.value)}"
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
            @tap="${() => this.resetFieldError('is_active')}"
            allow-outside-scroll
            dynamic-align
          ></etools-dropdown>
        </div>

        ${this.editedData.id
          ? html`
              <paper-input
                class="disabled-as-readonly"
                .value="${this.editedData && this.editedData.parent!.name}"
                label="${translate('SITES.LABELS.ADMIN_LOCATION')}"
                placeholder="${translate('SITES.PLACEHOLDERS.ADMIN_LOCATION')}"
                disabled
                readonly
              ></paper-input>
            `
          : ''}

        <div class="map" id="map"></div>

        <div ?hidden="${!this.currentCoords}" class="current-coords">
          ${translate('SITES.SELECTED_SITE')}: ${this.currentCoords}
        </div>
      </div>
    </etools-dialog>
  `;
}
