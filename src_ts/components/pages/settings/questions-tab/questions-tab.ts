import { CSSResult, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { elevationStyles } from '../../../styles/elevation-styles';
import { template } from './questions-tab.tpl';
import { store } from '../../../../redux/store';
import { loadQuestions } from '../../../../redux/effects/questions.effects';
import { fireEvent } from '../../../utils/fire-custom-event';
import { questionsListData } from '../../../../redux/selectors/questions.selectors';
import { Unsubscribe } from 'redux';
import { updateQueryParams } from '../../../../routing/routes';
import { routeDetailsSelector } from '../../../../redux/selectors/app.selectors';
import { debounce } from '../../../utils/debouncer';
import { loadStaticData } from '../../../../redux/effects/load-static-data.effect';
import { CATEGORIES, METHODS, SECTIONS } from '../../../../endpoints/endpoints-list';
import { IEtoolsFilter } from '../../../common/layout/filters/etools-filters';
import { mapFilters } from '../../../utils/filters-mapping';
import { IDialogResponse, openDialog } from '../../../utils/dialog';
import { ANSWER_TYPES, LEVELS } from '../../../common/dropdown-options';
import { questionsFilters } from './questions-tab.filters';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { CardStyles } from '../../../styles/card-styles';
import { QuestionsTabStyles } from './question-tab.styles';
import { ListMixin } from '../../../common/mixins/list-mixin';

type Serialized = {
    id: number | string;
    name: string;
    [key: string]: any;
};

@customElement('questions-tab')
export class QuestionsTabComponent extends ListMixin<IQuestion>(LitElement) {
    @property() public filters: IEtoolsFilter[] | null = null;
    @property() public listLoadingInProcess: boolean = false;
    public categories: EtoolsCategory[] = [];
    public sections: EtoolsSection[] = [];
    public methods: EtoolsMethod[] = [];

    private readonly questionsDataUnsubscribe: Unsubscribe;
    private readonly routeDetailsUnsubscribe: Unsubscribe;
    private readonly debouncedLoading: Callback;

    public constructor() {
        super();
        this.debouncedLoading = debounce((params: IRouteQueryParam) => {
            this.listLoadingInProcess = true;
            store.dispatch<AsyncEffect>(loadQuestions(params))
                .catch(() => fireEvent(this, 'toast', { text: 'Can not load Questions List' }))
                .then(() => this.listLoadingInProcess = false);
        }, 100);

        this.questionsDataUnsubscribe = store.subscribe(questionsListData((data: IListData<IQuestion> | null) => {
            if (!data) { return; }
            this.count = data.count;
            this.items = data.results;
        }, false));

        this.routeDetailsUnsubscribe = store.subscribe(routeDetailsSelector((details: IRouteDetails) => this.onRouteChange(details), false));
        const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
        this.onRouteChange(currentRoute);

        this.addEventListener('sort-changed', ((event: CustomEvent<SortDetails>) => this.changeSort(event.detail)) as any);

        this.initFilters();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.questionsDataUnsubscribe();
        this.routeDetailsUnsubscribe();
    }

    public checkParams(params?: IRouteQueryParams | null): boolean {
        const invalid: boolean = !params || !params.page || !params.page_size;
        if (invalid) {
            updateQueryParams({ page: 1, page_size: 10 });
        }
        return !invalid;
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public static get styles(): CSSResult[] {
        return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, QuestionsTabStyles];
    }

    public serializeName<T extends Serialized>(id: number, collection: T[]): string {
        if (!id || !collection) { return ''; }
        const item: T | undefined = collection.find((collectionItem: T) => +collectionItem.id === +id);
        return item ? item.name : '';
    }

    public openPopup(question?: IQuestion): void {
        openDialog<IQuestion | undefined>({
            dialog: 'question-popup',
            data: question
        }).then(({ confirmed }: IDialogResponse<any>) => {
            if (!confirmed) { return; }

            // we need to refresh current list if this was edit popup or params wasn't updated
            // For update params it will load questions list in subscriber
            const needToRefresh: boolean = Boolean(question) || !updateQueryParams({ page: 1 });
            if (!needToRefresh) { return; }
            const currentParams: IRouteQueryParams | null = store.getState().app.routeDetails.queryParams;
            store.dispatch<AsyncEffect>(loadQuestions(currentParams || {}));
        });
    }

    private onRouteChange({ routeName, subRouteName, queryParams }: IRouteDetails): void {
        if (routeName !== 'settings' || subRouteName !== 'questions') { return; }

        const paramsAreValid: boolean = this.checkParams(queryParams);
        if (paramsAreValid) {
            this.queryParams = queryParams;
            this.debouncedLoading(this.queryParams);
        }
    }

    private initFilters(): void {
        const staticData: IStaticDataState = (store.getState() as IRootState).staticData;
        const { methods, sections, categories } = staticData;

        const methodsPromise: Promise<EtoolsMethod[]> = methods ? Promise.resolve(methods) : store.dispatch<AsyncEffect>(loadStaticData(METHODS));
        const sectionsPromise: Promise<EtoolsSection[]> = sections ? Promise.resolve(sections) : store.dispatch<AsyncEffect>(loadStaticData(SECTIONS));
        const categoriesPromise: Promise<EtoolsCategory[]> = categories ? Promise.resolve(categories) : store.dispatch<AsyncEffect>(loadStaticData(CATEGORIES));

        Promise
            .all([methodsPromise, sectionsPromise, categoriesPromise])
            .then(([methods__in, sections__in, category__in]: [EtoolsMethod[], EtoolsSection[], EtoolsCategory[]]) => {
                this.methods = methods__in;
                this.sections = sections__in;
                this.categories = category__in;
                const optionsCollection: GenericObject = {
                    methods__in, sections__in, category__in,
                    level__in: LEVELS,
                    answer_type__in: ANSWER_TYPES
                };
                const initialValues: GenericObject = store.getState().app.routeDetails.queryParams || {};
                this.filters = mapFilters(questionsFilters, optionsCollection, initialValues);
        });
    }
}
