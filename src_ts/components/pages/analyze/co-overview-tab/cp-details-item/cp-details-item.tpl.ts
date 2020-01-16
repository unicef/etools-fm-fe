import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import {html, TemplateResult} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import {CpDetailsItem} from './cp-details-item';
import {InputStyles} from '../../../../styles/input-styles';
import {translate} from 'lit-translate';

export function template(this: CpDetailsItem): TemplateResult {
  return html`
    ${InputStyles}
    <div class="full-report-container">
      <div class="cp-indicators">
        <div class="line layout horizontal title">
          <div class="flex-auto">${translate('CO_OVERVIEW.CP_INDICATORS')}</div>
          <div class="target flex-none">${translate('CO_OVERVIEW.TARGET')}</div>
        </div>

        ${this.fullReport && this.fullReport.ram_indicators && this.fullReport.ram_indicators.length
          ? this.fullReport.ram_indicators.map(
              (item: RamIndicator) =>
                html`
                  <div class="line ram-indicator layout horizontal">
                    <div class="flex-auto">${item.name}</div>
                    <div class="target flex-none">${item.target}</div>
                  </div>
                `
            )
          : html`
              <div class="line layout horizontal empty">
                <div class="flex-auto">--</div>
                <div class="target flex-none">--</div>
              </div>
            `}
      </div>

      <div class="partners">
        <div class="layout horizontal">
          <div class="flex-2 layout horizontal partners-data">
            <div class="flex-auto layout horizontal center line title">${translate('CO_OVERVIEW.PARTNERS')}</div>
            <div class="flex-none prog-visits-width layout horizontal center line title">
              ${translate('CO_OVERVIEW.PROG_VISITS')}
            </div>
          </div>
          <div class="flex-4 layout horizontal">
            <div class="flex-none space-for-arrow"></div>
            <div class="flex-auto layout horizontal center line title">${translate('CO_OVERVIEW.PARTNERSHIPS')}</div>
            <div class="flex-none layout horizontal center-center days-since-last-visit line title">
              ${translate('CO_OVERVIEW.SINCE_LAST_VISIT')}
            </div>
            <div class="flex-none interact-icons"></div>
          </div>
        </div>

        ${this.fullReport && this.fullReport.partners && this.fullReport.partners.length
          ? repeat(
              this.fullReport.partners,
              (partner: FullReportPartner) => partner.id,
              (partner: FullReportPartner) => html`
                <div class="partner layout horizontal">
                  <div class="flex-2 layout horizontal partners-data">
                    <div class="flex-auto truncate line" title="${partner.name}">${partner.name}</div>
                    <div class="prog-visits flex-none prog-visits-width line">${partner.prog_visit_mr}</div>
                  </div>
                  <div class="flex-4 intervention-data">
                    ${partner.interventions && partner.interventions.length
                      ? repeat(
                          partner.interventions,
                          (intervention: FullReportIntervention) => intervention.pk,
                          (intervention: FullReportIntervention) => html`
                            <div class="layout horizontal">
                              <div class="flex-none space-for-arrow layout horizontal center-center">
                                <iron-icon
                                  icon="${!this.detailsOpened[intervention.pk] ? 'expand-more' : 'expand-less'}"
                                  @tap="${() => this.toggleDetails(intervention)}"
                                ></iron-icon>
                              </div>
                              <div class="flex-auto truncate line" title="${intervention.number}">
                                ${intervention.number}
                              </div>
                              <div class="flex-none layout horizontal center-center days-since-last-visit line">
                                ${intervention.days_from_last_pv}
                              </div>
                              <div class="flex-none interact-icons layout horizontal links">
                                <a href="${`/pmp/interventions/${intervention.pk}/attachments`}" target="_blank">
                                  <iron-icon icon="folder" class="grey"></iron-icon>
                                </a>
                                <a
                                  href="${`/apd/action-points/list?cp_output=${this.cpItem.id}&intervention=${intervention.pk}`}"
                                  target="_blank"
                                >
                                  <iron-icon icon="flag" class="grey"></iron-icon>
                                </a>
                                <a href="${`/pmp/interventions/${intervention.pk}/progress`}" target="_blank">
                                  <iron-icon icon="trending-up" class="grey"></iron-icon>
                                </a>
                              </div>
                            </div>

                            <iron-collapse ?opened="${this.detailsOpened[intervention.pk]}">
                              <div class="intervention-details">
                                <div class="line title">
                                  ${translate('CO_OVERVIEW.PD_OUTPUT')}/${translate('CO_OVERVIEW.SSFA_EXPECTED_RESULT')}
                                </div>
                                <div class="line">
                                  <!-- TODO: when the data appears, paste here -->
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                                  dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                                  mollit anim id est laborum.
                                </div>
                              </div>
                            </iron-collapse>
                          `
                        )
                      : html`
                          <div
                            class="layout horizontal"
                            ?hidden="${!partner.interventions || !partner.interventions.length}"
                          >
                            <div class="flex-none space-for-arrow layout horizontal center-center"></div>
                            <div class="flex-auto truncate line">--</div>
                            <div class="flex-none layout horizontal center-center days-since-last-visit line">--</div>
                            <div class="flex-none interact-icons layout horizontal links"></div>
                          </div>
                        `}
                  </div>
                </div>
              `
            )
          : html`
              <div class="partner layout horizontal">
                <div class="flex-2 layout horizontal partners-data">
                  <div class="flex-auto truncate line">--</div>
                  <div class="prog-visits flex-none prog-visits-width line">--</div>
                </div>
                <div class="flex-4 intervention-data">
                  <div class="layout horizontal">
                    <div class="flex-none space-for-arrow layout horizontal center-center"></div>
                    <div class="flex-auto truncate line">--</div>
                    <div class="flex-none layout horizontal center-center days-since-last-visit line">--</div>
                    <div class="flex-none interact-icons layout horizontal links"></div>
                  </div>
                </div>
              </div>
            `}
      </div>
    </div>
  `;
}
