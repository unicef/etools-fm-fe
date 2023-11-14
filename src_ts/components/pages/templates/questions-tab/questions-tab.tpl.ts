import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import '@unicef-polymer/etools-filters/src/etools-filters';
import './question-popup/question-popup';
import {html, TemplateResult} from 'lit';
import {QuestionsTabComponent} from './questions-tab';
import {ROOT_PATH} from '../../../../config/config';
import {hasPermission, Permissions} from '../../../../config/permissions';
import {InputStyles} from '../../../styles/input-styles';
import {translate} from 'lit-translate';

export function template(this: QuestionsTabComponent): TemplateResult {
  return html`
    ${InputStyles}
    <section class="elevation page-content card-container question-filters-section" elevation="1">
      <etools-filters
        .filters="${this.filters}"
        .textFilters="${translate('FILTERS_ELEMENT.TITLE')}"
        .textClearAll="${translate('FILTERS_ELEMENT.CLEAR_ALL')}"
        @filter-change="${this.filtersChange}"
        @click="${() => {
          this.filtersInitialized = !!this.filters?.length;
        }}"
      ></etools-filters>
    </section>

    <section class="elevation page-content card-container question-table-section" elevation="1">
      <!-- Spinner -->
      <etools-loading
        ?active="${this.listLoadingInProcess}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>

      <div class="card-title-box with-bottom-line">
        <div class="card-title counter">${translate('QUESTIONS.TABLE_CAPTION', this.tableInformation)}</div>
        <div class="buttons-container">
          <etools-icon-button
            @click="${() => this.openPopup()}"
            class="panel-button"
            ?hidden="${!hasPermission(Permissions.EDIT_QUESTIONS)}"
            data-type="add"
            name="add-box"
          ></etools-icon-button>
        </div>
      </div>

      <etools-data-table-header no-title ?no-collapse="${!this.items.length}">
        <etools-data-table-column class="flex-2 col-data" field="text" sortable>
          ${translate('QUESTIONS.COLUMNS.TEXT')}
        </etools-data-table-column>
        <etools-data-table-column class="flex-1 col-data" field="level" sortable>
          ${translate('QUESTIONS.COLUMNS.LEVEL')}
        </etools-data-table-column>
        <etools-data-table-column class="flex-1 col-data">
          ${translate('QUESTIONS.COLUMNS.METHODS')}
        </etools-data-table-column>
        <etools-data-table-column class="flex-1 col-data" field="answer_type" sortable>
          ${translate('QUESTIONS.COLUMNS.ANSWER_TYPE')}
        </etools-data-table-column>
        <etools-data-table-column class="flex-1 col-data" field="category__name" sortable>
          ${translate('QUESTIONS.COLUMNS.CATEGORY')}
        </etools-data-table-column>
        <etools-data-table-column class="w60px flex-none col-data" field="is_active" sortable>
          ${translate('QUESTIONS.COLUMNS.IS_ACTIVE')}
        </etools-data-table-column>
      </etools-data-table-header>

      ${!this.items.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="layout horizontal editable-row flex">
                <div class="col-data flex-2">-</div>
                <div class="col-data flex-1">-</div>
                <div class="col-data flex-1">-</div>
                <div class="col-data flex-1">-</div>
                <div class="col-data flex-1">-</div>
                <div class="col-data w45px flex-none">-</div>
              </div>
            </etools-data-table-row>
          `
        : ''}
      ${this.items.map(
        (question: IQuestion) => html`
          <etools-data-table-row secondary-bg-on-hover>
            <div slot="row-data" class="layout horizontal editable-row flex">
              <div class="col-data flex-2">${question.text || '-'}</div>
              <div class="col-data flex-1">${translate(`QUESTIONS.LEVEL.${question.level.toUpperCase()}`) || '-'}</div>
              <div class="col-data flex-1">
                <div class="truncate">
                  ${question.methods.map((method: number) => this.serializeName(method, this.methods)).join(', ') ||
                  '-'}
                </div>
              </div>
              <div class="col-data flex-1">
                ${translate(`ANSWER_TYPE_OPTIONS.${question.answer_type.toUpperCase()}`) || '-'}
              </div>
              <div class="col-data flex-1">
                <div class="truncate">${this.serializeName(question.category, this.categories) || '-'}</div>
              </div>
              <div class="col-data w45px flex-none truncate">
                <img src="${ROOT_PATH}assets/images/${question.is_active ? 'icon-check' : 'red-close'}.svg" />
              </div>
              <div class="hover-block" ?hidden="${!hasPermission(Permissions.EDIT_QUESTIONS)}">
                <etools-icon name="create" @tap="${() => this.openPopup(question)}"></etools-icon>
              </div>
            </div>
            <div slot="row-data-details" class="layout horizontal">
              <div class="row-details-content w160px">
                <div class="rdc-title">${translate('QUESTIONS.COLUMNS.SECTIONS')}</div>
                <div class="truncate">
                  ${question.sections.map((section: number) => this.serializeName(section, this.sections)).join(', ') ||
                  '-'}
                </div>
              </div>
              <div class="row-details-content w160px">
                <div class="rdc-title">${translate('QUESTIONS.COLUMNS.IS_HACT')}</div>
                <div class="image">
                  ${question.is_hact ? html` <img src="${ROOT_PATH}assets/images/icon-check.svg" /> ` : '-'}
                </div>
              </div>
              <div class="row-details-content" ?hidden="${question.answer_type !== 'likert_scale'}">
                <div class="rdc-title">${translate('QUESTIONS.COLUMNS.ANSWER_OPTIONS')}</div>
                <div class="truncate">
                  ${question.options.map((option: Partial<QuestionOption>) => option.label).join(' | ')}
                </div>
              </div>
            </div>
          </etools-data-table-row>
        `
      )}

      <etools-data-table-footer
        id="footer"
        .rowsPerPageText="${translate('ROWS_PER_PAGE')}"
        .pageSize="${(this.queryParams && this.queryParams.page_size) || undefined}"
        .pageNumber="${(this.queryParams && this.queryParams.page) || undefined}"
        .totalResults="${this.count}"
        @page-size-changed="${(event: CustomEvent) => this.changePageParam(event.detail.value, 'page_size')}"
        @page-number-changed="${(event: CustomEvent) => this.changePageParam(event.detail.value, 'page')}"
      >
      </etools-data-table-footer>
    </section>
  `;
}
