import { customElement, LitElement, property, TemplateResult } from 'lit-element';
import { Unsubscribe } from 'redux';
import { store } from '../../../../../redux/store';
import { monitoringActivitySelector } from '../../../../../redux/selectors/monitoring-activity.selectors';
import { loadPartnersCoverage } from '../../../../../redux/effects/monitoring-activity.effects';
import { template } from './partnership-tab.tpl';
import { convertPartnersCoverageProgressbarData } from '../../../../utils/progressbar-utils';

enum SortingTypes {
    COMPLETED_SORTING_TYPE = 'COMPLETED_SORTING_TYPE',
    PLANNED_SORTING_TYPE = 'PLANNED_SORTING_TYPE'
}

@customElement('partnership-tab')
export class PartnershipTab extends LitElement {
    @property() public progressbarData!: { headline: string; progressbarData: ProgressBarData }[];
    public readonly sortingOptions: { label: string; value: SortingTypes }[] = [];
    public selectedSortingOption: SortingTypes = SortingTypes.COMPLETED_SORTING_TYPE;
    private readonly partnersCoverageUnsubscribe: Unsubscribe;
    public constructor() {
        super();
        this.sortingOptions.push(
            { label: '% of Completed', value: SortingTypes.COMPLETED_SORTING_TYPE },
            { label: '% of Planned', value: SortingTypes.PLANNED_SORTING_TYPE }
        );
        store.dispatch<AsyncEffect>(loadPartnersCoverage());
        this.partnersCoverageUnsubscribe = store.subscribe(monitoringActivitySelector((monitoringActivityState: IMonitoringActivityState) => {
            this.progressbarData = monitoringActivityState.partnersCoverage.map((item: PartnersCoverage) => {
                return {
                    headline: item.name,
                    progressbarData: convertPartnersCoverageProgressbarData(item)
                };
            });
            // TODO remove
            this.progressbarData.push(
                {
                    headline: 'test1',
                    progressbarData: {
                        additionalCompletedLabelValue: null,
                        additionalPlannedLabelValue: null,
                        completed: 71,
                        completedDivBackgroundColor: '#48B6C2',
                        daysSinceLastVisit: 26,
                        minRequired: 26,
                        planned: 90,
                        progressBarLabelsColor: 'grey'
                    }
                },
                {
                    headline: 'Long text testststsfsfsasdasdsafsdfafeegqweg23gdfbserg4e3g2h24g4eh35hdfbserge4heb',
                    progressbarData: {
                        additionalCompletedLabelValue: null,
                        additionalPlannedLabelValue: null,
                        completed: 52,
                        completedDivBackgroundColor: '#48B6C2',
                        daysSinceLastVisit: 1,
                        minRequired: 98,
                        planned: 100,
                        progressBarLabelsColor: 'grey'
                    }
                },
                {
                    headline: 'Testings 3',
                    progressbarData: {
                        additionalCompletedLabelValue: null,
                        additionalPlannedLabelValue: null,
                        completed: 0,
                        completedDivBackgroundColor: '#48B6C2',
                        daysSinceLastVisit: 2,
                        minRequired: 50,
                        planned: 50,
                        progressBarLabelsColor: 'grey'
                    }
                }
            );
            console.log(this.progressbarData);
        }));
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.partnersCoverageUnsubscribe();
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public onSelectionChange(detail: any): void {
        console.log(detail);
    }
}
