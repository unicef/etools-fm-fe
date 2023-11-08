import {css, CSSResult, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {template} from './pd-ssfa-details.tpl';
import {elevationStyles} from '../../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../../styles/card-styles';

@customElement('pd-ssfa-details')
export class PdSsfaDetails extends LitElement {
  @property() interventions: IActivityIntervention[] | null = null;
  @property() items: EtoolsIntervention[] = [];
  @property() pageSize = 5;
  @property() pageNumber = 1;
  @property() loading = false;

  set interventionsData(interventions: IActivityIntervention[] | null) {
    this.loading = true;
    this.interventions = interventions;
    this.loading = false;
  }

  render(): TemplateResult {
    return template.call(this);
  }

  onPageSizeChange(pageSize: number): void {
    if (this.pageSize !== pageSize) {
      this.pageSize = pageSize;
    }
  }

  onPageNumberChange(pageNumber: number): void {
    if (this.pageNumber !== pageNumber) {
      this.pageNumber = pageNumber;
    }
  }

  getTargetInterventions(): IActivityIntervention[] {
    if (this.interventions) {
      const startIndex: number = (this.pageNumber - 1) * this.pageSize;
      return this.interventions.slice(startIndex, startIndex + this.pageSize);
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
        .link-text:hover {
          cursor: pointer;
        }
        .link-content:hover {
          cursor: pointer;
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
