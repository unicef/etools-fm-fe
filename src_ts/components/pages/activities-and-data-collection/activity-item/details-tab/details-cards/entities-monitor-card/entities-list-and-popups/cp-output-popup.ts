import {css, LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {InputStyles} from '../../../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../../../styles/dialog-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {simplifyValue} from '../../../../../../../utils/objects-diff';
import {PartnersMixin} from '../../../../../../../common/mixins/partners-mixin';
import {request} from '../../../../../../../../endpoints/request';
import {getEndpoint} from '../../../../../../../../endpoints/endpoints';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {SharedStyles} from '../../../../../../../styles/shared-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {CardStyles} from '../../../../../../../styles/card-styles';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {translate} from 'lit-translate';
import {CP_OUTPUTS} from '../../../../../../../../endpoints/endpoints-list';
import SlSwitch from '@shoelace-style/shoelace/dist/components/switch/switch.js';

@customElement('cp-output-popup')
export class CpOutputPopup extends PartnersMixin(LitElement) {
  @property() dialogOpened = true;
  @property() selectedCpOutput?: EtoolsCpOutput;
  @property() cpOutputs: EtoolsCpOutput[] = [];
  @property() selectedPartners: EtoolsPartner[] = [];
  @property() showExpired = false;

  private loadingCpOutputs!: Callback;

  connectedCallback(): void {
    super.connectedCallback();
    this.loadingCpOutputs = debounce((ids: number[] = []) => {
      const {url} = getEndpoint(CP_OUTPUTS);
      const queryString: string = EtoolsRouter.encodeQueryParams({partners__in: ids});
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

  addCpOutput(): void {
    fireEvent(this, 'dialog-closed', {confirmed: true, response: this.selectedCpOutput});
  }

  selectPartners(partners: EtoolsPartner[]): void {
    if (JSON.stringify(this.selectedPartners) !== JSON.stringify(partners)) {
      this.selectedPartners = [...partners];
      const ids: number[] = simplifyValue(partners);
      this.loadingCpOutputs(ids);
    }
  }

  selectCpOutput(cpOutput: EtoolsCpOutput): void {
    if (this.selectedCpOutput !== cpOutput) {
      this.selectedCpOutput = cpOutput;
    }
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  onShowExpiredChanged(e: CustomEvent): void {
    if (!e.target) {
      return;
    }

    this.showExpired = (e.target as SlSwitch).checked;
    this.loadingCpOutputs();
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
        dialog-title="${translate('ACTIVITY_DETAILS.ADD_CP_OUTPUT')}"
        ?opened="${this.dialogOpened}"
        @confirm-btn-clicked="${() => this.addCpOutput()}"
        @close="${this.onClose}"
      >
        <div class="container-dialog">
          <div class="elevation card-container layout-horizontal align-items-center filters" elevation="2">
            <div class="filter-name">${translate('MAIN.FILTER')}</div>
            <etools-dropdown-multi
              label="${translate('ACTIVITY_DETAILS.PARTNER_ORGANIZATION')}"
              .options="${this.partners}"
              option-label="name"
              option-value="id"
              .selectedValues="${simplifyValue(this.selectedPartners)}"
              trigger-value-change-event
              @etools-selected-items-changed="${({detail}: CustomEvent) => this.selectPartners(detail.selectedItems)}"
              horizontal-align="left"
              no-dynamic-align
            ></etools-dropdown-multi>
          </div>
          <div class="filter-result">
            ${translate('ACTIVITY_DETAILS.CP_OUTPUTS_FOUND', {count: this.cpOutputs.length})}

            <sl-switch .checked="${this.showExpired}" @sl-change="${this.onShowExpiredChanged}">
              ${translate('ACTIVITY_DETAILS.SHOW_EXPIRED')}
            </sl-switch>
          </div>

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
      </etools-dialog>
    `;
  }
  static get styles(): CSSResultArray {
    // language=CSS
    return [
      elevationStyles,
      CardStyles,
      SharedStyles,
      layoutStyles,
      css`
        .filters {
          padding: 8px 12px;
          position: initial;
        }
        .filter-name {
          padding: 0 30px 0 15px;
          position: relative;
        }
        .filter-result {
          padding: 24px 12px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .filter-name:after {
          content: '';
          position: absolute;
          top: -10px;
          bottom: -10px;
          right: 15px;
          border-right: 1px solid var(--dark-divider-color);
        }
        @media (max-width: 576px) {
          .filters {
            flex-direction: column !important;
          }
          .filter-name:after {
            border-right: none;
          }
        }
      `
    ];
  }
}
