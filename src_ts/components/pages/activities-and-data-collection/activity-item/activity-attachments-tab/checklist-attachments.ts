import {css, CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import '../../../../common/attachmants-list/attachments-list';
import {repeat} from 'lit-html/directives/repeat';
import '@unicef-polymer/etools-data-table';
import {MethodsMixin} from '../../../../common/mixins/methods-mixin';

@customElement('checklist-attachments')
export class ChecklistAttachments extends MethodsMixin(LitElement) {
  @property() activityDetails: IActivityDetails | null = null;
  @property() items: any[] = [];

  render(): TemplateResult {
    return html`
      <section class="elevation page-content card-container" elevation="1">
        <div class="card-title-box with-bottom-line">
          <div class="card-title">Checklist Attachments</div>
        </div>
        <div class="hact-visits">
          <etools-data-table-header no-title ?no-collapse="${!this.items.length}">
            <etools-data-table-column class="flex-1">
              Method
            </etools-data-table-column>
            <etools-data-table-column class="flex-1">
              Data Collector
            </etools-data-table-column>
            <etools-data-table-column class="flex-1">
              Method type
            </etools-data-table-column>
            <etools-data-table-column class="flex-1">
              Related To
            </etools-data-table-column>
            <etools-data-table-column class="flex-1">
              Related Name
            </etools-data-table-column>
          </etools-data-table-header>
          ${!this.items.length
            ? html`
                <etools-data-table-row no-collapse>
                  <div slot="row-data" class="layout horizontal editable-row flex">
                    <div class="col-data flex-1 truncate">-</div>
                    <div class="col-data flex-1 truncate">-</div>
                    <div class="col-data flex-1 truncate">-</div>
                    <div class="col-data flex-1 truncate">-</div>
                    <div class="col-data flex-1 truncate">-</div>
                  </div>
                </etools-data-table-row>
              `
            : ''}
          ${repeat(
            this.items,
            (hactVisit: HactVisits) => html`
              <etools-data-table-row secondary-bg-on-hover>
                <div slot="row-data" class="layout horizontal editable-row flex">
                  <div class="col-data flex-1">
                    <span class="truncate">${hactVisit.name}</span>
                  </div>
                  <div class="col-data flex-1 hact-visits-label">
                    <span class="flexible-text">${hactVisit.visits_count}</span>
                  </div>
                </div>

                <div slot="row-data-details" class="custom-row-data">
                  <div class="custom-row-details-content">
                    <div class="rdc-title">Visit</div>
                  </div>
                  <div class="custom-row-details-content">
                    <div class="rdc-title">CP output</div>
                  </div>
                  <div class="custom-row-details-content">
                    <div class="rdc-title">PD/SSFA</div>
                  </div>
                  <div class="custom-row-details-content">
                    <div class="rdc-title">Visit End Date</div>
                  </div>
                </div>
                ${hactVisit.visits.length
                  ? repeat(
                      hactVisit.visits,
                      (activity: HactVisitsActivity) => html`
                        <div slot="row-data-details" class="custom-row-data">
                          <div class="custom-row-details-content">${activity.name}</div>
                          <div class="custom-row-details-content">${activity.cp_outputs}</div>
                          <div class="custom-row-details-content">${activity.interventions}</div>
                          <div class="custom-row-details-content">${activity.end_date}</div>
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

  connectedCallback(): void {
    super.connectedCallback();
  }

  static get styles(): CSSResult[] {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      CardStyles,
      FlexLayoutClasses,
      css`
        .custom-row-data {
          display: flex;
          justify-content: space-between;
        }
        .custom-row-details-content {
          font-size: 12px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 100px;
          margin: 0.5%;
        }
      `
    ];
  }
}
