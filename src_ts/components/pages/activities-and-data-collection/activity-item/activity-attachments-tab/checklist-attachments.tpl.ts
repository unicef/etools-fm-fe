import {html, TemplateResult} from 'lit';
import '../../../../common/attachmants-list/attachments-list';
import {repeat} from 'lit/directives/repeat.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query.js';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';
import {ChecklistAttachments} from './checklist-attachments';
import {getTypeDisplayName} from '../../../../utils/attachments-helper';
import {translate} from 'lit-translate';
import {formatDate} from '@unicef-polymer/etools-utils/dist/date.util';

export function template(this: ChecklistAttachments): TemplateResult {
  return html`
    <style>
      ${dataTableStylesLit}
    </style>
    <etools-media-query
      query="(max-width: 767px)"
      @query-matches-changed="${(e: CustomEvent) => {
        this.lowResolutionLayout = e.detail.value;
      }}"
    ></etools-media-query>
    <section class="elevation page-content card-container" elevation="1">
      <etools-loading
        ?active="${this.loading}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <div class="card-title-box with-bottom-line">
        <div class="card-title">${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.TITLE')}</div>
      </div>
      <div class="hact-visits">
        <etools-data-table-header
          no-title
          ?no-collapse="${!this.items.length}"
          .lowResolutionLayout="${this.lowResolutionLayout}"
        >
          <etools-data-table-column class="col-data table-header-padding col-md-2"
            >${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.METHOD')}</etools-data-table-column
          >
          <etools-data-table-column class="col-data table-header-padding col-md-2"
            >${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.DATA_COLLECTOR')}</etools-data-table-column
          >
          <etools-data-table-column class="col-data table-header-padding col-md-2"
            >${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.METHOD_TYPE')}</etools-data-table-column
          >
          <etools-data-table-column class="col-data table-header-padding col-md-2"
            >${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.RELATED_TO')}</etools-data-table-column
          >
          <etools-data-table-column class="col-data table-header-padding col-md-4"
            >${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.RELATED_NAME')}</etools-data-table-column
          >
        </etools-data-table-header>
        ${!this.items.length
          ? html`
              <etools-data-table-row no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
                <div slot="row-data" class="editable-row row">
                  <div class="col-data col-md-2 truncate">-</div>
                  <div class="col-data col-md-2 truncate">-</div>
                  <div class="col-data col-md-2 truncate">-</div>
                  <div class="col-data col-md-2 truncate">-</div>
                  <div class="col-data col-md-4 truncate">-</div>
                </div>
              </etools-data-table-row>
            `
          : ''}
        ${repeat(
          this.items,
          (item: IChecklistAttachment) => html`
            <etools-data-table-row secondary-bg-on-hover .lowResolutionLayout="${this.lowResolutionLayout}">
              <div slot="row-data" class="editable-row row">
                <div
                  class="col-data col-md-2"
                  data-col-header-label="${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.METHOD')}"
                >
                  <span class="truncate">${this.getMethodName(item.checklist.method)}</span>
                </div>
                <div
                  class="col-data col-md-2"
                  data-col-header-label="${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.DATA_COLLECTOR')}"
                >
                  <span class="truncate">${item.checklist.author.name}</span>
                </div>
                <div
                  class="col-data col-md-2"
                  data-col-header-label="${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.METHOD_TYPE')}"
                >
                  <span class="truncate">${item.checklist.information_source}</span>
                </div>
                <div
                  class="col-data col-md-2"
                  data-col-header-label="${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.RELATED_TO')}"
                >
                  <span class="truncate">${this.getRelatedInfo(item).type}</span>
                </div>
                <div
                  class="col-data col-md-4"
                  data-col-header-label="${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.RELATED_NAME')}"
                >
                  <span class="truncate">${this.getRelatedInfo(item).content}</span>
                </div>
              </div>

              <div slot="row-data-details" class="row">
                <div class="custom-row-details-content col-md-2">
                  <div class="sub-title">${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.DATE_UPLOADED')}</div>
                  <div>${formatDate(item.modified) || '-'}</div>
                </div>
                <div class="custom-row-details-content col-md-2">
                  <div class="sub-title">${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.DOCUMENT_TYPE')}</div>
                  <div>${getTypeDisplayName(item.file_type, this.attachmentsTypes)}</div>
                </div>
                <div class="custom-row-details-content col-md-6">
                  <div class="sub-title">${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.FILE_ATTACHMENT')}</div>
                  <a href="${item.file}" class="download-link" download="${item.filename}"
                    ><etools-icon name="file-download"></etools-icon>${item.filename}
                  </a>
                </div>
              </div>
            </etools-data-table-row>
          `
        )}
      </div>
    </section>
  `;
}
