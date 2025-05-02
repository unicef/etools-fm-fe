import {CSSResult, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {CpDetailsItemStyles} from './cp-details-item.styles';
import {template} from './cp-details-item.tpl';

import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
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

  @property() isUnicefUser = false;

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
      layoutStyles,
      CardStyles,
      leafletStyles
    ];
  }
}
