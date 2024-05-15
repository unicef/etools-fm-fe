import {css, LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {InputStyles} from '../../../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../../../styles/dialog-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {PartnersMixin} from '../../../../../../../common/mixins/partners-mixin';
import {simplifyValue} from '../../../../../../../utils/objects-diff';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {CardStyles} from '../../../../../../../styles/card-styles';
import {SharedStyles} from '../../../../../../../styles/shared-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown-multi';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {getEndpoint} from '../../../../../../../../endpoints/endpoints';
import {request} from '../../../../../../../../endpoints/request';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {repeat} from 'lit/directives/repeat.js';
import {translate, get as getTranslation} from 'lit-translate';
import {CP_OUTPUTS, INTERVENTIONS} from '../../../../../../../../endpoints/endpoints-list';
import {filterPDStatuses} from '../../../../../../../../config/app-constants';

@customElement('intervention-popup')
export class InterventionPopup extends PartnersMixin(LitElement) {
  @property() dialogOpened = true;
  @property() selectedPartners: EtoolsPartner[] = [];
  @property() selectedCpOutputs: EtoolsCpOutput[] = [];
  @property() selectedPdStatuses: IOption[] = [];
  @property() selectedIntervention?: EtoolsInterventionShort;

  @property() outputs: EtoolsCpOutputShort[] = [];
  @property() pdStatuses: IOption[] = [];
  @property() interventions: EtoolsInterventionShort[] = [];
  @property() loadingInterventions = false;
  @property() loadingOutputs = false;
  private queryParams: QueryParams = {};

  private loadInterventions!: Callback;
  private loadOutputs!: Callback;

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
        dialog-title="${translate('ACTIVITY_DETAILS.ADD_INTERVENTION')}"
        ?opened="${this.dialogOpened}"
        @confirm-btn-clicked="${() => this.addIntervention()}"
        ?show-spinner="${this.loadingInterventions || this.loadingOutputs}"
        spinner-text=${translate('MAIN.LOADING_DATA_IN_PROCESS')}
        @close="${this.onClose}"
      >
        <div class="container-dialog">
          <div class="elevation card-container layout-horizontal align-items-center filters" elevation="2">
            <div class="filter-name"><span>${translate('MAIN.FILTER')}<span></div>
            <div class="row w-100">
              <div class="col-12">
                <etools-dropdown-multi
                  label="${translate('ACTIVITY_DETAILS.PARTNER_ORGANIZATION')}"
                  .options="${this.partners}"
                  option-label="name"
                  option-value="id"
                  .selectedValues="${simplifyValue(this.selectedPartners)}"
                  trigger-value-change-event
                  @etools-selected-items-changed="${({detail}: CustomEvent) =>
                    this.selectPartners(detail.selectedItems)}"
                  horizontal-align="left"
                  no-dynamic-align
                ></etools-dropdown-multi>
              </div>
              <div class="col-12">
                <etools-dropdown-multi
                  label="${translate('ACTIVITY_DETAILS.CP_OUTPUT')}"
                  .options="${this.outputs}"
                  option-label="name"
                  option-value="id"
                  .selectedValues="${simplifyValue(this.selectedCpOutputs)}"
                  trigger-value-change-event
                  @etools-selected-items-changed="${({detail}: CustomEvent) =>
                    this.selectCpOutputs(detail.selectedItems)}"
                  horizontal-align="left"
                  no-dynamic-align
                ></etools-dropdown-multi>
              </div>
              <div class="col-12">
                <etools-dropdown-multi
                  label="${translate('ACTIVITY_DETAILS.PD_STATUS')}"
                  .options="${this.pdStatuses}"
                  option-label="name"
                  option-value="id"
                  .selectedValues="${simplifyValue(this.selectedPdStatuses)}"
                  trigger-value-change-event
                  @etools-selected-items-changed="${({detail}: CustomEvent) =>
                    this.selectPdStatus(detail.selectedItems)}"
                  horizontal-align="left"
                  no-dynamic-align
                ></etools-dropdown-multi>
              </div>    
            </div>
          </div>
          <div class="filter-result">
            ${translate('ACTIVITY_DETAILS.INTERVENTIONS_FOUND', {count: this.interventions.length})}
          </div>
          <etools-dropdown
            label="${translate('ACTIVITY_DETAILS.INTERVENTIONS')}"
            .options="${this.interventions}"
            option-label="title"
            option-value="id"
            .selected="${simplifyValue(this.selectedIntervention)}"
            trigger-value-change-event
            @etools-selected-item-changed="${({detail}: CustomEvent) => this.selectIntervention(detail.selectedItem)}"
            horizontal-align="left"
            no-dynamic-align
          ></etools-dropdown>
          ${
            this.selectedIntervention
              ? html`
                  <div class="row connected-entries">
                    <div class="col-12">
                      <span class="connected-entries__title">${translate('ACTIVITY_DETAILS.CONNECTED_ENTRIES')}</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6 text-control">
                      <label>${translate('ACTIVITY_DETAILS.PARTNER_ORGANIZATION')}</label>
                      <div class="value">${this.getPartnerName(this.selectedIntervention.partner)}</div>
                    </div>
                    <div class="col-6 text-control">
                      <label>${translate('ACTIVITY_DETAILS.CP_OUTPUT')}</label>
                      ${repeat(
                        this.getOutputs(this.selectedIntervention.cp_outputs),
                        (output: EtoolsCpOutputShort) => html` <div class="value">${output.name}</div> `
                      )}
                    </div>
                  </div>
                `
              : ''
          }
        </div>
      </etools-dialog>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.loadInterventions = debounce((params: QueryParams) => {
      this.loadingInterventions = true;
      const {url}: IResultEndpoint = getEndpoint(INTERVENTIONS);
      this.queryParams = {...this.queryParams, ...params};
      const queryString: string = EtoolsRouter.encodeQueryParams(this.queryParams);
      const endpoint: string = queryString ? `${url}&${queryString}` : url;
      request<EtoolsInterventionShort[]>(endpoint)
        .then((response: EtoolsInterventionShort[]) => (this.interventions = response))
        .finally(() => (this.loadingInterventions = false));
    }, 100);
    this.loadOutputs = debounce((ids: number[] = []) => {
      this.loadingOutputs = true;
      const {url} = getEndpoint(CP_OUTPUTS);
      const queryString: string = EtoolsRouter.encodeQueryParams({partners__in: ids});
      const endpoint: string = queryString ? `${url}&${queryString}` : url;
      request<EtoolsCpOutputShort[]>(endpoint)
        .then((response: EtoolsCpOutputShort[]) => (this.outputs = response))
        .finally(() => (this.loadingOutputs = false));
    }, 100);
    this.setPDStatuses();
    // set by default PD Active status filter checked
    this.selectPdStatus(this.pdStatuses.filter((x) => x.id === 'active'));
    this.loadOutputs();
  }

  setPDStatuses() {
    this.pdStatuses = [...filterPDStatuses];
    this.pdStatuses.forEach((x) => (x.name = getTranslation(`PD_STATUS.${String(x.id).toUpperCase()}`)));
  }

  selectPartners(partners: EtoolsPartner[]): void {
    if (JSON.stringify(this.selectedPartners) !== JSON.stringify(partners)) {
      this.selectedPartners = [...partners];
      const ids: number[] = simplifyValue(partners);
      this.loadOutputs(ids);
      this.loadInterventions({partners__in: ids});
    }
  }

  selectCpOutputs(cpOutputs: EtoolsCpOutput[]): void {
    if (JSON.stringify(this.selectedCpOutputs) !== JSON.stringify(cpOutputs)) {
      this.selectedCpOutputs = [...cpOutputs];
      const ids: number[] = simplifyValue(cpOutputs);
      this.loadInterventions({cp_outputs__in: ids});
    }
  }

  selectPdStatus(pdStatuses: IOption[]): void {
    if (JSON.stringify(this.selectedPdStatuses) !== JSON.stringify(pdStatuses)) {
      this.selectedPdStatuses = [...pdStatuses];
      const ids: number[] = simplifyValue(pdStatuses);
      this.loadInterventions({status__in: ids});
    }
  }

  selectIntervention(intervention: EtoolsInterventionShort): void {
    if (this.selectedIntervention !== intervention) {
      this.selectedIntervention = intervention;
    }
  }

  getPartnerName(id: number): string {
    const partner: EtoolsPartner | undefined = this.partners.find((partner: EtoolsPartner) => partner.id === id);
    return partner ? partner.name : '';
  }

  getOutputs(ids: number[] = []): EtoolsCpOutputShort[] {
    return ids.reduce<EtoolsCpOutputShort[]>((outputs: EtoolsCpOutputShort[], id: number) => {
      for (const output of this.outputs) {
        if (output.id === id) {
          return [...outputs, output];
        }
      }
      return outputs;
    }, []);
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  addIntervention(): void {
    fireEvent(this, 'dialog-closed', {confirmed: true, response: this.selectedIntervention});
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
          margin: 15px 0px;
          position: relative;
          align-self: stretch;
          display: flex;
          justify-content: center;
          flex-direction: column;
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

        .connected-entries {
          padding: 10px;
          background-color: var(--secondary-background-color);
        }
        .connected-entries__title {
          padding: 20px 14px 0;
          font-weight: bold;
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
