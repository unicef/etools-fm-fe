import { CSSResult, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { CP_OUTCOMES_ENDPOINT, CP_OUTPUTS } from '../../../../endpoints/endpoints-list';
import { updateQueryParams } from '../../../../routing/routes';
import { fireEvent } from '../../../utils/fire-custom-event';
import { debounce } from '../../../utils/debouncer';

import { cpOutcomeDataSelector, outputsDataSelector } from '../../../../redux/selectors/static-data.selectors';
import { fullReportSelector } from '../../../../redux/selectors/co-overview.selectors';
import { loadStaticData } from '../../../../redux/effects/load-static-data.effect';
import { routeDetailsSelector } from '../../../../redux/selectors/app.selectors';
import { loadFullReport } from '../../../../redux/effects/co-overview.effects';
import { fullReport } from '../../../../redux/reducers/co-overview.reducer';
import { store } from '../../../../redux/store';
import { Unsubscribe } from 'redux';

import { CoOverviewTabStyles } from './co-overview-tab.styles';
import { template } from './co-overview-tab.tpl';

import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { elevationStyles } from '../../../styles/elevation-styles';
import { leafletStyles } from '../../../styles/leaflet-styles';
import { SharedStyles } from '../../../styles/shared-styles';
import { CardStyles } from '../../../styles/card-styles';

store.addReducers({ fullReport });

@customElement('co-overview-tab')
export class CoOverviewTabComponent extends LitElement {

    @property()
    public queryParams: GenericObject | null = null;

    @property({ type: Array })
    public cpOutcomes: CpOutcome[] = [];

    @property({ type: Array })
    public filteredCpOutputs: EtoolsCpOutput[] = [];

    @property({ type: Object })
    public fullReports: GenericObject<FullReportData> = {};

    private cpOutputs: EtoolsCpOutput[] = [];
    private readonly debouncedLoading: Callback;
    private routeUnsubscribe!: Unsubscribe;
    private cpOutcomeUnsubscribe!: Unsubscribe;
    private cpOutputUnsubscribe!: Unsubscribe;
    private fullReportUnsubscribe!: Unsubscribe;

    public constructor() {
        super();
        this.debouncedLoading = debounce((fullReportId: number) => {
            store.dispatch<AsyncEffect>(loadFullReport(fullReportId))
                .catch(() => fireEvent(this, 'toast', { text: 'Can not load FullReport data' }))
                .then();
        }, 100);
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.routeUnsubscribe = store.subscribe(routeDetailsSelector((details: IRouteDetails) =>
            this.onRouteChange(details), false)
        );
        this.cpOutcomeUnsubscribe = store.subscribe(cpOutcomeDataSelector((cpOutcome: EtoolsCpOutcome[] | undefined) => {
            if (!cpOutcome) { return; }
            this.cpOutcomes = cpOutcome.map((item: EtoolsCpOutcome) => ({
                id: +item.id,
                name: item.name
            }));
        }));
        this.cpOutputUnsubscribe = store.subscribe(outputsDataSelector((outputs: EtoolsCpOutput[] | undefined) => {
            if (!outputs) { return; }
            this.cpOutputs = outputs;
            this.refreshData();
        }));
        this.fullReportUnsubscribe = store.subscribe(fullReportSelector((newFullReport: any | null) => {
            if (!newFullReport || !newFullReport.id) { return; }
            this.fullReports = {
                ...this.fullReports,
                [newFullReport.id]: newFullReport
            };
        }));

        const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
        this.onRouteChange(currentRoute);
        this.loadStaticData();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.routeUnsubscribe();
        this.cpOutcomeUnsubscribe();
        this.cpOutputUnsubscribe();
        this.fullReportUnsubscribe();
    }

    public filterValueChanged(selectedItem: CpOutcome | null): void {
        const id: number | null = selectedItem && +selectedItem.id;
        const currentTarget: number | null = this.queryParams && +this.queryParams.cp_outcome || null;
        if (!id || currentTarget === id) {
            return;
        }
        updateQueryParams({ cp_outcome: id });
    }

    public toggleDetails(newCpOutputId: number): void {
        const oldCpOutputId: number | null = this.queryParams && +this.queryParams.cp_output || null;
        if (oldCpOutputId === newCpOutputId) {
            updateQueryParams({ cp_output: null });
            return;
        }
        updateQueryParams({ cp_output: newCpOutputId });
    }

    private onRouteChange({ routeName, subRouteName, queryParams }: IRouteDetails): void {
        if (routeName !== 'analyze' || subRouteName !== 'country-overview') { return; }

        if (queryParams) {
            this.queryParams = queryParams;
        }
        const fullReportId: number | null = this.queryParams && +this.queryParams.cp_output || null;
        if (typeof fullReportId === 'number' && !this.fullReports[fullReportId]) {
            this.debouncedLoading(fullReportId);
        }

        this.refreshData();
    }

    private refreshData(): void {
        if (!this.cpOutputs || !this.cpOutputs.length) { return; }

        const cpOutcome: number | null = this.queryParams && +this.queryParams.cp_outcome || null;

        if (cpOutcome) {
            this.filteredCpOutputs = this.cpOutputs.filter((cpOutput: EtoolsCpOutput) => cpOutput.parent === cpOutcome);
        }

        const currentCpOutput: number | null = this.queryParams && +this.queryParams.cp_output || null;
        const exists: boolean = !!this.filteredCpOutputs.find((filteredCpOutoput: EtoolsCpOutput) => filteredCpOutoput.id === currentCpOutput);

        if (!exists) {
            updateQueryParams({ cp_output: null });
        } else if (currentCpOutput && !this.fullReports[currentCpOutput]) {
            this.debouncedLoading(currentCpOutput);
        }
    }

    private loadStaticData(): void {
        const data: IStaticDataState = (store.getState() as IRootState).staticData;
        if (!data.outputs) {
            store.dispatch<AsyncEffect>(loadStaticData(CP_OUTCOMES_ENDPOINT));
        }
        if (!data.outputs) {
            store.dispatch<AsyncEffect>(loadStaticData(CP_OUTPUTS));
        }
    }

    public static get styles(): CSSResult[] {
        return [
            CoOverviewTabStyles,
            elevationStyles,
            SharedStyles,
            pageLayoutStyles,
            FlexLayoutClasses,
            CardStyles,
            leafletStyles
        ];
    }
}
