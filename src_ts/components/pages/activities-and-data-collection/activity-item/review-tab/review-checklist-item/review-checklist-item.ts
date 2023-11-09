import '@unicef-polymer/etools-data-table/etools-data-table.js';
import {CSSResultArray, LitElement, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../../styles/flex-layout-classes';
import {ReviewChecklistItemStyles} from './review-checklist-item.styles';
import {translate} from 'lit-translate';

@customElement('review-checklist-item')
export class ReviewChecklistItemComponent extends LitElement {
  @property() itemTitle = '';
  @property() checklist: IChecklistItem[] = [];

  render(): TemplateResult | void {
    return html`
      <style>
        etools-data-table-row::part(edt-list-row-wrapper) {
          background-color: var(--primary-background-color);
        }
      </style>

      <etools-data-table-row .detailsOpened="${true}">
        <div slot="row-data" class="layout horizontal item-title">${this.itemTitle}</div>

        <div slot="row-data-details">
          <div class="header layout horizontal">
            <div class="rdc-title flex-2">${translate('ACTIVITY_REVIEW.COLUMNS.TEXT')}</div>
            <div class="rdc-title flex-3">${translate('ACTIVITY_REVIEW.COLUMNS.DETAILS')}</div>
          </div>

          ${this.checklist.map(
            (checklistItem: IChecklistItem) => html`
              <div class="layout horizontal checklist-line">
                <div class="row-details-content flex-2">${checklistItem.text}</div>
                <div class="row-details-content flex-3">${checklistItem.specific_details}</div>
              </div>
            `
          )}
        </div>
      </etools-data-table-row>
    `;
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, pageLayoutStyles, FlexLayoutClasses, ReviewChecklistItemStyles];
  }
}
