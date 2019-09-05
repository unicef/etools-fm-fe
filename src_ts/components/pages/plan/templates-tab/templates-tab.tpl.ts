import '@unicef-polymer/etools-data-table';
import '@unicef-polymer/etools-dropdown';
import '@polymer/paper-checkbox';
import { TemplatesTabComponent } from './templates-tab';
import { html, TemplateResult } from 'lit-element';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { TableStyles } from '../../../styles/table-styles';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { TabInputsStyles } from '../../../styles/tab-inputs-styles';
import { INTERVENTION, LEVELS, OUTPUT, PARTNER } from '../../settings/questions-tab/questions-tab.filters';
import { TemplatesSttyles } from './templates-tab.styles';
import { translate } from '../../../../localization/localisation';
import { PaperCheckboxElement } from '@polymer/paper-checkbox/paper-checkbox';

export function template(this: TemplatesTabComponent): TemplateResult {
    return html`
          ${SharedStyles} ${pageLayoutStyles} ${TemplatesSttyles}
          ${FlexLayoutClasses} ${TableStyles} ${TabInputsStyles}

          <section class="filters-container elevation page-content table-container question-filters-section layout horizontal" elevation="1">
              <div class="filter">
                  <etools-dropdown .options="${LEVELS}"
                                   .selected="${ this.queryParams && this.queryParams.level || undefined }"
                                   @etools-selected-item-changed="${ ({ detail }: CustomEvent) => this.onLevelChanged(detail.selectedItem.value) }"
                                   trigger-value-change-event
                                   hide-search
                                   label="${ translate('TEMPLATES.FILTERS.LEVEL_LABEL') }"
                                   placeholder="${ translate('TEMPLATES.FILTERS.LEVEL_PLACEHOLDER') }"
                                   .minWidth="160px"
                                   option-label="display_name"
                                   option-value="value"></etools-dropdown>
              </div>

              <div class="filter">
                  <etools-dropdown ?hidden="${ !this.queryParams || this.queryParams.level !== PARTNER }"
                                   .options="${[]}"
                                   trigger-value-change-event
                                   hide-search
                                   label="${ translate('TEMPLATES.FILTERS.PARTNER_LABEL') }"
                                   placeholder="${ translate('TEMPLATES.FILTERS.PARTNER_PLACEHOLDER') }"
                                   .minWidth="160px"
                                   option-label="display_name"
                                   option-value="value"></etools-dropdown>

                  <etools-dropdown ?hidden="${ !this.queryParams || this.queryParams.level !== OUTPUT }"
                                   .options="${[]}"
                                   trigger-value-change-event
                                   hide-search
                                   label="${ translate('TEMPLATES.FILTERS.OUTPUT_LABEL') }"
                                   placeholder="${ translate('TEMPLATES.FILTERS.OUTPUT_PLACEHOLDER') }"
                                   .minWidth="160px"
                                   option-label="display_name"
                                   option-value="value"></etools-dropdown>

                  <etools-dropdown ?hidden="${ !this.queryParams || this.queryParams.level !== INTERVENTION }"
                                   .options="${[]}"
                                   trigger-value-change-event
                                   hide-search
                                   label="${ translate('TEMPLATES.FILTERS.INTERVENTION_LABEL') }"
                                   placeholder="${ translate('TEMPLATES.FILTERS.INTERVENTION_PLACEHOLDER') }"
                                   .minWidth="160px"
                                   option-label="display_name"
                                   option-value="value"></etools-dropdown>
              </div>
          </section>

          <section class="elevation page-content table-container templates-table-section" elevation="1" ?hidden="${ !this.queryParams || !this.queryParams.level }">

              <etools-loading ?active="${ this.listLoadingInProcess }" loading-text="${ translate('MAIN.LOADING_DATA_IN_PROCESS') }"></etools-loading>

              <etools-data-table-header no-title no-collapse>
                  <div class="checkbox-container"></div>
                  <etools-data-table-column class="flex-1" field="text">
                      ${ translate('TEMPLATES.COLUMNS.TEXT') }
                  </etools-data-table-column>
                  <etools-data-table-column class="flex-2" field="level">
                      ${ translate('TEMPLATES.COLUMNS.DETAILS') }
                  </etools-data-table-column>
                  <etools-data-table-column class="flex-none w100px">
                      ${ translate('TEMPLATES.COLUMNS.METHODS') }
                  </etools-data-table-column>
              </etools-data-table-header>

              ${ !this.questionTemplatesList.length ? html`
                  <etools-data-table-row no-collapse>
                      <div slot="row-data" class="layout horizontal editable-row flex">
                          <div class="checkbox-container"></div>
                          <div class="col-data flex-1 truncate">-</div>
                          <div class="col-data flex-2 truncate">-</div>
                          <div class="col-data flex-none w100px truncate">-</div>
                      </div>
                  </etools-data-table-row>
              ` : '' }

              ${ this.questionTemplatesList.map((questionTemplate: IQuestionTemplate) => html`
                  <etools-data-table-row no-collapse>
                      <div slot="row-data" class="layout horizontal editable-row flex">
                          <div class="checkbox-container layout horizontal center-center">
                              <paper-checkbox ?checked="${ questionTemplate.template && questionTemplate.template.is_active }" class="nolabel"
                                       @change="${ (event: CustomEvent) => console.log('is_active', (event.target as PaperCheckboxElement).checked) }"></paper-checkbox>
                          </div>
                          <div class="col-data flex-1 truncate">${ questionTemplate.text }</div>
                          <div class="col-data flex-2 truncate">${ questionTemplate.template && questionTemplate.template.specific_details || html`<span class="detail-placeholder">Add Detail</span>` }</div>
                          <div class="col-data flex-none w100px truncate">${ questionTemplate.methods }</div>
                      </div>
                  </etools-data-table-row>
              `) }

              <etools-data-table-footer
                      id="footer"
                      .pageSize="${ this.queryParams && this.queryParams.page_size || undefined }"
                      .pageNumber="${ this.queryParams && this.queryParams.page || undefined }"
                      .totalResults="${ this.count }"
                      @page-size-changed="${ (event: CustomEvent) => this.changePageParam(event.detail.value, 'page_size') }"
                      @page-number-changed="${ (event: CustomEvent) => this.changePageParam(event.detail.value, 'page') }">
              </etools-data-table-footer>
          </section>
    `;
}
