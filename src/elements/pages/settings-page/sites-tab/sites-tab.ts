import { RunGlobalLoading, StopGlobalLoading } from '../../../redux-store/actions/global-loading.actions';
import { loadSiteLocations } from '../../../redux-store/effects/load-site-specific-locations.effect';

class SitesTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.CommonMethods,
    FMMixins.ReduxMixin,
    FMMixins.RouteHelperMixin], Polymer.Element) {

    public static get is() { return 'sites-tab'; }

    public static get properties() {
        return {
            sites: {
                type: Object,
                value: () => []
            },
            count: Number
        };
    }

    public connectedCallback() {
        super.connectedCallback();
        this.sitesSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'specificLocations'),
            (sites: IStatedListData<Site> | undefined) => {
                if (!sites) { return; }
                this.sites = this.regroupSitesByParent(sites.results || []);
                this.count = sites.count || 0;
            });

        this.dispatchOnStore(new RunGlobalLoading({type: 'specificLocations', message: 'Loading Data...'}));
        this.dispatchOnStore(loadSiteLocations())
            .then(() => this.dispatchOnStore(new StopGlobalLoading({type: 'specificLocations'})));
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.sitesSubscriber();
    }

    public getActiveClass(isActive: boolean): string {
        return isActive ? 'active' : '';
    }

    public getAdminLevel(level: number | null): string {
        return _.isNumber(level) ? `Admin ${level}` : '';
    }

    private regroupSitesByParent(sites: Site[]): IGroupedSites[] {
        return _(sites)
            .groupBy((site: Site) => site.parent.id)
            .map((groupedSites: Site[]) => {
                const parent = groupedSites[0].parent;
                return {...parent, sites: groupedSites};
            })
            .sortBy('name')
            .value();
    }
}

customElements.define(SitesTab.is, SitesTab);
