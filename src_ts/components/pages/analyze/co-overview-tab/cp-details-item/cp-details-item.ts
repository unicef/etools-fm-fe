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

  render(): TemplateResult {
    return template.call(this);
  }

  toggleDetails(intervention: FullReportIntervention): void {
    const currentValue: boolean = this.detailsOpened[intervention.pk];
    this.detailsOpened = {
      ...this.detailsOpened,
      [intervention.pk]: !currentValue
    };
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
