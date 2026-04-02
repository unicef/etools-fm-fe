import {CSSResultArray, LitElement, TemplateResult, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {PartnersMixin} from '../../../../../../../common/mixins/partners-mixin';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import {request} from '../../../../../../../../endpoints/request';
import {getEndpoint} from '../../../../../../../../endpoints/endpoints';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {CP_OUTPUT_ACTIVITIES_WBS, CP_OUTPUTS} from '../../../../../../../../endpoints/endpoints-list';
import {simplifyValue} from '@unicef-polymer/etools-utils/dist/equality-comparisons.util';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {InputStyles} from '../../../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../../../styles/dialog-styles';
import {SharedStyles} from '../../../../../../../styles/shared-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {translate, get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {EtoolsInput} from '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import {validateRequiredFields} from '@unicef-polymer/etools-modules-common/dist/utils/validation-helper';
import SlSwitch from '@shoelace-style/shoelace/dist/components/switch/switch.js';

@customElement('key-intervention-popup')
export class PartnerPopup extends PartnersMixin(LitElement) {
  @property() dialogOpened = true;
  @property() workplanWBS: any[] = [];
  @property() selectedCpOutput?: EtoolsCpOutput;
  @property() cpOutputs: EtoolsCpOutput[] = [];
  @property() workplanWBSOptions: any[] = [];
  @property() excludeCPOutputIDs: number[] = [];
  @property() showExpired = false;
  @property() index = -1;
  @property() title = getTranslation('ACTIVITY_DETAILS.ADD_PROGRAMME_ACTIVITIES');
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

  set dialogData({eWPActivity, index, excludeCPOutputIDs}: any) {
    this.index = index;
    this.excludeCPOutputIDs = excludeCPOutputIDs || [];
    if (eWPActivity) {
      this.title = getTranslation('ACTIVITY_DETAILS.EDIT_PROGRAMME_ACTIVITIES');
      this.showExpired = true;
      if (eWPActivity.cp_output) {
        this.selectedCpOutput = eWPActivity.cp_output;
        this.getWorkplanWBSOptions(Number(this.selectedCpOutput?.id));
      }
      if (eWPActivity.activities) {
        this.workplanWBS = eWPActivity.activities;
      }
    }
    this.loadingCpOutputs();
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
        this.cpOutputs = (response || []).filter((x: EtoolsCpOutput) => !this.excludeCPOutputIDs.includes(x.id));
        if (!this.showExpired && this.selectedCpOutput) {
          // if only active displayed and have item already selected, check if exists in the options
          if (!this.cpOutputs.find((x) => x.id === this.selectedCpOutput!.id)) {
            this.selectedCpOutput = undefined;
          }
        }
      });
    }, 50);
  }

  addKeyIntervention(): void {
    if (validateRequiredFields(this)) {
      fireEvent(this, 'dialog-closed', {
        confirmed: true,
        response: {cp_output: this.selectedCpOutput, activities: this.workplanWBS, index: this.index}
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
      this.workplanWBS = [];
      this.workplanWBSOptions = [];
      this.requestUpdate();
      if (this.selectedCpOutput?.id) {
        this.getWorkplanWBSOptions(this.selectedCpOutput?.id);
      }
    }
  }

  getWorkplanWBSOptions(id: number): void {
    if (!(Number(id) > 0)) {
      return;
    }
    const {url}: IResultEndpoint = getEndpoint(CP_OUTPUT_ACTIVITIES_WBS);
    request(`${url}&cp_output=${id}`)
      .then((res: any) => {
        this.workplanWBSOptions = res || [];
        this.workplanWBSOptions.forEach((x: any) => (x.name = `${x.name} [${x.wbs}]`));
        this.requestUpdate();
      })
      .catch(() => {
        fireEvent(this, 'toast', {text: getTranslation('ERROR_LOAD_ACTIVITIES_LIST')});
      });
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
        dialog-title="${this.title}"
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
                required
                no-dynamic-align
              ></etools-dropdown>
            </div>
          </div>

          <div class="row">
            <div class="col-10 col-md-8 offset-1">
              <etools-dropdown-multi
                id="edmFacilityTypes"
                .selectedValues="${simplifyValue(this.workplanWBS)}"
                @etools-selected-items-changed="${({detail}: CustomEvent) =>
                  (this.workplanWBS = detail.selectedItems || [])}"
                class="w100"
                trigger-value-change-event
                label="${translate('ACTIVITY_DETAILS.WORKPLAN_WBS')}"
                .options="${this.workplanWBSOptions}"
                option-label="name"
                option-value="id"
                required
                allow-outside-scroll
                dynamic-align
              ></etools-dropdown-multi>
            </div>
          </div>      
      </etools-dialog>
    `;
  }
}
