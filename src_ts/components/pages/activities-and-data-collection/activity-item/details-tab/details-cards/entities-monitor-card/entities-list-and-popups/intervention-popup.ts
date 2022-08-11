import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {InputStyles} from '../../../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../../../styles/dialog-styles';
import {fireEvent} from '../../../../../../../utils/fire-custom-event';
import {PartnersMixin} from '../../../../../../../common/mixins/partners-mixin';
import {simplifyValue} from '../../../../../../../utils/objects-diff';
import {elevationStyles} from '../../../../../../../styles/elevation-styles';
import {CardStyles} from '../../../../../../../styles/card-styles';
import {SharedStyles} from '../../../../../../../styles/shared-styles';
import {FlexLayoutClasses} from '../../../../../../../styles/flex-layout-classes';
import '@unicef-polymer/etools-dialog/etools-dialog.js';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import {debounce} from '../../../../../../../utils/debouncer';
import {getEndpoint} from '../../../../../../../../endpoints/endpoints';
import {request} from '../../../../../../../../endpoints/request';
import {EtoolsRouter} from '../../../../../../../../routing/routes';
import {repeat} from 'lit-html/directives/repeat';
import {translate} from 'lit-translate';
import {CP_OUTPUTS, INTERVENTIONS} from '../../../../../../../../endpoints/endpoints-list';

@customElement('intervention-popup')
export class InterventionPopup extends PartnersMixin(LitElement) {
  @property() dialogOpened = true;
  @property() selectedPartners: EtoolsPartner[] = [];
  @property() selectedCpOutputs: EtoolsCpOutput[] = [];
  @property() selectedIntervention?: EtoolsInterventionShort;

  @property() outputs: EtoolsCpOutputShort[] = [];
  @property() interventions: EtoolsInterventionShort[] = [];
  private queryParams: QueryParams = {};

  private loadingInterventions!: Callback;
  private loadingOutputs!: Callback;

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
        dialog-title="${translate('ACTIVITY_DETAILS.ADD_INTERVENTION')}"
        ?opened="${this.dialogOpened}"
        @confirm-btn-clicked="${() => this.addIntervention()}"
        @close="${this.onClose}"
      >
        <div class="container layout vertical">
          <div class="elevation card-container layout horizontal center filters" elevation="2">
            <div class="filter-name">FILTER</div>
            <div class="layout vertical flex-1">
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
          ${this.selectedIntervention
            ? html`
                <div class="layout vertical connected-entries">
                  <span class="connected-entries__title">${translate('ACTIVITY_DETAILS.CONNECTED_ENTRIES')}</span>
                  <div class="layout horizontal">
                    <div class="layout vertical flex-1 text-control">
                      <label>${translate('ACTIVITY_DETAILS.PARTNER_ORGANIZATION')}</label>
                      <div class="value">${this.getPartnerName(this.selectedIntervention.partner)}</div>
                    </div>
                    <div class="layout vertical flex-1 text-control">
                      <label>${translate('ACTIVITY_DETAILS.CP_OUTPUT')}</label>
                      ${repeat(
                        this.getOutputs(this.selectedIntervention.cp_outputs),
                        (output: EtoolsCpOutputShort) => html` <div class="value">${output.name}</div> `
                      )}
                    </div>
                  </div>
                </div>
              `
            : ''}
        </div>
      </etools-dialog>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.loadingInterventions = debounce((params: QueryParams) => {
      const {url}: IResultEndpoint = getEndpoint(INTERVENTIONS);
      this.queryParams = {...this.queryParams, ...params};
      const queryString: string = EtoolsRouter.encodeParams(this.queryParams);
      const endpoint: string = queryString ? `${url}&${queryString}` : url;
      request<EtoolsInterventionShort[]>(endpoint).then(
        (response: EtoolsInterventionShort[]) => (this.interventions = response)
      );
    }, 100);
    this.loadingOutputs = debounce((ids: number[] = []) => {
      const {url} = getEndpoint(CP_OUTPUTS);
      const queryString: string = EtoolsRouter.encodeParams({partners__in: ids});
      const endpoint: string = queryString ? `${url}&${queryString}` : url;
      request<EtoolsCpOutputShort[]>(endpoint).then((response: EtoolsCpOutputShort[]) => (this.outputs = response));
    }, 100);
    this.loadingInterventions();
    this.loadingOutputs();
  }

  selectPartners(partners: EtoolsPartner[]): void {
    if (JSON.stringify(this.selectedPartners) !== JSON.stringify(partners)) {
      this.selectedPartners = [...partners];
      const ids: number[] = simplifyValue(partners);
      this.loadingOutputs(ids);
      this.loadingInterventions({partners__in: ids});
    }
  }

  selectCpOutputs(cpOutputs: EtoolsCpOutput[]): void {
    if (JSON.stringify(this.selectedCpOutputs) !== JSON.stringify(cpOutputs)) {
      this.selectedCpOutputs = [...cpOutputs];
      const ids: number[] = simplifyValue(cpOutputs);
      this.loadingInterventions({cp_outputs__in: ids});
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
    fireEvent(this, 'response', {confirmed: false});
  }

  addIntervention(): void {
    fireEvent(this, 'response', {confirmed: true, response: this.selectedIntervention});
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

        .connected-entries {
          padding: 10px;
          background-color: var(--secondary-background-color);
        }
        .connected-entries__title {
          padding: 20px 14px 0;
          font-weight: bold;
        }
      `
    ];
  }
}
