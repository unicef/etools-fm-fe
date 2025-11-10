import {LitElement, TemplateResult, CSSResultArray, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {DialogStyles} from '../../../../../styles/dialog-styles';
import {repeat} from 'lit/directives/repeat.js';
import {applyDropdownTranslation} from '../../../../../utils/translation-helper';
import {FACILITY_TYPE_DURATION} from '../../../../../common/dropdown-options';

@customElement('assign-duration-popup')
export class AssignDurationComponent extends LitElement {
  @property({type: Array}) facility_types!: any[];
  @property() facilitTypeDurationOptions: DefaultDropdownOption<string>[] =
    applyDropdownTranslation(FACILITY_TYPE_DURATION);

  static get styles(): CSSResultArray {
    return [layoutStyles];
  }

  set dialogData(data: any) {
    this.facility_types = data.facility_types || [];
  }

  render(): TemplateResult {
    return html`
      ${DialogStyles}
      <style>
        .container {
          margin-bottom: 14px;
        }
        .facility-line {
          position: relative;
          display: flex;
          width: 100%;
          margin-bottom: 2px;
          align-items: center;
        }
        .facility-item {
          width: 280px;
          padding: 0 8px;
        }
        .duration-item {
          width: 280px;
        }
        .bold {
          font-weight: bold;
        }
      </style>
      <etools-dialog
        id="dialog"
        size="md"
        keep-dialog-open
        .okBtnText="${translate('MAIN.BUTTONS.SAVE')}"
        .cancelBtnText="${translate('CANCEL')}"
        dialog-title="${translate('ACTIVITY_DETAILS.ASSIGN_INFRASTRUCTURE_TYPE')}"
        @confirm-btn-clicked="${() => this.onSave()}"
        @close="${() => this.onClose()}"
      >
        <div class="container-dialog layout-vertical">
          <div class="facility-line">
            <div class="facility-item bold">${translate('ACTIVITY_DETAILS.TYPE_OF_FACILITY')}</div>
            <div class="duration-item bold">${translate('ACTIVITY_DETAILS.INFRASTRUCTURE_TYPE')}</div>
          </div>
          ${repeat(
            this.facility_types || [],
            (facility: any) => html`
              <div class="facility-line">
                <div class="facility-item">
                  <label>${facility.name}</label>
                </div>
                <div class="duration-item">
                  <etools-dropdown-multi
                    class="w100"
                    @etools-selected-items-changed="${({detail}: CustomEvent) =>
                      (facility.durations = (detail.selectedItems || []).map((x: any) => x.value))}"
                    .selectedValues="${facility.durations}"
                    .options="${this.facilitTypeDurationOptions}"
                    option-label="display_name"
                    option-value="value"
                  >
                  </etools-dropdown-multi>
                </div>
              </div>
            `
          )}
        </div>
      </etools-dialog>
    `;
  }

  onSave() {
    fireEvent(this, 'dialog-closed', {confirmed: true, response: this.facility_types});
  }
  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }
}
