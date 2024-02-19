/* eslint-disable max-len */
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-collapse/etools-collapse';
import {html, TemplateResult} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {CpDetailsItem} from './cp-details-item';
import {InputStyles} from '../../../../styles/input-styles';
import {translate} from 'lit-translate';

export function template(this: CpDetailsItem): TemplateResult {
  return html`
    ${InputStyles}
    <div class="full-report-container">
      <div class="cp-indicators">
        <div class="line row title">
          <div class="col-10">${translate('CO_OVERVIEW.CP_INDICATORS')}</div>
          <div class="target col-2">${translate('CO_OVERVIEW.TARGET')}</div>
        </div>

        ${this.fullReport && this.fullReport.ram_indicators && this.fullReport.ram_indicators.length
          ? this.fullReport.ram_indicators.map(
              (item: RamIndicator) =>
                html`
                  <div class="line ram-indicator row">
                    <div class="col-md-10 col-12">${item.name}</div>
                    <div class="target col-md-2 col-12">${item.target}</div>
                  </div>
                `
            )
          : html`
              <div class="line row empty">
                <div class="col-md-10 col-12">--</div>
                <div class="target col-md-2 col-12">--</div>
              </div>
            `}
      </div>

      <div class="partners">
        <div class="row">
          <div class="col-md-4 align-items-center line title">${translate('CO_OVERVIEW.PARTNERS')}</div>
          <div class="col-md-1 prog-visits-width align-items-center line title">
            ${translate('CO_OVERVIEW.PROG_VISITS')}
          </div>
          <div class="col-md-4 align-items-center line title">${translate('CO_OVERVIEW.PARTNERSHIPS')}</div>
          <div class="col-md-2 center-align days-since-last-visit line title">
            ${translate('CO_OVERVIEW.SINCE_LAST_VISIT')}
          </div>
          <div class="col-md-2 interact-icons"></div>
        </div>

        ${this.fullReport && this.fullReport.partners && this.fullReport.partners.length
          ? repeat(
              this.fullReport.partners,
              (partner: FullReportPartner) => partner.id,
              (partner: FullReportPartner) => html`
                <div class="partner row">
                  <div class="col-md-4 col-12 truncate line intervention-data" title="${partner.name}">
                    ${partner.name}
                  </div>
                  <div class="prog-visits col-md-1 col-12 prog-visits-width line partners-data">
                    ${partner.prog_visit_mr}
                  </div>
                  <div class="col-md-7 col-12 intervention-data no-pl">
                    ${partner.interventions && partner.interventions.length
                      ? repeat(
                          partner.interventions,
                          (intervention: FullReportIntervention) => intervention.pk,
                          (intervention: FullReportIntervention) => html`
                            <div class="row">
                              <div
                                class="col-md-8 col-12 truncate line layout-horizontal"
                                title="${intervention.number}"
                              >
                                <div class="space-for-arrow layout-horizontal center-align">
                                  <etools-icon
                                    name="${!this.detailsOpened[intervention.pk] ? 'expand-more' : 'expand-less'}"
                                    @click="${() => this.toggleDetails(intervention)}"
                                  ></etools-icon>
                                </div>
                                ${intervention.number}
                              </div>
                              <div class="col-md-2 col-2 center-align days-since-last-visit line">
                                ${intervention.days_from_last_pv}
                              </div>
                              <div
                                class="col-md-2 col-8 interact-icons layout-horizontal links"
                                ?hidden="${!this.isUnicefUser}"
                              >
                                <a href="${`/pmp/interventions/${intervention.pk}/attachments`}" target="_blank">
                                  <etools-icon name="folder" class="grey"></etools-icon>
                                </a>
                                <a
                                  href="${`/apd/action-points/list?cp_output=${this.cpItem.id}&intervention=${intervention.pk}`}"
                                  target="_blank"
                                >
                                  <etools-icon name="flag" class="grey"></etools-icon>
                                </a>
                                <a href="${`/pmp/interventions/${intervention.pk}/progress/reports`}" target="_blank">
                                  <etools-icon name="trending-up" class="grey"></etools-icon>
                                </a>
                              </div>
                            </div>

                            <etools-collapse ?opened="${this.detailsOpened[intervention.pk]}">
                              <div class="intervention-details">
                                <div class="line title">
                                  ${translate('CO_OVERVIEW.PD_OUTPUT')}/${translate('CO_OVERVIEW.SPD_EXPECTED_RESULT')}
                                </div>
                                ${intervention.pd_output_names && intervention.pd_output_names.length
                                  ? repeat(
                                      intervention.pd_output_names,
                                      (pd_output: string) => html`<div class="line">${pd_output}</div>`
                                    )
                                  : ''}
                              </div>
                            </etools-collapse>
                          `
                        )
                      : html`
                          <div class="row" ?hidden="${!partner.interventions || !partner.interventions.length}">
                            <div class="col-md-4 space-for-arrow center-align"></div>
                            <div class="col-md-1 truncate line">--</div>
                            <div class="col-md-6 center-align days-since-last-visit line">--</div>
                            <div class="col-md-1 interact-icons links"></div>
                          </div>
                        `}
                  </div>
                </div>
              `
            )
          : html`
              <div class="partner row">
                <div class="col-md-4 truncate line intervention-data">--</div>
                <div class="prog-visits col-md-1 prog-visits-width line partners-data">--</div>

                <div class="col-md-7 intervention-data">
                  <div class="row">
                    <div class="space-for-arrow layout-horizontal center-align"></div>
                    <div class="col-md-7 truncate line">--</div>
                    <div class="col-md-2 center-align days-since-last-visit line">--</div>
                    <div class="col-md-2 interact-icons layout-horizontal links"></div>
                  </div>
                </div>
              </div>
            `}
      </div>
    </div>
  `;
}
