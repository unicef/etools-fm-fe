import {css, CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {template} from './geographic-coverage.tpl';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../styles/card-styles';

enum FilterTypes {
  EDUCATION = 'EDUCATION'
}

@customElement('geographic-coverage')
export class GeographicCoverageComponent extends LitElement {
  @property() selectedSortingOption: FilterTypes = FilterTypes.EDUCATION;
  sortingOptions: DefaultDropdownOption<FilterTypes>[] = [{display_name: 'Education', value: FilterTypes.EDUCATION}];

  render(): TemplateResult {
    return template.call(this);
  }

  onSelectionChange(detail: FilterTypes): void {
    this.selectedSortingOption = detail;
  }

  static get styles(): CSSResult[] {
    const monitoringTabStyles: CSSResult = css`
      .monitoring-activity__geographic-coverage {
      }
      .geographic-coverage {
        display: flex;
        flex-direction: column;
        padding: 1%;
      }
      .geographic-coverage__header {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 2%;
      }
      .geographic-coverage__header-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-basis: 50%;
      }
      .coverage-legend-container {
        display: flex;
        flex-wrap: wrap;
        margin-top: 2%;
      }
      .coverage-legend {
        display: flex;
        flex-basis: 40%;
        margin: 1%;
      }
      .coverage-legend__mark {
        min-width: 17px;
        min-height: 17px;
        max-width: 17px;
        max-height: 17px;
        margin-right: 2%;
        display: flex;
        justify-content: center;
      }
      .coverage-legend__mark-no-visits {
        background-color: #ddf1bf;
      }
      .coverage-legend__mark-one-five {
        background-color: #48b6c2;
      }
      .coverage-legend__mark-six-ten {
        background-color: #3f9bbc;
      }
      .coverage-legend__mark-eleven {
        background-color: #273891;
      }
      .coverage-legend__label {
      }
    `;
    return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, monitoringTabStyles];
  }
}
