import {CSSResult, LitElement, html, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {elevationStyles} from '../../../styles/elevation-styles';
import {store} from '../../../../redux/store';
import {loadQuestions} from '../../../../redux/effects/questions.effects';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {questionsListData} from '../../../../redux/selectors/questions.selectors';
import {Unsubscribe} from 'redux';
import {updateQueryParams} from '../../../../routing/routes';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {loadStaticData} from '../../../../redux/effects/load-static-data.effect';
import {CATEGORIES, METHODS, SECTIONS} from '../../../../endpoints/endpoints-list';
import {EtoolsFilter} from '@unicef-polymer/etools-unicef/src/etools-filters/etools-filters';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import {ANSWER_TYPES, LEVELS} from '../../../common/dropdown-options';
import {questionsFilters} from './questions-tab.filters';
import {SharedStyles} from '../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../styles/flex-layout-classes';
import {CardStyles} from '../../../styles/card-styles';
import {QuestionsTabStyles} from './question-tab.styles';
import {ListMixin} from '../../../common/mixins/list-mixin';
import {applyDropdownTranslation} from '../../../utils/translation-helper';
import {activeLanguageSelector} from '../../../../redux/selectors/active-language.selectors';
import {clone} from 'ramda';
import {
  updateFilterSelectionOptions,
  updateFiltersSelectedValues
} from '@unicef-polymer/etools-unicef/src/etools-filters/filters';
import {get as getTranslation} from 'lit-translate';
import {
  EtoolsRouteQueryParam,
  EtoolsRouteDetails,
  EtoolsRouteQueryParams
} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import '@unicef-polymer/etools-unicef/src/etools-filters/etools-filters';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table';
import './question-popup/question-popup';
import {ROOT_PATH} from '../../../../config/config';
import {hasPermission, Permissions} from '../../../../config/permissions';
import {InputStyles} from '../../../styles/input-styles';
import {translate} from 'lit-translate';

@customElement('questions-tab')
export class QuestionsTabComponent extends ListMixin()<IQuestion>(LitElement) {
  @property() filters: EtoolsFilter[] | null = null;
  @property() listLoadingInProcess = false;
  @property() filtersInitialized = false;
  categories: EtoolsCategory[] = [];
  sections: EtoolsSection[] = [];
  methods: EtoolsMethod[] = [];

  private readonly questionsDataUnsubscribe: Unsubscribe;
  private readonly routeDetailsUnsubscribe: Unsubscribe;
  private readonly debouncedLoading: Callback;
  private readonly activeLanguageUnsubscribe: Unsubscribe;

  constructor() {
    super();
    this.debouncedLoading = debounce((params: EtoolsRouteQueryParam) => {
      this.listLoadingInProcess = true;
      store
        .dispatch<AsyncEffect>(loadQuestions(params))
        .catch(() => fireEvent(this, 'toast', {text: getTranslation('ERROR_LOAD_QUESTIONS')}))
        .then(() => (this.listLoadingInProcess = false));
    }, 100);

    this.questionsDataUnsubscribe = store.subscribe(
      questionsListData((data: IListData<IQuestion> | null) => {
        if (!data) {
          return;
        }
        this.count = data.count;
        this.items = data.results;
      }, false)
    );

    this.routeDetailsUnsubscribe = store.subscribe(
      routeDetailsSelector((details: EtoolsRouteDetails) => this.onRouteChange(details), false)
    );
    const currentRoute: EtoolsRouteDetails = (store.getState() as IRootState).app.routeDetails;
    this.onRouteChange(currentRoute);

    this.addEventListener('sort-changed', ((event: CustomEvent<SortDetails>) => this.changeSort(event.detail)) as any);

    this.activeLanguageUnsubscribe = store.subscribe(activeLanguageSelector(() => this.initFilters()));
  }

  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, QuestionsTabStyles];
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.questionsDataUnsubscribe();
    this.routeDetailsUnsubscribe();
    this.activeLanguageUnsubscribe();
  }

  filtersChange(e: CustomEvent): void {
    if (this.filtersInitialized) {
      this.updateQueryParamsIfPageIsActive({...e.detail, page: 1}, 'questions');
    }
  }

  checkParams(params?: EtoolsRouteQueryParams | null): boolean {
    let invalid: boolean = !params || !params.page || !params.page_size;
    if (invalid) {
      updateQueryParams({page: 1, page_size: 10});
    } else if (params!.page !== 1 && this.isFilterChange(params)) {
      invalid = true;
      // if filters changed and not on first page, reset to the first page
      // to avoid error of missing data for the current page
      updateQueryParams({page: 1, page_size: params!.page_size});
    }
    return !invalid;
  }

  render(): TemplateResult {
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
                <div class="col-data flex-1">
                  ${translate(`QUESTIONS.LEVEL.${question.level.toUpperCase()}`) || '-'}
                </div>
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
                <div class="hover-block">
                  <etools-icon
                    name="${hasPermission(Permissions.EDIT_QUESTIONS) ? 'create' : 'visibility'}"
                    @click="${() => this.openPopup(question)}"
                  ></etools-icon>
                </div>
              </div>
              <div slot="row-data-details" class="layout horizontal">
                <div class="row-details-content w160px">
                  <div class="rdc-title">${translate('QUESTIONS.COLUMNS.SECTIONS')}</div>
                  <div class="truncate">
                    ${question.sections
                      .map((section: number) => this.serializeName(section, this.sections))
                      .join(', ') || '-'}
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

  serializeName<T extends Serialized>(id: number, collection: T[]): string {
    if (!id || !collection) {
      return '';
    }
    const item: T | undefined = collection.find((collectionItem: T) => +collectionItem.id === +id);
    return item ? item.name : '';
  }

  openPopup(question?: IQuestion): void {
    if (question) {
      question = clone(question);
    }
    openDialog<IQuestion | undefined>({
      dialog: 'question-popup',
      dialogData: question
    }).then(({confirmed}: IDialogResponse<any>) => {
      if (!confirmed) {
        return;
      }

      // we need to refresh current list if this was edit popup or params wasn't updated
      // For update params it will load questions list in subscriber
      const needToRefresh: boolean = Boolean(question) || !updateQueryParams({page: 1});
      if (!needToRefresh) {
        return;
      }
      const currentParams: EtoolsRouteQueryParams | null = store.getState().app.routeDetails.queryParams;
      store.dispatch<AsyncEffect>(loadQuestions(currentParams || {}));
    });
  }

  private onRouteChange({routeName, subRouteName, queryParams}: EtoolsRouteDetails): void {
    if (routeName !== 'templates' || subRouteName !== 'questions') {
      return;
    }

    const paramsAreValid: boolean = this.checkParams(queryParams);
    if (paramsAreValid) {
      this.queryParams = queryParams;
      this.debouncedLoading(this.queryParams);
    }
  }

  private isFilterChange(queryParams?: EtoolsRouteQueryParams | null): boolean {
    if (!queryParams || !this.queryParams) {
      return false;
    }
    return (this.filters || []).some((filter) => {
      return JSON.stringify(queryParams[filter.filterKey]) !== JSON.stringify(this.queryParams![filter.filterKey]);
    });
  }

  private initFilters(): void {
    const staticData: IStaticDataState = (store.getState() as IRootState).staticData;
    const {methods, sections, categories} = staticData;

    const methodsPromise: Promise<EtoolsMethod[]> = methods
      ? Promise.resolve(methods)
      : store.dispatch<AsyncEffect>(loadStaticData(METHODS));
    const sectionsPromise: Promise<EtoolsSection[]> = sections
      ? Promise.resolve(sections)
      : store.dispatch<AsyncEffect>(loadStaticData(SECTIONS));
    const categoriesPromise: Promise<EtoolsCategory[]> = categories
      ? Promise.resolve(categories)
      : store.dispatch<AsyncEffect>(loadStaticData(CATEGORIES));

    Promise.all([methodsPromise, sectionsPromise, categoriesPromise]).then(
      ([methods__in, sections__in, category__in]: any) => {
        this.methods = methods__in;
        this.sections = sections__in;
        this.categories = category__in;
        const optionsCollection: GenericObject = {
          methods__in,
          sections__in,
          category__in,
          level__in: applyDropdownTranslation(LEVELS),
          answer_type__in: applyDropdownTranslation(ANSWER_TYPES)
        };

        const availableFilters = [...questionsFilters()];
        // @dci clearSelectedValuesInFilters(questionsFilters);
        this.populateDropdownFilterOptions(optionsCollection, availableFilters);

        const currentParams: GenericObject = store.getState().app.routeDetails.queryParams || {};
        if (!this.filters) {
          this.filters = updateFiltersSelectedValues(currentParams, availableFilters);
        }
      }
    );
  }

  private populateDropdownFilterOptions(filtersData: GenericObject, activitiesListFilters: EtoolsFilter[]): void {
    activitiesListFilters.forEach((filter: EtoolsFilter) => {
      if (filtersData[filter.filterKey]) {
        updateFilterSelectionOptions(activitiesListFilters, filter.filterKey, filtersData[filter.filterKey]);
      }
    });
  }
}
