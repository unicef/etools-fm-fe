import { customElement, LitElement, property, TemplateResult } from 'lit-element';
import { Unsubscribe } from 'redux';
import { store } from '../../../../../redux/store';
import { monitoringActivitySelector } from '../../../../../redux/selectors/monitoring-activity.selectors';
import { loadPartnersCoverage } from '../../../../../redux/effects/monitoring-activity.effects';
import { template } from './partnership-tab.tpl';
import { convertPartnersCoverageProgressbarData } from '../../../../utils/progressbar-utils';

enum SortingTypes {
    COMPLETED_ASCEND_SORTING_TYPE = 'COMPLETED_ASCEND_SORTING_TYPE',
    COMPLETED_DESCEND_SORTING_TYPE = 'COMPLETED_DESCEND_SORTING_TYPE'
}

@customElement('partnership-tab')
export class PartnershipTab extends LitElement {
    @property() public progressbarData!: { headline: string; progressbarData: ProgressBarData }[];
    public readonly sortingOptions: { label: string; value: SortingTypes }[] = [];
    public selectedSortingOption: SortingTypes = SortingTypes.COMPLETED_ASCEND_SORTING_TYPE;
    private readonly partnersCoverageUnsubscribe: Unsubscribe;
    public constructor() {
        super();
        this.sortingOptions.push(
            { label: '% of Completed ascend', value: SortingTypes.COMPLETED_ASCEND_SORTING_TYPE },
            { label: '% of Completed descend', value: SortingTypes.COMPLETED_DESCEND_SORTING_TYPE }
        );
        store.dispatch<AsyncEffect>(loadPartnersCoverage());
        this.partnersCoverageUnsubscribe = store.subscribe(monitoringActivitySelector((monitoringActivityState: IMonitoringActivityState) => {
            this.progressbarData = monitoringActivityState.partnersCoverage.map((item: PartnersCoverage) => {
                return {
                    headline: item.name,
                    progressbarData: convertPartnersCoverageProgressbarData(item)
                };
            });

            this.onSelectionChange(this.selectedSortingOption);
        }));
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.partnersCoverageUnsubscribe();
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    // Fixme: Should it pass Redux state management instead of direct mutation?
    public async onSelectionChange(detail: any): Promise<void> {
        switch (detail) {
            case SortingTypes.COMPLETED_ASCEND_SORTING_TYPE: this.progressbarData.sort((a: ProgressBarDataWithHeadline, b: ProgressBarDataWithHeadline): number => a.progressbarData.completed - b.progressbarData.completed); break;
            case SortingTypes.COMPLETED_DESCEND_SORTING_TYPE: this.progressbarData.sort((a: ProgressBarDataWithHeadline, b: ProgressBarDataWithHeadline): number => b.progressbarData.completed - a.progressbarData.completed); break;
        }
        await this.requestUpdate();
    }
}
