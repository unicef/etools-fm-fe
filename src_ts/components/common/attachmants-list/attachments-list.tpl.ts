import '@polymer/iron-icons';
import '@unicef-polymer/etools-data-table/etools-data-table.js';
import './edit-attachments-popup/edit-attachments-popup';
import './remove-attachment-popup/remove-attachment-popup';
import {AttachmentsListComponent} from './attachments-list';
import {html, TemplateResult} from 'lit-element';
import {translate} from 'lit-translate';
import {getTypeDisplayName} from '../../utils/attachments-helper';
import { formatDate } from '@unicef-polymer/etools-utils/dist/date.util';

export function template(this: AttachmentsListComponent): TemplateResult {
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
          <paper-icon-button
            @tap="${() => this.openPopup()}"
            class="panel-button"
            ?hidden="${this.readonly}"
            icon="add-box"
          ></paper-icon-button>
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
                  <div class="col-data flex-1">${formatDate(attachment.created) || ''}</div>
                  <div class="col-data flex-1">${getTypeDisplayName(attachment.file_type, this.attachmentsTypes)}</div>
                  <div class="col-data flex-4 file-link">
                    <iron-icon icon="icons:attachment"></iron-icon>
                    <a class="file-link" target="_blank" href="${attachment.file}">${attachment.filename}</a>
                  </div>

                  <div class="hover-block">
                    <paper-icon-button
                      ?hidden="${this.readonly}"
                      icon="icons:create"
                      @tap="${() => this.openPopup(attachment)}"
                    ></paper-icon-button>
                    <paper-icon-button
                      icon="icons:delete"
                      ?hidden="${this.readonly}"
                      @tap="${() => this.openDeletePopup(attachment.id)}"
                    ></paper-icon-button>
                  </div>
                </div>
              </etools-data-table-row>
            `
          )
        : ''}
    </section>
  `;
}
