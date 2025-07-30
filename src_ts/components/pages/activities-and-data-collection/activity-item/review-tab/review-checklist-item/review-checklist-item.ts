import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import {CSSResultArray, LitElement, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {ReviewChecklistItemStyles} from './review-checklist-item.styles';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {CommentElementMeta, CommentsMixin} from '../../../../../common/comments/comments-mixin';

@customElement('review-checklist-item')
export class ReviewChecklistItemComponent extends CommentsMixin(LitElement) {
  @property() itemTitle = '';
  @property() checklist: IChecklistItem[] = [];
  @property({type: Number}) targetId: number | null = null;

  render(): TemplateResult | void {
    return html`
      <style>
        etools-data-table-row::part(edt-list-row-wrapper) {
          background-color: var(--primary-background-color);
        }
      </style>
      <div class="table-container">
        <etools-data-table-row .detailsOpened="${true}">
          <div slot="row-data" class="layout-horizontal item-title">${this.itemTitle}</div>

          <div slot="row-data-details">
            <div class="header layout-horizontal">
              <div class="rdc-title flex-2">${translate('ACTIVITY_REVIEW.COLUMNS.TEXT')}</div>
              <div class="rdc-title flex-3">${translate('ACTIVITY_REVIEW.COLUMNS.DETAILS')}</div>
            </div>

            ${this.checklist.map(
              (checklistItem: IChecklistItem) => html`
                <div
                  class="row checklist-line"
                  related-to="review-${this.targetId}-${checklistItem.id}"
                  related-to-description="${this.itemTitle}: ${checklistItem.text}"
                  comments-container
                >
                  <div class="row-details-content col-md-4 col-12">${checklistItem.text}</div>
                  <div class="row-details-content col-md-8 col-12">${checklistItem.specific_details}</div>
                </div>
              `
            )}
          </div>
        </etools-data-table-row>
      </div>
    `;
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, pageLayoutStyles, layoutStyles, ReviewChecklistItemStyles];
  }

  getSpecialElements(container: HTMLElement): CommentElementMeta[] {
    const element: HTMLElement = container as HTMLElement;
    const relatedTo: string = container.getAttribute('related-to') as string;
    const relatedToDescription = container.getAttribute('related-to-description') as string;
    return [{element, relatedTo, relatedToDescription}];
  }
}
