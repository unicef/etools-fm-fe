import {html, TemplateResult} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import {VisitsEligibleForHact} from './visits-eligible-for-hact';
import '@unicef-polymer/etools-data-table';
import {translate} from 'lit-translate';

export function template(this: VisitsEligibleForHact): TemplateResult {
  return html`
    <section class="elevation page-content card-container" elevation="1">
      <etools-loading
        ?active="${this.loading}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <div class="card-title-box with-bottom-line">
        <div class="card-title">${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.TITLE')}</div>
      </div>
      <div class="hact-visits">
        <etools-data-table-header no-title ?no-collapse="${!this.items.length}">
          <etools-data-table-column class="flex-1" field="name" sortable>
            ${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.PARTNER')}
          </etools-data-table-column>
          <etools-data-table-column class="flex-1 hact-visits-label" field="visits_count" sortable>
            ${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.HACT_ELIGIBLE_VISITS')}
          </etools-data-table-column>
        </etools-data-table-header>
        ${!this.items.length
          ? html`
              <etools-data-table-row no-collapse>
                <div slot="row-data" class="layout horizontal editable-row flex">
                  <div class="col-data flex-1 truncate">-</div>
                  <div class="col-data flex-2 truncate">-</div>
                </div>
              </etools-data-table-row>
            `
          : ''}
        ${repeat(
          this.items,
          (hactVisit: HactVisits) => hactVisit.id,
          (hactVisit: HactVisits) => html`
            <etools-data-table-row id="hactVisits" secondary-bg-on-hover @tap="${() => this._resizeMap()}">
              <div slot="row-data" class="layout horizontal editable-row flex">
                <div class="col-data flex-1">
                  <span class="truncate">${hactVisit.name}</span>
                </div>
                <div class="col-data flex-1 hact-visits-label">
                  <span class="flexible-text">${hactVisit.visits_count}</span>
                </div>
              </div>

              <div slot="row-data-details" class="custom-row-data">
                <div class="custom-row-details-content custom-row-details-visit">
                  <div class="rdc-title">${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.VISIT')}</div>
                </div>
                <div class="custom-row-details-content custom-row-details-cp-output">
                  <div class="rdc-title">${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.CP_OUTPUT')}</div>
                </div>
                <div class="custom-row-details-content custom-row-details-ps-ssfa">
                  <div class="rdc-title">${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.PD_SSFA')}</div>
                </div>
                <div class="custom-row-details-content custom-row-details-date">
                  <div class="rdc-title">
                    ${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.VISIT_END_DATE')}
                  </div>
                </div>
              </div>
              ${hactVisit.visits.length
                ? repeat(
                    hactVisit.visits,
                    (activity: HactVisitsActivity) => activity.id,
                    (activity: HactVisitsActivity) => html`
                      <div slot="row-data-details" class="custom-row-data">
                        <div class="custom-row-details-content custom-row-details-nowrap custom-row-details-visit">
                          ${activity.reference_number}
                        </div>
                        <div class="custom-row-details-content custom-row-details-cp-output">
                          ${activity.cp_outputs.map(
                            (item: IActivityCPOutput) =>
                              html`
                                <label class="custom-row-details-content custom-row-details-nowrap">${item.name}</label>
                              `
                          )}
                        </div>
                        <div class="custom-row-details-content custom-row-details-ps-ssfa">
                          ${activity.interventions.map(
                            (item: IActivityIntervention) =>
                              html`
                                <label class="custom-row-details-content custom-row-details-nowrap"
                                  >${item.title}</label
                                >
                              `
                          )}
                        </div>
                        <div class="custom-row-details-content custom-row-details-nowrap custom-row-details-date">
                          ${this.formatDate(activity.end_date)}
                        </div>
                      </div>
                    `
                  )
                : html`
                    <div slot="row-data-details" class="custom-row-data">
                      <div class="custom-row-details-content">-</div>
                      <div class="custom-row-details-content">-</div>
                      <div class="custom-row-details-content">-</div>
                      <div class="custom-row-details-content">-</div>
                    </div>
                  `}
            </etools-data-table-row>
          `
        )}
      </div>
    </section>
  `;
}
