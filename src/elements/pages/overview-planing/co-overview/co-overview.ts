import { RunGlobalLoading, StopGlobalLoading } from '../../../redux-store/actions/global-loading.actions';
import { loadCpOutputsConfigs } from '../../../redux-store/effects/cp-outputs.effect';

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
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
    }

    public initStarLoad() {
        this.dispatchOnStore(new RunGlobalLoading({type: 'coOverviewData', message: 'Loading Data...'}));
        this.dispatchOnStore(loadCpOutputsConfigs())
            .then(() => {
                return new Promise((resolve) => setTimeout(resolve, 2000));
            })
            .then(() => {
                this.dispatchOnStore(new StopGlobalLoading({type: 'coOverviewData'}));
                this.startLoad();
            });
    }

    public finishLoad() {
        console.log('finishLoad');
        if (this.cpOutputConfigs.length) {
            return;
        }
        this.openCpOutput();
    }

    public filterValueChanged({ detail }: CustomEvent) {
        const { selectedItem } = detail;

        console.log('filterValueChanged', selectedItem.id);
        this.updateQueryParams({cp_outcome: selectedItem.id});
        this.startLoad();
    }
}

customElements.define(CoOverview.is, CoOverview);
