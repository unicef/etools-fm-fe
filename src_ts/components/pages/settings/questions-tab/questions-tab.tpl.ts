import '@unicef-polymer/etools-data-table';
import '../../../common/layout/filters/etools-filters';
import { html, TemplateResult } from 'lit-element';
import { QuestionsTabComponent } from './questions-tab';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { TableStyles } from '../../../styles/table-styles';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { TabInputsStyles } from '../../../styles/tab-inputs-styles';
import { QuestionsTabStyles } from './question-tab.styles';
import { translate } from '../../../../localization/localisation';

export function template(this: QuestionsTabComponent): TemplateResult {
    return html`
            ${SharedStyles} ${pageLayoutStyles} ${QuestionsTabStyles}
            ${FlexLayoutClasses} ${TableStyles} ${TabInputsStyles}
            <section class="elevation page-content table-container question-filters-section" elevation="1">
                <etools-filters .filters="${this.filters || []}" @filter-change="${ (event: CustomEvent) => this.filtersChanged(event.detail) }"></etools-filters>
            </section>

            <section class="elevation page-content table-container question-table-section" elevation="1">

                <div class="table-title-block with-bottom-line">
                    <div class="table-title counter">${ translate('QUESTIONS.TABLE_CAPTION', this.tableInformation) }</div>
                </div>

                <etools-data-table-header no-title ?no-collapse="${!this.questionsList.length}">
                    <etools-data-table-column class="flex-2" field="text" sortable>
                        ${ translate('QUESTIONS.COLUMNS.TEXT') }
                    </etools-data-table-column>
                    <etools-data-table-column class="flex-1" field="level" sortable>
                        ${ translate('QUESTIONS.COLUMNS.LEVEL') }
                    </etools-data-table-column>
                    <etools-data-table-column class="flex-1" field="methods" sortable>
                        ${ translate('QUESTIONS.COLUMNS.METHODS') }
                    </etools-data-table-column>
                    <etools-data-table-column class="flex-1" field="answer_type" sortable>
                        ${ translate('QUESTIONS.COLUMNS.ANSWER_TYPE') }
                    </etools-data-table-column>
                    <etools-data-table-column class="flex-1" field="category" sortable>
                        ${ translate('QUESTIONS.COLUMNS.CATEGORY') }
                    </etools-data-table-column>
                    <etools-data-table-column class="w45px flex-none" field="is_active" sortable>
                        ${ translate('QUESTIONS.COLUMNS.IS_ACTIVE') }
                    </etools-data-table-column>
                </etools-data-table-header>

                ${!this.questionsList.length ?
                        html`
                        <etools-data-table-row no-collapse>
                            <div slot="row-data" class="layout horizontal editable-row flex">
                                <div class="col-data flex-2 truncate">-</div>
                                <div class="col-data flex-1 truncate">-</div>
                                <div class="col-data flex-1 truncate">-</div>
                                <div class="col-data flex-1 truncate">-</div>
                                <div class="col-data flex-1 truncate">-</div>
                                <div class="col-data w45px flex-none truncate">-</div>
                            </div>
                        </etools-data-table-row>
                        ` :
                        '' }

                ${
                    this.questionsList.map((question: Question) => html`
                        <etools-data-table-row secondary-bg-on-hover>
                            <div slot="row-data" class="layout horizontal editable-row flex">
                                <div class="col-data flex-2 truncate">${ question.text || '-' }</div>
                                <div class="col-data flex-1 truncate">${ translate(`QUESTIONS.LEVEL.${question.level.toUpperCase()}`) || '-' }</div>
                                <div class="col-data flex-1 truncate">${ question.methods.map((method: number) => this.serializeName(method, this.methods)).join(', ') || '-' }</div>
                                <div class="col-data flex-1 truncate">${ translate(`QUESTIONS.ANSWER_TYPE.${question.answer_type.toUpperCase()}`) || '-' }</div>
                                <div class="col-data flex-1 truncate">${ this.serializeName(question.category, this.categories) || '-' }</div>
                                <div class="col-data w45px flex-none truncate">${ question.is_active || '-' }</div>
                            </div>
                            <div slot="row-data-details" class="layout horizontal">
                                <div class="row-details-content">
                                    <div class="rdc-title">My new title</div>
                                    <div class="truncate">test description with long name!!!</div>
                                </div>
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
