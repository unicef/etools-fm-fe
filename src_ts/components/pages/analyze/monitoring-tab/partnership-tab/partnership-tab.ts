import { css, CSSResult, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { Unsubscribe } from 'redux';
import { store } from '../../../../../redux/store';
import { loadPartnersCoverage } from '../../../../../redux/effects/monitoring-activity.effects';
import { template } from './partnership-tab.tpl';
import { partnersCoverageSelector } from '../../../../../redux/selectors/partners-coverage.selectors';

enum SortingTypes {
    COMPLETED_ASCEND_SORTING_TYPE = 'COMPLETED_ASCEND_SORTING_TYPE',
    COMPLETED_DESCEND_SORTING_TYPE = 'COMPLETED_DESCEND_SORTING_TYPE'
}

@customElement('partnership-tab')
export class PartnershipTab extends LitElement {
    @property() public partnersCoverage!: PartnersCoverage[];
    public readonly sortingOptions: DefaultDropdownOption<SortingTypes>[] = [
        { display_name: '% of Completed ↑', value: SortingTypes.COMPLETED_ASCEND_SORTING_TYPE },
        { display_name: '% of Completed ↓', value: SortingTypes.COMPLETED_DESCEND_SORTING_TYPE }
    ];
    @property() public selectedSortingOption: SortingTypes = SortingTypes.COMPLETED_ASCEND_SORTING_TYPE;
    private readonly partnersCoverageUnsubscribe: Unsubscribe;
    public constructor() {
        super();
        store.dispatch<AsyncEffect>(loadPartnersCoverage());
        this.partnersCoverageUnsubscribe = store.subscribe(partnersCoverageSelector((partnersCoverage: PartnersCoverage[]) => {
            this.partnersCoverage = partnersCoverage;
            this.onSelectionChange(this.selectedSortingOption);
        }));
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.partnersCoverageUnsubscribe();
    }

    public sortProgressBars(a: PartnersCoverage, b: PartnersCoverage): number {
        switch (this.selectedSortingOption) {
            case SortingTypes.COMPLETED_ASCEND_SORTING_TYPE:
                return a.completed_visits - b.completed_visits;
            case SortingTypes.COMPLETED_DESCEND_SORTING_TYPE:
                return b.completed_visits - a.completed_visits;
        }
    }

    public onSelectionChange(detail: SortingTypes): void {
        this.selectedSortingOption = detail;
    }

    public static get styles(): CSSResult {
        return css`
            .partner-coverage {
                display: flex;
                flex-direction: column;
                padding: 1%;
            }
            .partner-coverage__header {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 2%;
            }
            .partner-coverage__header-item {
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex-basis: 50%;
            }
            .coverage-legend {
                display: flex;
                justify-content: space-evenly;
            }
            .coverage-legend__mark {
                width: 16px;
                height: 16px;
                display: flex;
                justify-content: center;
            }
            .coverage-legend__mark-completed {
                background-color: #48B6C2;
            }
            .coverage-legend__mark-required {
                height: 100%;
                width: 0;
                border: 1px solid #FF9044;
            }
            .coverage-legend__label {
                flex-basis: 90%;
            }
            .progressbar-container {
                margin-bottom: 2%;
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
            }
            .progressbar-container__header {
                font-style: normal;
                font-weight: normal;
                font-size: 16px;
                line-height: 36px;
                color: grey;
            }
        `;
    }
}
