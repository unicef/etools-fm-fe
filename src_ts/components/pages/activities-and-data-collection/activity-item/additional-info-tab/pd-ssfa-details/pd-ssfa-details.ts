import {LitElement, TemplateResult, customElement, CSSResult, property, css} from 'lit-element';
import {template} from './pd-ssfa-details.tpl';
import {InterventionsMixin} from '../../../../../common/mixins/interventions-mixin';
import {elevationStyles} from '../../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../../styles/card-styles';

@customElement('pd-ssfa-details')
export class PdSsfaDetails extends InterventionsMixin(LitElement) {
  @property() interventions: EtoolsIntervention[] = super.interventions;
  @property() items: EtoolsIntervention[] = [];
  @property() pageSize: number = 5;
  @property() pageNumber: number = 1;
  @property() count: number = 0;

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.count = this.interventions.length;
    this.items = this.interventions;
  }

  onPageSizeChange(pageSize: number): void {
    if (this.pageSize != pageSize) {
      this.pageSize = pageSize;
      const startIndex: number = (this.pageNumber - 1) * this.pageSize;
      this.items = this.interventions.slice(startIndex, startIndex + this.pageSize);
    }
  }

  onPageNumberChange(pageNumber: number): void {
    if (this.pageNumber != pageNumber) {
      this.pageNumber = pageNumber;
      const startIndex: number = (this.pageNumber - 1) * this.pageSize;
      this.items = this.interventions.slice(startIndex, startIndex + this.pageSize);
    }
  }

  protected updated(_changedProperties: Map<PropertyKey, unknown>): void {
    if (_changedProperties.get('interventions')) {
      this.items = this.interventions.slice();
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
