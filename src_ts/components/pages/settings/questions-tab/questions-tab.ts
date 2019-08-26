import { CSSResult, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { elevationStyles } from '../../../styles/lit-styles/elevation-styles';
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
import { translate } from '../../../../localization/localisation';
import { IEtoolsFilter } from '../../../common/layout/filters/etools-filters';
import { mapFilters } from '../../../utils/filters-mapping';
import { questionsFilters } from './questions-tab.filters';

type Serialized = {
    id: number;
    name: string;
};

const ANSWER_TYPES: GenericObject[] = [
    { value: 'text', display_name: translate(`QUESTIONS.ANSWER_TYPE.TEXT`) },
    { value: 'number', display_name: translate(`QUESTIONS.ANSWER_TYPE.NUMBER`) },
    { value: 'bool', display_name: translate(`QUESTIONS.ANSWER_TYPE.BOOL`) },
    { value: 'likert_scale', display_name: translate(`QUESTIONS.ANSWER_TYPE.LIKERT_SCALE`) }
];

const LEVELS: GenericObject[] = [
    { value: 'partner', display_name: translate(`QUESTIONS.LEVEL.PARTNER`) },
    { value: 'output', display_name: translate(`QUESTIONS.LEVEL.OUTPUT`) },
    { value: 'intervention', display_name: translate(`QUESTIONS.LEVEL.INTERVENTION`) }
];

@customElement('questions-tab')
export class QuestionsTabComponent extends LitElement {

    @property() public questionsList: Question[] = [];
    @property() public filters: IEtoolsFilter[] | null = null;
    public count: number = 0;
    public queryParams: IRouteQueryParam | null = null;
    public categories: EtoolsCategory[] = [];
    public sections: EtoolsSection[] = [];
    public methods: EtoolsMethod[] = [];

    private readonly questionsDataUnsubscribe: Unsubscribe;
    private readonly routeDetailsUnsubscribe: Unsubscribe;
    private readonly debouncedLoading: Callback;

    public get tableInformation(): TableInformation {
        const { page, page_size }: GenericObject = this.queryParams || {};
        const notEnoughData: boolean = !page_size || !page || !this.count || !this.questionsList;
        const end: number = notEnoughData ? 0 : Math.min(page * page_size, this.count);
        const start: number = notEnoughData ? 0 : end - this.questionsList.length + 1;
        return { start, end, count: this.count };
    }

    public constructor() {
        super();
        this.debouncedLoading = debounce((params: IRouteQueryParam) => {
            // this.dispatchOnStore(new RunGlobalLoading({type: 'specificLocations', message: 'Loading Data...'}));
            store.dispatch<AsyncEffect>(loadQuestions(params))
                .catch(() => fireEvent(this, 'toast', { text: 'Can not load Questions List' }));
            // .then(() => this.dispatchOnStore(new StopGlobalLoading({type: 'specificLocations'})));
        }, 100);

        this.questionsDataUnsubscribe = store.subscribe(questionsListData((data: IListData<Question> | null) => {
            if (!data) { return; }
            this.count = data.count;
            this.questionsList = data.results;
        }));

        this.routeDetailsUnsubscribe = store.subscribe(routeDetailsSelector((details: IRouteDetails) => this.onRouteChange(details), false));
        const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
        this.onRouteChange(currentRoute);

        this.initFilters();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.questionsDataUnsubscribe();
        this.routeDetailsUnsubscribe();
    }

    public checkParams(params?: IRouteQueryParams | null, update?: boolean): boolean {
        const invalid: boolean = !params || !params.page || !params.page_size;
        if (invalid && update) {
            updateQueryParams({ page: 1, page_size: 10 });
        }
        return !invalid;
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public changePageParam(newValue: string | number, paramName: string): void {
        const currentValue: number | string = this.queryParams && this.queryParams[paramName] || 0;
        if (+newValue === +currentValue) { return; }
        updateQueryParams({ [paramName]: newValue });
    }

    public filtersChanged(details: any): void {
        console.log('filtersChanged', details);
        updateQueryParams(details);
    }

    public serializeName<T extends Serialized>(id: number, collection: T[]): string {
        if (!id || !collection) { return ''; }
        const item: T | undefined = collection.find((collectionItem: T) => +collectionItem.id === +id);
        return item ? item.name : '';
    }

    private onRouteChange({ routeName, subRouteName, queryParams }: IRouteDetails): void {
        if (routeName !== 'settings' || subRouteName !== 'questions') { return; }

        const paramsAreValid: boolean = this.checkParams(queryParams, true);
        if (paramsAreValid) {
            this.queryParams = queryParams;
            this.debouncedLoading(this.queryParams);
        }
    }

    private initFilters(): void {
        Promise.all([
            store.dispatch<AsyncEffect>(loadStaticData(METHODS)),
            store.dispatch<AsyncEffect>(loadStaticData(SECTIONS)),
            store.dispatch<AsyncEffect>(loadStaticData(CATEGORIES))
        ]).then(([methods__in, sections__in, category__in]: [EtoolsMethod[], EtoolsSection[], EtoolsCategory[]]) => {
            this.methods = methods__in;
            this.sections = sections__in;
            this.categories = category__in;
            const optionsCollection: GenericObject = {
                methods__in, sections__in, category__in,
                level__in: LEVELS,
                answer_type__in: ANSWER_TYPES
            };
            const initialValues: GenericObject = (store.getState() as IRootState).app.routeDetails.queryParams || {};
            this.filters = mapFilters(questionsFilters, optionsCollection, initialValues);
        });
    }

    public static get styles(): CSSResult[] {
        return [elevationStyles];
    }
}
