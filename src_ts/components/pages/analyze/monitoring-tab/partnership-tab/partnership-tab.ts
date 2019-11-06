import {css, CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {Unsubscribe} from 'redux';
import {store} from '../../../../../redux/store';
import {loadPartnersCoverage} from '../../../../../redux/effects/monitoring-activity.effects';
import {template} from './partnership-tab.tpl';
import {partnersCoverageSelector} from '../../../../../redux/selectors/partners-coverage.selectors';

enum SortingTypes {
  COMPLETED_ASCEND_SORTING_TYPE = 'COMPLETED_ASCEND_SORTING_TYPE',
  COMPLETED_DESCEND_SORTING_TYPE = 'COMPLETED_DESCEND_SORTING_TYPE'
}

@customElement('partnership-tab')
export class PartnershipTab extends LitElement {
  @property() partnersCoverage!: PartnersCoverage[] = [
    {
      id: 2,
      name: 'test partner 2',
      completed_visits: 20,
      planned_visits: 100,
      minimum_required_visits: 30,
      days_since_visit: 3
    },
    {
      id: 1,
      name: 'test partner 1',
      completed_visits: 50,
      planned_visits: 100,
      minimum_required_visits: 20,
      days_since_visit: 0
    },
    {
      id: 3,
      name: 'test partner 3',
      completed_visits: 70,
      planned_visits: 100,
      minimum_required_visits: 100,
      days_since_visit: 123
    }
  ];
  sortingOptions: DefaultDropdownOption<SortingTypes>[] = [
    {display_name: '% of Completed ↑', value: SortingTypes.COMPLETED_ASCEND_SORTING_TYPE},
    {display_name: '% of Completed ↓', value: SortingTypes.COMPLETED_DESCEND_SORTING_TYPE}
  ];
  @property() selectedSortingOption: SortingTypes = SortingTypes.COMPLETED_ASCEND_SORTING_TYPE;
  private readonly partnersCoverageUnsubscribe: Unsubscribe;
  constructor() {
    super();
    store.dispatch<AsyncEffect>(loadPartnersCoverage());
    this.partnersCoverageUnsubscribe = store.subscribe(
      partnersCoverageSelector((partnersCoverage: PartnersCoverage[]) => {
        // this.partnersCoverage = partnersCoverage;
        this.onSelectionChange(this.selectedSortingOption);
      })
    );
  }

  render(): TemplateResult {
    return template.call(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.partnersCoverageUnsubscribe();
  }

  sortProgressBars(a: PartnersCoverage, b: PartnersCoverage): number {
    switch (this.selectedSortingOption) {
      case SortingTypes.COMPLETED_ASCEND_SORTING_TYPE:
        return a.completed_visits - b.completed_visits;
      case SortingTypes.COMPLETED_DESCEND_SORTING_TYPE:
        return b.completed_visits - a.completed_visits;
    }
  }

  onSelectionChange(detail: SortingTypes): void {
    this.selectedSortingOption = detail;
  }

  static get styles(): CSSResult {
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
        background-color: #48b6c2;
      }
      .coverage-legend__mark-required {
        height: 100%;
        width: 0;
        border: 1px solid #ff9044;
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
