import { loadVisitsList } from '../../../redux-store/effects/visits.effects';
type Filter = {
    name: string;
    query: string;
};

class VisitsList extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.RouteHelperMixin,
    FMMixins.ReduxMixin], Polymer.Element) {
    public static get is() { return 'visits-list'; }

    public static get properties() {
        return {
            count: Number,
            listFilterOptions: {
                type: Object,
                value: () => [{
                    name: 'CP Output',
                    query: 'tasks__cp_output_config'
                }, {
                    name: 'Partner',
                    query: 'tasks__partner'
                }, {
                    name: 'Intervention',
                    query: 'tasks__intervention'
                }]
            }
        };
    }

    public connectedCallback() {
        super.connectedCallback();

        this.addEventListener('sort-changed', this.sort);

        this.visitsListaSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['visitsData', 'list'], store),
            (visits: IListData<Visit>) => {
                this.visits = visits.results || [];
                this.count = visits.count;
            });
    }

    public getInitQueryParams(): QueryParams {
        return {
            page: 1,
            page_size: 10,
            tasks__cp_output_config__in: [],
            tasks__partner__in: [],
            tasks__intervention__in: [],
            location__in: [],
            location_site__in: [],
            status__in: []
        };
    }

    public finishLoad() {
        this._debounceLoadData = Polymer.Debouncer.debounce(this._debounceLoadData,
            Polymer.Async.timeOut.after(100), () => {
                this.dispatchOnStore(loadVisitsList(this.queryParams));
            });
    }

    public getLocationPart(location: string = '', partToSelect: string) {
        const splittedLocation = location.match(/(.*)\s\[(.*)]/i) || [];
        switch (partToSelect) {
            case 'name':
                return splittedLocation[1];
            case 'code':
                return `[${splittedLocation[2]}]`;
            default:
                return location;
        }
    }

    public getIndex(index: number): number {
        return index + 1;
    }

    public getFormattedDate(date: string): string {
        return moment(date).format('DD MMM YYYY');
    }

    public sort({ detail }: CustomEvent) {
        const { field, direction } = detail;
        this.updateQueryParams({ordering: `${direction === 'desc' ? '-' : ''}${field}`});
        this.startLoad();
    }

    public pageNumberChanged({detail}: CustomEvent) {
        this.updateQueryParams({page: detail.value});
        this.startLoad();
    }

    public pageSizeSelected({detail}: CustomEvent) {
        this.updateQueryParams({page_size: detail.value});
        this.startLoad();
    }

    public filterValueChanged({ detail, target }: CustomEvent) {
        const { selectedItems } = detail;
        const property = R.path(['dataset', 'property'], target);
        if (!property) { throw new Error('Filter must contain data property attribute'); }

        if (selectedItems) {
            const values = selectedItems.map((item: any) => item.id);
            this.updateQueryParams({page: 1, [property]: values});
        } else {
            this.updateQueryParams({page: 1, [property]: []});
        }
        this.startLoad();
    }

    public selectFilter({ model }: EventModel<Filter>) {
        const { item } = model;
        const index = this.listFilterOptions.findIndex((filter: Filter) => filter.query === item.query);
        const currentState = this.get(`listFilterOptions.${index}.selected`);
        this.set(`listFilterOptions.${index}.selected`, !currentState);
    }

}

customElements.define(VisitsList.is, VisitsList);
