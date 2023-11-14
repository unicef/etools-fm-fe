import {html, TemplateResult} from 'lit';
import '../../../../common/attachmants-list/attachments-list';
import {repeat} from 'lit/directives/repeat.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import '@polymer/iron-icons';
import {ChecklistAttachments} from './checklist-attachments';
import {getTypeDisplayName} from '../../../../utils/attachments-helper';
import {translate} from 'lit-translate';
import {formatDate} from '@unicef-polymer/etools-utils/dist/date.util';

export function template(this: ChecklistAttachments): TemplateResult {
  return html`
    <section class="elevation page-content card-container" elevation="1">
      <etools-loading
        ?active="${this.loading}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <div class="card-title-box with-bottom-line">
        <div class="card-title">${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.TITLE')}</div>
      </div>
      <div class="hact-visits">
        <etools-data-table-header no-title ?no-collapse="${!this.items.length}">
          <etools-data-table-column class="flex-1"
            >${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.METHOD')}</etools-data-table-column
          >
          <etools-data-table-column class="flex-1"
            >${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.DATA_COLLECTOR')}</etools-data-table-column
          >
          <etools-data-table-column class="flex-1"
            >${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.METHOD_TYPE')}</etools-data-table-column
          >
          <etools-data-table-column class="flex-1"
            >${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.RELATED_TO')}</etools-data-table-column
          >
          <etools-data-table-column class="flex-1"
            >${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.RELATED_NAME')}</etools-data-table-column
          >
        </etools-data-table-header>
        ${!this.items.length
          ? html`
              <etools-data-table-row no-collapse>
                <div slot="row-data" class="layout horizontal editable-row flex">
                  <div class="col-data flex-1 truncate">-</div>
                  <div class="col-data flex-1 truncate">-</div>
                  <div class="col-data flex-1 truncate">-</div>
                  <div class="col-data flex-1 truncate">-</div>
                  <div class="col-data flex-1 truncate">-</div>
                </div>
              </etools-data-table-row>
            `
          : ''}
        ${repeat(
          this.items,
          (item: IChecklistAttachment) => html`
            <etools-data-table-row secondary-bg-on-hover>
              <div slot="row-data" class="layout horizontal editable-row flex">
                <div class="col-data flex-1">
                  <span class="truncate">${this.getMethodName(item.checklist.method)}</span>
                </div>
                <div class="col-data flex-1">
                  <span class="truncate">${item.checklist.author.name}</span>
                </div>
                <div class="col-data flex-1">
                  <span class="truncate">${item.checklist.information_source}</span>
                </div>
                <div class="col-data flex-1">
                  <span class="truncate">${this.getRelatedInfo(item).type}</span>
                </div>
                <div class="col-data flex-1">
                  <span class="truncate">${this.getRelatedInfo(item).content}</span>
                </div>
              </div>

              <div slot="row-data-details" class="custom-row-data-title">
                <div class="custom-row-details-content flex-1">
                  <div class="sub-title">${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.DATE_UPLOADED')}</div>
                </div>
                <div class="custom-row-details-content flex-1">
                  <div class="sub-title">${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.DOCUMENT_TYPE')}</div>
                </div>
                <div class="custom-row-details-content flex-3">
                  <div class="sub-title">${translate('ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.FILE_ATTACHMENT')}</div>
                </div>
              </div>

              <div slot="row-data-details" class="custom-row-data">
                <div class="custom-row-details-content flex-1">
                  <div>${formatDate(item.modified) || '-'}</div>
                </div>
                <div class="custom-row-details-content flex-1">
                  <div>${getTypeDisplayName(item.file_type, this.attachmentsTypes)}</div>
                </div>
                <div class="custom-row-details-content flex-3">
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
