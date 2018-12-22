import { RunGlobalLoading, StopGlobalLoading } from '../../../redux-store/actions/global-loading.actions';
import { loadCpOutputsConfigs } from '../../../redux-store/effects/cp-outputs.effect';
import { loadFullReport } from '../../../redux-store/effects/co-overview.effects';

class CoOverview extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.RouteHelperMixin,
    FMMixins.ReduxMixin], Polymer.Element) {
    public static get is() { return 'co-overview'; }

    public static get properties() {
        return {
            cpOutputConfigs: {
                type: Array,
                value: () => []
            },
            fullReports: {
                type: Object,
                value: () => ({5: {test: 'Hello world'}})
            },
            fullReportLoading: {
                type: Array,
                value: () => []
            }
        };
    }

    public connectedCallback() {
        super.connectedCallback();

        this.cpOutcomeSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'cpOutcomes'], store),
            (cpOutcomes: CpOutcome[]) => { this.cpOutcomes = cpOutcomes || []; });

        this.cpConfigsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'cpOutputsConfigs'], store),
            (cpOConfigs: CpOutputConfig[] | undefined) => {
                if (!cpOConfigs) { return; }
                this.cpOutputConfigs = cpOConfigs.map(
                    (config: CpOutputConfig) => ({...config, name: config.cp_output.name})
                );
            });

        this.fullReportSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['fullReport'], store),
            (fullReport: FullReportData | undefined) => {
                if (!fullReport || !fullReport.id) { return; }
                this.fullReports[fullReport.id] = fullReport;
                this.fullReportLoading = [];
            });
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
    }

    public initStarLoad() {
        this.dispatchOnStore(new RunGlobalLoading({type: 'coOverviewData', message: 'Loading Data...'}));
        this.configsLoadingInProcess = true;
        this.dispatchOnStore(loadCpOutputsConfigs())
            .then(() => {
                this.dispatchOnStore(new StopGlobalLoading({type: 'coOverviewData'}));
                this.configsLoadingInProcess = false;
                this.startLoad();
            });
    }

    public finishLoad() {
        this.filteredConfigs = this.cpOutputConfigs.filter(
            (config: CpOutputConfig) => config.cp_output.parent === R.path(['queryParams', 'cp_outcome'], this));

        const cpOutput = +R.path(['queryParams', 'cp_output'], this);
        const exists = cpOutput && this.filteredConfigs.find(
            (config: CpOutputConfig) => config.cp_output.id === cpOutput);

        if (cpOutput && !exists) {
            this.removeQueryParams('cp_output');
            this.openedConfig = null;
        } else if (cpOutput) {
            this.openCpOutput(cpOutput);
        }
    }

    public filterValueChanged({ detail }: CustomEvent) {
        const { selectedItem } = detail;

        this.updateQueryParams({cp_outcome: selectedItem.id});
        if (!this.configsLoadingInProcess) {
            this.startLoad();
        }
    }

    public toggleDetails({ target }: CustomEvent) {
        const newCpOutputId = +R.path(['dataset', 'configId'], target);
        const oldCpOutputId = +R.path(['queryParams', 'cp_output'], this);
        this.openCpOutput(newCpOutputId, oldCpOutputId);
    }

    public isDetailsOpened(configId: number, openedConfig: number) {
        return +openedConfig === +configId;
    }

    public detailsAreLoaded(id: number) {
        return !!this.fullReports[id];
    }

    public getFullReport(id: number, ...dataPath: string[]) {
        return R.pathOr(null, ['fullReports', id, ...dataPath], this);
    }

    public getCpIndicators(id: number): string[] {
        const indicators = this.getFullReport(id, 'ram_indicators') || [];
        return R.pipe(
            R.map((indicator: RamIndicator) => indicator.ram_indicators),
            R.flatten,
            R.map((indicator: NestedIndicator) => indicator.indicator_name)
        )(indicators);
    }

    public getBackground(index: number) {
        return index % 2 ? 'gray' : '';
    }

    public indicatorsEmpty(id: number): boolean {
        const indicators = this.getCpIndicators(id);
        return !indicators.length;
    }

    private openCpOutput(newCpOutputId: number, oldCpOutputId?: number) {
        if (newCpOutputId === oldCpOutputId) {
            this.removeQueryParams('cp_output');
            this.openedConfig = null;
            return;
        }

        this.openedConfig = newCpOutputId;
        this.updateQueryParams({cp_output: newCpOutputId});
        if (!this.fullReports[newCpOutputId]) {
            this.dispatchOnStore(loadFullReport(newCpOutputId));
        }
    }
}

customElements.define(CoOverview.is, CoOverview);
