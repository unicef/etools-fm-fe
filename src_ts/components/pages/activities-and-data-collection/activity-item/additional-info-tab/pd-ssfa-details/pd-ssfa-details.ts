import {LitElement, TemplateResult, customElement, CSSResult, property, css} from 'lit-element';
import {template} from './pd-ssfa-details.tpl';
import {elevationStyles} from '../../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../../styles/card-styles';

@customElement('pd-ssfa-details')
export class PdSsfaDetails extends LitElement {
  @property() activityDetails: IActivityDetails | null = null;
  @property() items: EtoolsIntervention[] = [];
  @property() pageSize: number = 5;
  @property() pageNumber: number = 1;

  render(): TemplateResult {
    return template.call(this);
  }

  onPageSizeChange(pageSize: number): void {
    if (this.pageSize != pageSize) {
      this.pageSize = pageSize;
    }
  }

  onPageNumberChange(pageNumber: number): void {
    if (this.pageNumber != pageNumber) {
      this.pageNumber = pageNumber;
    }
  }

  getTargetInterventions(): IActivityIntervention[] {
    if (this.activityDetails) {
      const startIndex: number = (this.pageNumber - 1) * this.pageSize;
      return this.activityDetails.interventions.slice(startIndex, startIndex + this.pageSize);
    } else {
      return [];
    }
  }

  static get styles(): CSSResult[] {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      FlexLayoutClasses,
      CardStyles,
      css`
        .link-content {
          display: flex;
        }
        .link-text {
          display: flex;
          align-items: center;
        }
        .arrow-symbol-container {
          min-width: 16px;
          max-width: 16px;
          min-height: 16px;
          max-height: 16px;
          position: relative;
          border: 1px solid;
        }
      `
    ];
  }
}
