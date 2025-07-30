import {css, CSSResult, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {template} from './pd-ssfa-details.tpl';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../../../styles/card-styles';
import {CommentElementMeta, CommentsMixin} from '../../../../../common/comments/comments-mixin';

@customElement('pd-ssfa-details')
export class PdSsfaDetails extends CommentsMixin(LitElement) {
  @property() interventions: IActivityIntervention[] | null = null;
  @property() items: EtoolsIntervention[] = [];
  @property() pageSize = 5;
  @property() pageNumber = 1;
  @property() loading = false;
  @property({type: Boolean})
  lowResolutionLayout = false;
  commentsModeInitialize = false;

  set interventionsData(interventions: IActivityIntervention[] | null) {
    this.loading = true;
    this.interventions = interventions;
    this.loading = false;
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('interventions') && this.interventions?.length) {
      this.setCommentMode();
    }
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

  getSpecialElements(container: HTMLElement): CommentElementMeta[] {
    const element: HTMLElement = container.shadowRoot!.querySelector('#wrapper') as HTMLElement;
    const relatedTo: string = container.getAttribute('related-to') as string;
    const relatedToDescription = container.getAttribute('related-to-description') as string;
    return [{element, relatedTo, relatedToDescription}];
  }

  static get styles(): CSSResult[] {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      layoutStyles,
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
