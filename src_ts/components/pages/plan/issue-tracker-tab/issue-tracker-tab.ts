import { CSSResultArray, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { debounce } from '../../../utils/debouncer';
import { store } from '../../../../redux/store';
import { routeDetailsSelector } from '../../../../redux/selectors/app.selectors';
import { Unsubscribe } from 'redux';
import { updateQueryParams } from '../../../../routing/routes';
import { requestLogIssue } from '../../../../redux/effects/issue-tracker.effects';

import { IEtoolsFilter } from '../../../common/layout/filters/etools-filters';
import { elevationStyles } from '../../../styles/elevation-styles';
import { template } from './issue-tracker-tab.tpl';
import { issueTrackerData } from '../../../../redux/selectors/issue-tracker.selectors';
import { loadSiteLocations } from '../../../../redux/effects/site-specific-locations.effects';
import { sitesSelector } from '../../../../redux/selectors/site-specific-locations.selectors';
import { locationsInvert } from '../../settings/sites-tab/locations-invert';
import { loadStaticData } from '../../../../redux/effects/load-static-data.effect';
import { outputsDataSelector, partnersDataSelector } from '../../../../redux/selectors/static-data.selectors';
import { IDialogResponse, openDialog } from '../../../utils/dialog';
import '../issue-tracker-popup/issue-tracker-popup';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { CardStyles } from '../../../styles/card-styles';
import { IssueTrackerTabStyles } from './issue-tracker-tab.styles';
import { SharedStyles } from '../../../styles/shared-styles';

export const ISSUE_STATUSES: DefaultDropdownOption<string>[] = [
    { value: 'new', display_name: 'New' },
    { value: 'past', display_name: 'Past' }
];

@customElement('issue-tracker-tab')
export class IssueTrackerTabComponent extends LitElement {

    @property()
    public filters: IEtoolsFilter[] | null = [];

    @property({ type: Number })
    public count: number = 0;

    @property({ type: Array })
    public logIssues: LogIssue[] = [];

    @property({ type: Array })
    public outputs: EtoolsCpOutput[] = [];

    @property({ type: Array })
    public partners: EtoolsPartner[] = [];

    @property({ type: Array })
    public locations: IGroupedSites[] = [];

    public queryParams: GenericObject | null = null;
    private readonly debouncedLoading: Callback;

    private routeUnsubscribe!: Unsubscribe;
    private issueTrackerDataUnsubscribe!: Unsubscribe;
    private sitesUnsubscribe!: Unsubscribe;
    private outputsUnsubscribe!: Unsubscribe;
    private partnersUnsubscribe!: Unsubscribe;

    public constructor() {
        super();
        this.debouncedLoading = debounce((params: IRouteQueryParam) => {
            // this.dispatchOnStore(new RunGlobalLoading({type: 'specificLocations', message: 'Loading Data...'}));
            store.dispatch<AsyncEffect>(requestLogIssue(params));
            // .then(() => this.dispatchOnStore(new StopGlobalLoading({type: 'specificLocations'})));
        }, 100);
        const state: IRootState = store.getState();
        if (!state.specificLocations.data) {
            store.dispatch<AsyncEffect>(loadSiteLocations());
        }
        this.loadStaticData();
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.routeUnsubscribe = store.subscribe(routeDetailsSelector((details: IRouteDetails) => {
            return this.onRouteChange(details);
        }, false));
        this.issueTrackerDataUnsubscribe = store.subscribe(issueTrackerData((data: IListData<LogIssue> | null) => {
            if (!data) { return; }
            this.count = data.count;
            this.logIssues = data.results;
        }));
        this.sitesUnsubscribe = store.subscribe(sitesSelector((sites: Site[] | null) => {
            if (!sites) { return; }
            this.locations = locationsInvert(sites);
        }));
        this.outputsUnsubscribe = store.subscribe(outputsDataSelector((outputs: EtoolsCpOutput[] | undefined) => {
            if (!outputs) { return; }
            this.outputs = outputs;
        }));
        this.partnersUnsubscribe = store.subscribe(partnersDataSelector((partners: EtoolsPartner[] | undefined) => {
            if (!partners) { return; }
            this.partners = partners;
        }));
        const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
        this.onRouteChange(currentRoute);
        this.addEventListener('sort-changed', ((event: CustomEvent<SortDetails>) => this.changeSort(event.detail)) as any);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.routeUnsubscribe();
        this.issueTrackerDataUnsubscribe();
        this.sitesUnsubscribe();
        this.outputsUnsubscribe();
        this.partnersUnsubscribe();
    }

    public onRouteChange({ routeName, subRouteName, queryParams }: IRouteDetails): void {
        if (routeName !== 'plan' || subRouteName !== 'issue-tracker') { return; }

        const paramsAreValid: boolean = this.checkParams(queryParams);
        if (paramsAreValid) {
            this.queryParams = queryParams;
            this.debouncedLoading(this.queryParams);
        }
    }

    public checkParams(params?: IRouteQueryParams | null): boolean {
        const invalid: boolean = !params || !params.page || !params.page_size;
        if (invalid) {
            updateQueryParams({ page: 1, page_size: 10 });
        }
        return !invalid;
    }

    public getName(item: LogIssue): string {
        return item.partner ? item.partner.name :
               item.location && item.location_site ? `${item.location.name} - ${item.location_site.name}` :
               item.cp_output ? item.cp_output.name : '';
    }

    public openViewDialog(issue?: LogIssue): void {
        openDialog<LogIssue | undefined>({
            dialog: 'issue-tracker-popup',
            data: issue,
            readonly: true
        }).then(() => {});
    }

    public isAllowEdit(logIssue: LogIssue): boolean {
        // todo permission
        return !!logIssue;
    }

    public openLogIssue(issue?: LogIssue): void {
        openDialog<LogIssue | undefined>({
            dialog: 'issue-tracker-popup',
            data: issue
        }).then(({ confirmed }: IDialogResponse<any>) => {
            if (!confirmed) { return; }
            if (!issue) {
                updateQueryParams({ page: 1 });
            }
            const currentParams: IRouteQueryParams | null = store.getState().app.routeDetails.queryParams;
            store.dispatch<AsyncEffect>(requestLogIssue(currentParams || {}));
        });
    }

    public pageNumberChanged({ detail }: CustomEvent): void {
        // prevent updating during initialization
        if (!this.logIssues) { return; }
        const newValue: string | number = detail.value;
        const currentValue: number | string = this.queryParams && this.queryParams.page || 0;
        if (+newValue === +currentValue) { return; }
        updateQueryParams({ page: detail.value });
        // this.refreshData();
    }

    public changePageParam(newValue: string | number, paramName: string): void {
        const currentValue: number | string = this.queryParams && this.queryParams[paramName] || 0;
        if (+newValue === +currentValue) { return; }
        updateQueryParams({ [paramName]: newValue });
    }

    public changeSort({ field, direction }: SortDetails): void {
        updateQueryParams({ ordering: `${ direction === 'desc' ? '-' : '' }${ field }` });
    }

    public pageSizeSelected({ detail }: CustomEvent): void {
        // prevent updating during initialization
        if (!this.logIssues) { return; }
        const newValue: string | number = detail.value;
        const currentValue: number | string = this.queryParams && this.queryParams.page_size || 0;
        if (+newValue === +currentValue) { return; }
        updateQueryParams({ page_size: detail.value });
        // this.refreshData();
    }

    public get tableInformation(): TableInformation {
        const { page, page_size }: GenericObject = this.queryParams || {};
        const notEnoughData: boolean = !page_size || !page || !this.count || !this.logIssues;
        const end: number = notEnoughData ? 0 : Math.min(page * page_size, this.count);
        const start: number = notEnoughData ? 0 : end - this.logIssues.length + 1;
        return { start, end, count: this.count };
    }

    public static get styles(): CSSResultArray {
        return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, IssueTrackerTabStyles];
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public loadStaticData(): void {
        const data: IStaticDataState = (store.getState() as IRootState).staticData;
        if (!data.outputs) {
            store.dispatch<AsyncEffect>(loadStaticData('outputs'));
        }
        if (!data.partners) {
            store.dispatch<AsyncEffect>(loadStaticData('partners'));
        }
    }

    public onOutputsChanged(items: EtoolsCpOutput[]): void {
        const currentValue: number[] = this.queryParams && this.queryParams.cp_output__in || [];
        const ids: number[] = items.length > 0 ? items.map((item: EtoolsCpOutput) => (item.id)) : [];
        if (JSON.stringify(currentValue) === JSON.stringify(ids)) { return; }
        updateQueryParams({ cp_output__in: ids });
    }

    public onPartnersChanged(items: EtoolsPartner[]): void {
        const currentValue: number[] = this.queryParams && this.queryParams.partner__in || [];
        const ids: number[] = items.length > 0 ? items.map((item: EtoolsPartner) => (item.id)) : [];
        if (JSON.stringify(currentValue) === JSON.stringify(ids)) { return; }
        updateQueryParams({ partner__in: ids });
    }

    public onLocationsChanged(items: IGroupedSites[]): void {
        const currentValue: string[] = this.queryParams && this.queryParams.location__in || [];
        const ids: string[] = items.length > 0 ? items.map((item: IGroupedSites) => (item.id)) : [];
        if (JSON.stringify(currentValue) === JSON.stringify(ids)) { return; }
        updateQueryParams({ location__in: ids });
    }

    public changeShowOnlyNew(value: boolean): void {
        if (value === undefined ) { return; }
        if (value) {
            updateQueryParams({ status: 'new' });
        } else {
            updateQueryParams({ status: null });
        }
    }
}
