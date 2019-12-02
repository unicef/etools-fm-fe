import {html, TemplateResult} from 'lit-element';
import '../../../../common/attachmants-list/attachments-list';
import {repeat} from 'lit-html/directives/repeat';
import '@unicef-polymer/etools-data-table';
import '@polymer/iron-icons';
import {ChecklistAttachments} from './checklist-attachments';

export function template(this: ChecklistAttachments): TemplateResult {
  return html`
    <section class="elevation page-content card-container" elevation="1">
      <div class="card-title-box with-bottom-line">
        <div class="card-title">Checklist Attachments</div>
      </div>
      <div class="hact-visits">
        <etools-data-table-header no-title ?no-collapse="${!this.items.length}">
          <etools-data-table-column class="flex-1">Method</etools-data-table-column>
          <etools-data-table-column class="flex-1">Data Collector</etools-data-table-column>
          <etools-data-table-column class="flex-1">Method type</etools-data-table-column>
          <etools-data-table-column class="flex-1">Related To</etools-data-table-column>
          <etools-data-table-column class="flex-1">Related Name</etools-data-table-column>
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
                  <div class="sub-title">Date Uploaded</div>
                </div>
                <div class="custom-row-details-content flex-1">
                  <div class="sub-title">Document Type</div>
                </div>
                <div class="custom-row-details-content flex-3">
                  <div class="sub-title">File Attachment</div>
                </div>
              </div>

              <div slot="row-data-details" class="custom-row-data">
                <div class="custom-row-details-content flex-1">
                  <div>${this.formatDate(item.modified)}</div>
                </div>
                <div class="custom-row-details-content flex-1">
                  <div>${item.file_type}</div>
                </div>
                <div class="custom-row-details-content flex-3">
                  <a href="${item.file}" class="download-link" download="${item.filename}"
                    ><iron-icon icon="file-download"></iron-icon>${item.filename}
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
