import { CSSResult, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { template } from './templates-tab.tpl';
import { elevationStyles } from '../../../styles/lit-styles/elevation-styles';
import { updateQueryParams } from '../../../../routing/routes';
import { INTERVENTION, LEVELS, OUTPUT, PARTNER } from '../../settings/questions-tab/questions-tab.filters';
import { Unsubscribe } from 'redux';
import { store } from '../../../../redux/store';
import { routeDetailsSelector } from '../../../../redux/selectors/app.selectors';
import { debounce } from '../../../utils/debouncer';
import { fireEvent } from '../../../utils/fire-custom-event';
import { loadQuestionTemplates } from '../../../../redux/effects/templates.effects';
import { questionTemplatesListData } from '../../../../redux/selectors/templates.selectors';

const AllowedLevels: Set<string> = new Set([PARTNER, OUTPUT, INTERVENTION]);

@customElement('templates-tab')
export class TemplatesTabComponent extends LitElement {
    @property() public questionTemplatesList: IQuestionTemplate[] = [];
    @property() public queryParams: IRouteQueryParam | null = null;
    @property() public listLoadingInProcess: boolean = false;
    public count: number = 0;

    private readonly routeDetailsUnsubscribe: Unsubscribe;
    private readonly questionTemplatesDataUnsubscribe: Unsubscribe;
    private readonly debouncedLoading: Callback;

    public constructor() {
        super();

        // List loading request
        this.debouncedLoading = debounce((params: IRouteQueryParam) => {
            const { level, target } = params;
            const refactoredParams: IRouteQueryParam = Object.entries(params)
                .filter(([paramName]: [string, string]) => paramName !== 'level' && paramName !== 'target')
                .reduce((newParams: IRouteQueryParams, [name, value]: [string, any]) => ({ ...newParams, [name]: value }), {});

            this.listLoadingInProcess = true;
            store.dispatch<AsyncEffect>(loadQuestionTemplates(refactoredParams, level, target))
                .catch(() => fireEvent(this, 'toast', { text: 'Can not load Question Templates List' }))
                .then(() => this.listLoadingInProcess = false);
        }, 100);

        // route params listener
        this.routeDetailsUnsubscribe = store.subscribe(routeDetailsSelector((details: IRouteDetails) => this.onRouteChange(details), false));
        const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
        this.onRouteChange(currentRoute);

        this.questionTemplatesDataUnsubscribe = store.subscribe(questionTemplatesListData((data: IListData<IQuestionTemplate> | null) => {
            if (!data) { return; }
            this.count = data.count;
            this.questionTemplatesList = data.results;
        }));
    }
    public render(): TemplateResult {
        return template.call(this);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.routeDetailsUnsubscribe();
        this.questionTemplatesDataUnsubscribe();
    }

    public onLevelChanged(level: string): void {
        if (this.queryParams && this.queryParams.level === level) { return; }
        updateQueryParams({ level });
    }

    public changePageParam(newValue: string | number, paramName: string): void {
        const currentValue: number | string = this.queryParams && this.queryParams[paramName] || 0;
        if (+newValue === +currentValue) { return; }
        updateQueryParams({ [paramName]: newValue });
    }

    private onRouteChange({ routeName, subRouteName, queryParams }: IRouteDetails): void {
        if (routeName !== 'plan' || subRouteName !== 'templates') { return; }

        const paramsAreValid: boolean = this.checkParams(queryParams);
        if (paramsAreValid) {
            this.queryParams = queryParams;
            this.debouncedLoading(this.queryParams);
        }
    }

    private checkParams(params?: IRouteQueryParams | null): boolean {
        const invalid: boolean = !params || !params.page || !params.page_size;
        const levelInvalid: boolean = !params || !params.level || !AllowedLevels.has(params.level);
        if (invalid || levelInvalid) {
            const { page = 1, page_size = 10, level = LEVELS[0].value } = params || {};
            updateQueryParams({ page, page_size, level });
        }
        return !invalid;
    }

    public static get styles(): CSSResult[] {
        return [elevationStyles];
    }

}
