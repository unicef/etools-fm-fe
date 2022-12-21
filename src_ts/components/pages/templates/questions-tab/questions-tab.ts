import {CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {elevationStyles} from '../../../styles/elevation-styles';
import {template} from './questions-tab.tpl';
import {store} from '../../../../redux/store';
import {loadQuestions} from '../../../../redux/effects/questions.effects';
import {fireEvent} from '../../../utils/fire-custom-event';
import {questionsListData} from '../../../../redux/selectors/questions.selectors';
import {Unsubscribe} from 'redux';
import {updateQueryParams} from '../../../../routing/routes';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {debounce} from '../../../utils/debouncer';
import {loadStaticData} from '../../../../redux/effects/load-static-data.effect';
import {CATEGORIES, METHODS, SECTIONS} from '../../../../endpoints/endpoints-list';
import {EtoolsFilter} from '@unicef-polymer/etools-filters/src/etools-filters';
import {openDialog} from '../../../utils/dialog';
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
import {decodeQueryStrToObj} from '../../../utils/utils';
import {updateFilterSelectionOptions, updateFiltersSelectedValues} from '@unicef-polymer/etools-filters/src/filters';
import {get as getTranslation} from 'lit-translate';

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
    this.debouncedLoading = debounce((params: IRouteQueryParam) => {
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
      routeDetailsSelector((details: IRouteDetails) => this.onRouteChange(details), false)
    );
    const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
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
      updateQueryParams({...e.detail, page: 1}, true);
    }
  }

  checkParams(params?: IRouteQueryParams | null): boolean {
    let invalid: boolean = !params || !params.page || !params.page_size;
    if (invalid) {
      updateQueryParams({page: 1, page_size: 10});
    } else if (params!.page !== 1 && this.isFilterChange(params)) {
      invalid = true;
      // if filters changed and not on first page, reset to the first page to avoid error of missing data for the current page
      updateQueryParams({page: 1, page_size: params!.page_size});
    }
    return !invalid;
  }

  render(): TemplateResult {
    return template.call(this);
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
      const currentParams: IRouteQueryParams | null = store.getState().app.routeDetails.queryParams;
      store.dispatch<AsyncEffect>(loadQuestions(currentParams || {}));
    });
  }

  private onRouteChange({routeName, subRouteName, queryParams}: IRouteDetails): void {
    if (routeName !== 'templates' || subRouteName !== 'questions') {
      return;
    }

    const paramsAreValid: boolean = this.checkParams(queryParams);
    if (paramsAreValid) {
      this.queryParams = queryParams;
      this.debouncedLoading(this.queryParams);
    }
  }

  private isFilterChange(queryParams?: IRouteQueryParams | null): boolean {
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

        this.populateDropdownFilterOptions(optionsCollection, questionsFilters);

        const currentParams: GenericObject = decodeQueryStrToObj(
          store.getState().app.routeDetails.queryParamsString || ''
        );
        this.filters = updateFiltersSelectedValues(currentParams, questionsFilters);
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
