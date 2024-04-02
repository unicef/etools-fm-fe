import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import './edit-attachments-popup/partner-edit-attachments-popup';
import './remove-attachment-popup/partner-remove-attachment-popup';
import {PartnerAttachmentsListComponent} from './attachments-list';
import {html, TemplateResult} from 'lit';
import {translate} from 'lit-translate';
import {getTypeDisplayName} from '../../../../../utils/attachments-helper';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query.js';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';

export function template(this: PartnerAttachmentsListComponent): TemplateResult {
  // language=HTML
  return html`
    <style>
      ${dataTableStylesLit} .attachments-list-table-section {
        position: relative;
        padding: 0;
      }
    </style>
    <etools-media-query
      query="(max-width: 767px)"
      @query-matches-changed="${(e: CustomEvent) => {
        this.lowResolutionLayout = e.detail.value;
      }}"
    ></etools-media-query>

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
      <etools-data-table-header no-title no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
        <etools-data-table-column class="col-data col-3" field="created">
          ${translate('ATTACHMENTS_LIST.COLUMNS.CREATED')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-3" field="file_type">
          ${translate('ATTACHMENTS_LIST.COLUMNS.FILE_TYPE')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-6" field="file">
          ${translate('ATTACHMENTS_LIST.COLUMNS.FILE')}
        </etools-data-table-column>
      </etools-data-table-header>

      <!-- Table Empty Row -->
      ${this.loadingInProcess || !this.attachmentsList.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="editable-row">
                <div class="col-data col-12 no-data">${translate('NO_RECORDS')}</div>
              </div>
            </etools-data-table-row>
          `
        : ''}

      <!-- Table Row item -->
      ${!this.loadingInProcess
        ? this.attachmentsList.map(
            (attachment: IAttachment) => html`
              <etools-data-table-row
                no-collapse
                secondary-bg-on-hover
                .lowResolutionLayout="${this.lowResolutionLayout}"
              >
                <div slot="row-data" class="editable-row">
                  <div class="col-data col-3" data-col-header-label="${translate('ATTACHMENTS_LIST.COLUMNS.CREATED')}">
                    ${this.formatDate(attachment.created)}
                  </div>
                  <div
                    class="col-data col-3"
                    data-col-header-label="${translate('ATTACHMENTS_LIST.COLUMNS.FILE_TYPE')}"
                  >
                    ${getTypeDisplayName(attachment.file_type, this.attachmentsTypes)}
                  </div>
                  <div
                    class="col-data col-6 file-link"
                    data-col-header-label="${translate('ATTACHMENTS_LIST.COLUMNS.FILE')}"
                  >
                    <etools-icon name="attachment"></etools-icon>
                    <a class="file-link" target="_blank" href="${attachment.file}">${attachment.filename}</a>
                  </div>

                  <div class="hover-block">
                    <etools-icon-button
                      ?hidden="${this.readonly}"
                      name="create"
                      @click="${() => this.openPopup(attachment)}"
                    ></etools-icon-button>
                    <etools-icon-button
                      name="delete"
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
