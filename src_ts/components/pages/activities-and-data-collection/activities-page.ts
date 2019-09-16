import { CSSResult, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { template } from './activities-page.tpl';
import { elevationStyles } from '../../styles/lit-styles/elevation-styles';
import { addTranslates, ENGLISH } from '../../../localization/localisation';
import { ACTIVITIES_LIST_TRANSLATES } from '../../../localization/en/activities-and-data-collection/activities-list.translates';
import { Unsubscribe } from 'redux';
import { store } from '../../../redux/store';
import { routeDetailsSelector } from '../../../redux/selectors/app.selectors';
import { updateQueryParams } from '../../../routing/routes';
import { debounce } from '../../utils/debouncer';
import { fireEvent } from '../../utils/fire-custom-event';
import { loadActivitiesList } from '../../../redux/effects/activities.effects';
import { activities } from '../../../redux/reducers/activities.reducer';
import { activitiesListData } from '../../../redux/selectors/activities.selectors';

addTranslates(ENGLISH, [ACTIVITIES_LIST_TRANSLATES]);
store.addReducers({ activities });

@customElement('activities-page')
export class ActivitiesPageComponent extends LitElement {
    @property() public loadingInProcess: boolean = false;
    @property() public queryParams: IRouteQueryParam | null = null;
    public activitiesList: IListActivity[] = [];
    public count: number = 0;

    private readonly routeDetailsUnsubscribe: Unsubscribe;
    private readonly activitiesDataUnsubscribe: Unsubscribe;
    private readonly debouncedLoading: Callback;

    public constructor() {
        super();
        // List loading request
        this.debouncedLoading = debounce((params: IRouteQueryParam) => {
            this.loadingInProcess = true;
            store.dispatch<AsyncEffect>(loadActivitiesList(params))
                .catch(() => fireEvent(this, 'toast', { text: 'Can not load Activities List' }))
                .then(() => this.loadingInProcess = false);
        }, 100);

        // route params listener
        this.routeDetailsUnsubscribe = store.subscribe(routeDetailsSelector((details: IRouteDetails) => this.onRouteChange(details), false));
        const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
        this.onRouteChange(currentRoute);

        this.activitiesDataUnsubscribe = store.subscribe(activitiesListData((data: IListData<IListActivity> | null) => {
            if (!data) { return; }
            this.count = data.count;
            this.activitiesList = data.results;
        }, false));
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.routeDetailsUnsubscribe();
        this.activitiesDataUnsubscribe();
    }

    public changePageParam(newValue: string | number, paramName: string): void {
        const currentValue: number | string = this.queryParams && this.queryParams[paramName] || 0;
        if (+newValue === +currentValue) { return; }
        const newParams: IRouteQueryParams = { [paramName]: newValue };
        if (paramName === 'page_size') { newParams.page = 1; }
        updateQueryParams({ [paramName]: newValue });
    }

    private onRouteChange({ routeName, queryParams }: IRouteDetails): void {
        if (routeName !== 'activities') { return; }

        const paramsAreValid: boolean = this.checkParams(queryParams);
        if (paramsAreValid) {
            this.queryParams = queryParams;
            this.debouncedLoading(this.queryParams);
        }
    }

    private checkParams(params?: IRouteQueryParams | null): boolean {
        const invalid: boolean = !params || !params.page || !params.page_size;
        if (invalid) {
            const { page = 1, page_size = 10 } = params || {};
            updateQueryParams({ page, page_size });
        }
        return !invalid;
    }

    public static get styles(): CSSResult[] {
        return [elevationStyles];
    }
}
