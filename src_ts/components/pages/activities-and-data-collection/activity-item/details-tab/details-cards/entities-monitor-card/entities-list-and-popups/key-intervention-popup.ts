import {CSSResultArray, LitElement, TemplateResult, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit-html/directives/repeat.js';
import {PartnersMixin} from '../../../../../../../common/mixins/partners-mixin';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import {request} from '../../../../../../../../endpoints/request';
import {getEndpoint} from '../../../../../../../../endpoints/endpoints';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {CP_OUTPUTS} from '../../../../../../../../endpoints/endpoints-list';
import {simplifyValue} from '@unicef-polymer/etools-utils/dist/equality-comparisons.util';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {InputStyles} from '../../../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../../../styles/dialog-styles';
import {SharedStyles} from '../../../../../../../styles/shared-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {EtoolsInput} from '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import {validateRequiredFields} from '@unicef-polymer/etools-modules-common/dist/utils/validation-helper';
import SlSwitch from '@shoelace-style/shoelace/dist/components/switch/switch.js';

@customElement('key-intervention-popup')
export class PartnerPopup extends PartnersMixin(LitElement) {
  @property() dialogOpened = true;
  @property() workplanWBS: any[] = [''];
  @property() selectedCpOutput?: EtoolsCpOutput;
  @property() cpOutputs: EtoolsCpOutput[] = [];
  @property() showExpired = false;
  private loadingCpOutputs!: Callback;

  static get styles(): CSSResultArray {
    return [
      SharedStyles,
      layoutStyles,
      css`
        .format-label {
          margin-block-start: 12px;
          line-height: 16px;
        }
        .filter-result {
          padding: 24px 12px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pt-16 {
          padding-block-start: 16px;
        }
        .add-icon {
          --etools-icon-fill-color: var(--primary-color);
        }
        .remove-icon {
          --etools-icon-fill-color: var(--error-color);
        }
        .mb-16 {
          margin-block-end: 16px;
        }
      `
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.loadingCpOutputs = debounce(() => {
      const {url} = getEndpoint(CP_OUTPUTS);
      const queryString: string = EtoolsRouter.encodeQueryParams({});
      let endpoint: string = queryString ? `${url}&${queryString}` : url;
      if (!this.showExpired) {
        endpoint += '&active=true';
      }
      request<EtoolsCpOutput[]>(endpoint).then((response: EtoolsCpOutput[]) => {
        this.cpOutputs = response;
        if (!this.showExpired && this.selectedCpOutput) {
          // if only active displayed and have item already selected, check if exists in the options
          if (!this.cpOutputs.find((x) => x.id === this.selectedCpOutput!.id)) {
            this.selectedCpOutput = undefined;
          }
        }
      });
    }, 100);
    this.loadingCpOutputs();
  }

  addKeyIntervention(): void {
    if (validateRequiredFields(this)) {
      fireEvent(this, 'dialog-closed', {
        confirmed: true,
        response: {cp_output: this.selectedCpOutput, activities: this.workplanWBS}
      });
    }
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  validateWBS(el: any) {
    return (el.target as EtoolsInput).validate();
  }

  onShowExpiredChanged(e: CustomEvent): void {
    if (!e.target) {
      return;
    }

    this.showExpired = (e.target as SlSwitch).checked;
    this.loadingCpOutputs();
  }

  selectCpOutput(cpOutput: EtoolsCpOutput): void {
    if (this.selectedCpOutput !== cpOutput) {
      this.selectedCpOutput = cpOutput;
    }
  }

  addActivityWbs() {
    this.workplanWBS.push('');
    this.requestUpdate();
  }

  removeActivityWbs(index: number) {
    this.workplanWBS.splice(index, 1);
    this.requestUpdate();
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
          <div class="row mb-16">
            <div class="col-10 col-md-8 offset-1 filter-result">
              ${translate('ACTIVITY_DETAILS.CP_OUTPUTS_FOUND', {count: this.cpOutputs.length})}

              <sl-switch .checked="${this.showExpired}" @sl-change="${this.onShowExpiredChanged}">
                ${translate('ACTIVITY_DETAILS.SHOW_EXPIRED')}
              </sl-switch>
            </div>
            <div class="col-10 col-md-8 offset-1">
              <etools-dropdown
                label="${translate('ACTIVITY_DETAILS.CP_OUTPUT')}"
                .options="${this.cpOutputs}"
                option-label="name"
                option-value="id"
                .selected="${simplifyValue(this.selectedCpOutput)}"
                trigger-value-change-event
                @etools-selected-item-changed="${({detail}: CustomEvent) => this.selectCpOutput(detail.selectedItem)}"
                horizontal-align="left"
                no-dynamic-align
              ></etools-dropdown>
            </div>
          </div>

          ${repeat(
            this.workplanWBS || [],
            (_item: string, index: number) => html`
              <div class="row">
                <div class="col-10 col-md-8 offset-1">
                  <etools-input
                    class="activity-wbs-input"
                    label="${translate('ACTIVITY_DETAILS.WORKPLAN_WBS')}"
                    pattern="^(\\d{4})\\/([A-Z0-9]{2})\\/(\\d{2})\\/(\\d{3})\\/(\\d{3})\\/(\\d{3})\\/([A-Z0-9]{7})"
                    no-label-float
                    placeholder="____/__/__/___/___/___/______"
                    required
                    error-message="${translate('THIS_FIELD_IS_REQUIRED')}. ${translate(
                      'ACTIVITY_DETAILS.WRONG_FORMAT'
                    )}"
                    .value="${this.workplanWBS[index] || ''}"
                    @blur="${(e: Event) => this.validateWBS(e)}"
                    @value-changed="${({detail}: CustomEvent) => (this.workplanWBS[index] = detail && detail.value)}"
                  ></etools-input>
                </div>
                <div class="col-1 pt-16">
                  <etools-icon
                    ?hidden="${index != 0}"
                    name="add-circle"
                    class="add-icon"
                    @click="${this.addActivityWbs}"
                  ></etools-icon>
                  <etools-icon
                    ?hidden="${index === 0}"
                    class="remove-icon"
                    name="remove-circle"
                    @click="${(_e: any) => this.removeActivityWbs(index)}"
                  ></etools-icon>
                </div>
              </div>
            `
          )};
          <div class="row">
            <div class="col-10 col-md-8 offset-1">
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
