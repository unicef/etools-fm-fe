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
import { ROOT_PATH } from '../../../config/config';
import { ACTIVITY_STATUSES, ACTIVITY_TYPES } from '../../common/dropdown-options';
import { IEtoolsFilter } from '../../common/layout/filters/etools-filters';
import { loadStaticData } from '../../../redux/effects/load-static-data.effect';
import { mapFilters } from '../../utils/filters-mapping';
import { activitiesListFilters } from './activities-page.filters';

addTranslates(ENGLISH, [ACTIVITIES_LIST_TRANSLATES]);
store.addReducers({ activities });

@customElement('activities-page')
export class ActivitiesPageComponent extends LitElement {
    @property() public loadingInProcess: boolean = false;
    @property() public queryParams: IRouteQueryParam | null = null;
    @property() public rootPath: string = ROOT_PATH;
    @property() public filters: IEtoolsFilter[] | null = null;
    public activitiesList: IListActivity[] = [];
    public count: number = 0;

    public activityTypes: DefaultDropdownOption<string>[] = ACTIVITY_TYPES;
    public activityStatuses: DefaultDropdownOption<string>[] = ACTIVITY_STATUSES;

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

        this.initFilters();
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

    public formatDate(date: string | null): string {
        return date ? moment(date).format('DD MMM YYYY') : '-';
    }

    public serializeName(
        id: number | string,
        collection: GenericObject[],
        labelField: string = 'name',
        valueField: string = 'id'
    ): string {
        if (!id || !collection) { return ''; }
        const item: GenericObject | undefined = collection.find((collectionItem: GenericObject) => `${ collectionItem[valueField] }` === `${ id }`);
        return item ? item[labelField] : '';
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

    private initFilters(): void {
        const storeState: IRootState = store.getState();
        const { locations, partners, interventions, outputs, users } = storeState.staticData;
        // const sites: Site[] | null = storeState.specificLocations &&
        //     storeState.specificLocations.data && storeState.specificLocations.data.results;

        const partnersPromise: Promise<EtoolsPartner[]> = partners ? Promise.resolve(partners) : store.dispatch<AsyncEffect>(loadStaticData('partners'));
        const outputsPromise: Promise<EtoolsCpOutput[]> = outputs ? Promise.resolve(outputs) : store.dispatch<AsyncEffect>(loadStaticData('outputs'));
        const interventionsPromise: Promise<EtoolsIntervention[]> = interventions ? Promise.resolve(interventions) : store.dispatch<AsyncEffect>(loadStaticData('interventions'));
        const locationsPromise: Promise<any[]> = locations ? Promise.resolve(locations) : store.dispatch<AsyncEffect>(loadStaticData('locations'));
        const usersPromise: Promise<User[]> = users ? Promise.resolve(users) : store.dispatch<AsyncEffect>(loadStaticData('users'));

        Promise
            .all([partnersPromise, outputsPromise, interventionsPromise, locationsPromise, usersPromise])
            .then(([partners__in, cp_outputs__in, interventions__in, location__in, usersData]: any) => {
                const optionsCollection: GenericObject = {
                    partners__in, cp_outputs__in, interventions__in, location__in,
                    activity_type: ACTIVITY_TYPES,
                    status__in: ACTIVITY_STATUSES,
                    team_members__in: usersData,
                    person_responsible__in: usersData
                };
                const initialValues: GenericObject = store.getState().app.routeDetails.queryParams || {};
                this.filters = mapFilters(activitiesListFilters, optionsCollection, initialValues);
            });
    }

    public static get styles(): CSSResult[] {
        return [elevationStyles];
    }
}
