import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@unicef-polymer/etools-data-table/etools-data-table.js';
import './edit-attachments-popup/partner-edit-attachments-popup';
import './remove-attachment-popup/partner-remove-attachment-popup';
import {PartnerAttachmentsListComponent} from './attachments-list';
import {html, TemplateResult} from 'lit';
import {translate} from 'lit-translate';
import {getTypeDisplayName} from '../../../../../utils/attachments-helper';

export function template(this: PartnerAttachmentsListComponent): TemplateResult {
  // language=HTML
  return html`
    <style>
      .attachments-list-table-section {
        position: relative;
        padding: 0;
      }
    </style>

    <section class="elevation page-content card-container attachments-list-table-section" elevation="1">
      <etools-loading
        ?active="${this.loadingInProcess}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>

      <!-- TITLE with ADD ATTACHMENT button -->
      <div class="card-title-box with-bottom-line">
        <div class="card-title">${translate(this.tabTitleKey)}</div>
        <div class="buttons-container">
          <etools-icon-button
            @click="${() => this.openPopup()}"
            class="panel-button"
            ?hidden="${this.readonly}"
            name="add-box"
          ></etools-icon-button>
        </div>
      </div>

      <!-- Table Header -->
      <etools-data-table-header no-title no-collapse>
        <etools-data-table-column class="col-data flex-1" field="created">
          ${translate('ATTACHMENTS_LIST.COLUMNS.CREATED')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-1" field="file_type">
          ${translate('ATTACHMENTS_LIST.COLUMNS.FILE_TYPE')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-4" field="file">
          ${translate('ATTACHMENTS_LIST.COLUMNS.FILE')}
        </etools-data-table-column>
      </etools-data-table-header>

      <!-- Table Empty Row -->
      ${this.loadingInProcess || !this.attachmentsList.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="layout horizontal editable-row flex">
                <div class="col-data flex-1">-</div>
                <div class="col-data flex-1">-</div>
                <div class="col-data flex-4 ">-</div>
              </div>
            </etools-data-table-row>
          `
        : ''}

      <!-- Table Row item -->
      ${!this.loadingInProcess
        ? this.attachmentsList.map(
            (attachment: IAttachment) => html`
              <etools-data-table-row no-collapse secondary-bg-on-hover>
                <div slot="row-data" class="layout horizontal editable-row flex">
                  <div class="col-data flex-1">${this.formatDate(attachment.created)}</div>
                  <div class="col-data flex-1">${getTypeDisplayName(attachment.file_type, this.attachmentsTypes)}</div>
                  <div class="col-data flex-4 file-link">
                    <etools-icon name="icons:attachment"></etools-icon>
                    <a class="file-link" target="_blank" href="${attachment.file}">${attachment.filename}</a>
                  </div>

                  <div class="hover-block">
                    <etools-icon-button
                      ?hidden="${this.readonly}"
                      name="icons:create"
                      @click="${() => this.openPopup(attachment)}"
                    ></etools-icon-button>
                    <etools-icon-button
                      name="icons:delete"
                      ?hidden="${this.readonly}"
                      @click="${() => this.openDeletePopup(attachment.id)}"
                    ></etools-icon-button>
                  </div>
                </div>
              </etools-data-table-row>
            `
          )
        : ''}
    </section>
  `;
}
