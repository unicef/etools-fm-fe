import {CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {Unsubscribe} from 'redux';
import {store} from '../../../../../../redux/store';
import {loadPartnersCoverage} from '../../../../../../redux/effects/monitoring-activity.effects';
import {template} from './partnership-tab.tpl';
import {partnersCoverageSelector} from '../../../../../../redux/selectors/monitoring-activities.selectors';
import {partnershipTabStyles} from './partnership-tab.styles';

enum SortingTypes {
  COMPLETED_ASCEND_SORTING_TYPE = 'COMPLETED_ASCEND_SORTING_TYPE',
  COMPLETED_DESCEND_SORTING_TYPE = 'COMPLETED_DESCEND_SORTING_TYPE'
}

@customElement('partnership-tab')
export class PartnershipTab extends LitElement {
  @property() partnersCoverage!: PartnersCoverage[];
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
        this.partnersCoverage = partnersCoverage;
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
    return partnershipTabStyles;
  }
}
