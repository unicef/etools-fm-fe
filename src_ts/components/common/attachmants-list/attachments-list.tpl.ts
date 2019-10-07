import '@polymer/iron-icons';
import '@unicef-polymer/etools-data-table';
import './edit-attachments-popup/edit-attachments-popup';
import './remove-attachment-popup/remove-attachment-popup';
import { AttachmentsListComponent } from './attachments-list';
import { html, TemplateResult } from 'lit-element';
import { FlexLayoutClasses } from '../../styles/flex-layout-classes';
import { CardStyles } from '../../styles/card-styles';
import { SharedStyles } from '../../styles/shared-styles';
import { pageLayoutStyles } from '../../styles/page-layout-styles';
import { translate } from '../../../localization/localisation';
import { hasPermission, Permissions } from '../../../config/permissions';

export function template(this: AttachmentsListComponent): TemplateResult {
    return html`
        ${SharedStyles} ${pageLayoutStyles}
        ${FlexLayoutClasses} ${CardStyles}
        <style>
            .attachments-list-table-section {
                position: relative;
                padding: 0;
             }
        </style>

        <section class="elevation page-content card-container attachments-list-table-section" elevation="1">

            <etools-loading ?active="${ this.loadingInProcess }" loading-text="${ translate('MAIN.LOADING_DATA_IN_PROCESS') }"></etools-loading>

            <!-- TITLE with ADD ATTACHMENT button -->
            <div class="card-title-box with-bottom-line">

                <div class="card-title">${ translate('ATTACHMENTS_LIST.TITLE') }</div>
                <div class="buttons-container">
                    <paper-icon-button
                            @tap="${() => this.openPopup()}"
                            class="panel-button"
                            ?hidden="${ !hasPermission(Permissions.EDIT_RATIONALE) }"
                            icon="add-box"></paper-icon-button>
                </div>

            </div>

            <!-- Table Header -->
            <etools-data-table-header no-title no-collapse>
                <etools-data-table-column class="col-data flex-1" field="created">
                    ${ translate('ATTACHMENTS_LIST.COLUMNS.CREATED') }
                </etools-data-table-column>
                <etools-data-table-column class="col-data flex-1" field="file_type">
                    ${ translate('ATTACHMENTS_LIST.COLUMNS.FILE_TYPE') }
                </etools-data-table-column>
                <etools-data-table-column class="col-data flex-4" field="file">
                    ${ translate('ATTACHMENTS_LIST.COLUMNS.FILE') }
                </etools-data-table-column>
            </etools-data-table-header>

            <!-- Table Empty Row -->
            ${ this.loadingInProcess || !this.attachmentsList.length ? html`
                <etools-data-table-row no-collapse>
                    <div slot="row-data" class="layout horizontal editable-row flex">
                        <div class="col-data flex-1">-</div>
                        <div class="col-data flex-1">-</div>
                        <div class="col-data flex-4 ">-</div>
                    </div>
                </etools-data-table-row>
            ` : '' }

            <!-- Table Row item -->
            ${ !this.loadingInProcess ? this.attachmentsList.map((attachment: Attachment) => html`
                <etools-data-table-row no-collapse secondary-bg-on-hover>
                    <div slot="row-data" class="layout horizontal editable-row flex">
                        <div class="col-data flex-1">${ this.formatDate(attachment.created) }</div>
                        <div class="col-data flex-1">${ this.getTypeDisplayName(attachment.file_type) }</div>
                        <div class="col-data flex-4 file-link">
                            <iron-icon icon="icons:attachment"></iron-icon>
                            <a class="file-link" target="_blank" href="${ attachment.file }">${ attachment.filename }</a>
                        </div>

                        <div class="hover-block" ?hidden="${ !hasPermission(Permissions.EDIT_RATIONALE) }">
                            <paper-icon-button icon="icons:create" @tap="${ () => this.openPopup(attachment) }"></paper-icon-button>
                            <paper-icon-button icon="icons:delete" @tap="${ () => this.openDeletePopup(attachment.id) }"></paper-icon-button>
                        </div>
                    </div>
                </etools-data-table-row>
            `) : '' }

        </section>
    `;
}
