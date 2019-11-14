import {CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';

import {CpDetailsItemStyles} from './cp-details-item.styles';
import {template} from './cp-details-item.tpl';

import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {leafletStyles} from '../../../../styles/leaflet-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {CardStyles} from '../../../../styles/card-styles';

@customElement('cp-details-item')
export class CpDetailsItem extends LitElement {
  @property({type: Object})
  fullReport!: FullReportData;

  @property({type: Object})
  cpItem!: EtoolsCpOutput;

  @property({type: Object})
  detailsOpened: GenericObject<boolean> = {};

  constructor() {
    super();
  }

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  getBackground(index: number): string {
    return index % 2 ? 'gray' : '';
  }

  toggleDetails(intervention: FullReportIntervention): void {
    const currentValue: boolean = this.detailsOpened[intervention.pk];
    this.detailsOpened = {
      ...this.detailsOpened,
      [intervention.pk]: !currentValue
    };
  }

  getExpectedResults(interventionPk: number, resultLinks: FullReportResultLink[]): string {
    const result: FullReportResultLink | undefined =
      (resultLinks &&
        resultLinks.length &&
        resultLinks.find((link: FullReportResultLink) => link.intervention === interventionPk)) ||
      undefined;

    return (
      (result &&
        result.ll_results
          .map((expectedResult: LowResult, index: number) => `${index + 1}) ${expectedResult.name}`)
          .join('\n')) ||
      '--'
    );
  }

  static get styles(): CSSResult[] {
    return [
      CpDetailsItemStyles,
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      FlexLayoutClasses,
      CardStyles,
      leafletStyles
    ];
  }
}
