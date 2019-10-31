import { CSSResult, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { template } from './monitoring-tab.tpl';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { CardStyles } from '../../../styles/card-styles';
import { elevationStyles } from '../../../styles/elevation-styles';

@customElement('monitoring-tab')
export class MonitoringTabComponent extends LitElement {
  @property() public completed: number;
  @property() public planned: number;
  @property() public minRequired: number;
  @property() public daysSinceLastVisit: number;
  @property() public additionalCompletedLabelValue: string;
  @property() public additionalPlannedLabelValue: string;
  @property() public progressBarLabelsColor: string;
  public constructor() {
      super();
      this.completed = 82;
      this.planned = 100;
      this.minRequired = 67;
      this.daysSinceLastVisit = 27;
      this.additionalCompletedLabelValue = ' Visits';
      this.additionalPlannedLabelValue = ' Visits (Up to December)';
      this.progressBarLabelsColor = 'grey';
  }
  public render(): TemplateResult {
      return template.call(this);
  }

  public static get styles(): CSSResult[] {
      return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles];
  }

  public getCompletedPercentage(): number {
      return this.completed / this.planned * 100;
  }

  public getCompletedDivWidth(): string {
      return `${this.completed / this.planned * 100}%`;
  }

  public getMinRequiredDivWidth(): string {
      return `${ this.minRequired / this.planned * 100}%`;
  }
}
