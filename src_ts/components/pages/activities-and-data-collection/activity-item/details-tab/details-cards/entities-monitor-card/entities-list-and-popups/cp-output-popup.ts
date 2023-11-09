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
import {FlexLayoutClasses} from '../../../../../../../styles/flex-layout-classes';
import {elevationStyles} from '../../../../../../../styles/elevation-styles';
import {CardStyles} from '../../../../../../../styles/card-styles';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {translate} from 'lit-translate';
import {CP_OUTPUTS} from '../../../../../../../../endpoints/endpoints-list';

@customElement('cp-output-popup')
export class CpOutputPopup extends PartnersMixin(LitElement) {
  @property() dialogOpened = true;
  @property() selectedCpOutput?: EtoolsCpOutput;
  @property() cpOutputs: EtoolsCpOutput[] = [];
  @property() selectedPartners: EtoolsPartner[] = [];

  private loadingCpOutputs!: Callback;

  connectedCallback(): void {
    super.connectedCallback();
    this.loadingCpOutputs = debounce((ids: number[] = []) => {
      const {url} = getEndpoint(CP_OUTPUTS);
      const queryString: string = EtoolsRouter.encodeQueryParams({partners__in: ids});
      const endpoint: string = queryString ? `${url}&${queryString}` : url;
      request<EtoolsCpOutput[]>(endpoint).then((response: EtoolsCpOutput[]) => (this.cpOutputs = response));
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

  // language=HTML
  render(): TemplateResult {
    return html`
      ${InputStyles} ${DialogStyles}
      <etools-dialog
        id="dialog"
        size="md"
        no-padding
        keep-dialog-open
        .okBtnText="${translate('MAIN.BUTTONS.ADD')}"
        .cancelBtnText="${translate('CANCEL')}"
        dialog-title="${translate('ACTIVITY_DETAILS.ADD_CP_OUTPUT')}"
        ?opened="${this.dialogOpened}"
        @confirm-btn-clicked="${() => this.addCpOutput()}"
        @close="${this.onClose}"
      >
        <div class="container layout vertical">
          <div class="elevation card-container layout horizontal center filters" elevation="2">
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
      FlexLayoutClasses,
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
        }
        .filter-name:after {
          content: '';
          position: absolute;
          top: -10px;
          bottom: -10px;
          right: 15px;
          border-right: 1px solid var(--dark-divider-color);
        }
      `
    ];
  }
}
