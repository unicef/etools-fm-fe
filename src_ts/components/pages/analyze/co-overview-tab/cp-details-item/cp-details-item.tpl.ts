import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import {html, TemplateResult} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import {CpDetailsItem} from './cp-details-item';
import {InputStyles} from '../../../../styles/input-styles';

// TODO: !!! import { translate } from '../../../../localization/localisation';
// TODO: add translations!

export function template(this: CpDetailsItem): TemplateResult {
  return html`
    ${InputStyles}
    <div class="full-report-container">
      <div class="cp-indicators">
        <div class="line layout horizontal title">
          <div class="flex-auto">CP Indicators</div>
          <div class="target w210px flex-none">Target</div>
        </div>

        ${this.fullReport && this.fullReport.ram_indicators && this.fullReport.ram_indicators.length
          ? this.fullReport.ram_indicators.map(
              (item: any, index: number) =>
                html`
                  <div class="line layout horizontal ${this.getBackground(index)}">
                    <div class="flex-auto">${item.name}</div>
                    <div class="target w210px flex-none">${item.target}</div>
                  </div>
                `
            )
          : html`
              <div class="line layout horizontal empty">
                <div class="flex-auto">--</div>
                <div class="target w210px flex-none">--</div>
              </div>
            `}
      </div>

      <div class="partners">
        <div class="layout horizontal">
          <div class="flex-2 layout horizontal partners-data">
            <div class="flex-auto layout horizontal center line title">Partners</div>
            <div class="flex-none w65px layout horizontal center line title">M.R. Prog. <br />Visits</div>
          </div>
          <div class="flex-4 layout horizontal">
            <div class="flex-none w45px"></div>
            <div class="flex-auto layout horizontal center line title">Partnerships</div>
            <div class="flex-none layout horizontal center-center w120px line title">
              Days Since Last<br />
              Site Visit
            </div>
            <div class="flex-none w150px"></div>
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
                    <div class="prog-visits flex-none w65px line">${partner.prog_visit_mr}</div>
                  </div>
                  <div class="flex-4 intervention-data">
                    ${partner.interventions && partner.interventions.length
                      ? repeat(
                          partner.interventions,
                          (intervention: FullReportIntervention) => intervention.pk,
                          (intervention: FullReportIntervention) => html`
                            <div class="layout horizontal">
                              <div class="flex-none w45px layout horizontal center-center">
                                <iron-icon
                                  icon="expand-more"
                                  ?hidden="${this.detailsOpened[intervention.pk]}"
                                  @tap="${() => this.toggleDetails(intervention)}"
                                ></iron-icon>
                                <iron-icon
                                  icon="expand-less"
                                  ?hidden="${!this.detailsOpened[intervention.pk]}"
                                  @tap="${() => this.toggleDetails(intervention)}"
                                ></iron-icon>
                              </div>
                              <div class="flex-auto truncate line" title="${intervention.number}">
                                ${intervention.number}
                              </div>
                              <div class="flex-none layout horizontal center-center w120px line">
                                ${intervention.days_last_visit}
                              </div>
                              <div class="flex-none w150px layout horizontal links">
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
                                  PD Output / SSFA Expected Result
                                </div>
                                <div class="results-text line">
                                  ${this.getExpectedResults(intervention.pk, this.fullReport.result_links)}
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
                            <div class="flex-none w45px layout horizontal center-center"></div>
                            <div class="flex-auto truncate line">--</div>
                            <div class="flex-none layout horizontal center-center w120px line">--</div>
                            <div class="flex-none w150px layout horizontal links"></div>
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
                  <div class="prog-visits flex-none w65px line">--</div>
                </div>
                <div class="flex-4 intervention-data">
                  <div class="layout horizontal">
                    <div class="flex-none w45px layout horizontal center-center"></div>
                    <div class="flex-auto truncate line">--</div>
                    <div class="flex-none layout horizontal center-center w120px line">--</div>
                    <div class="flex-none w150px layout horizontal links"></div>
                  </div>
                </div>
              </div>
            `}
      </div>
    </div>
  `;
}
