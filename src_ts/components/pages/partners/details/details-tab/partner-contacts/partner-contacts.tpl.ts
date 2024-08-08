import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query.js';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';
import {html, TemplateResult} from 'lit';
import {translate} from 'lit-translate';
import {PartnerContacts} from './partner-contacts';

export function template(this: PartnerContacts): TemplateResult {
  // language=HTML
  return html`
    <style>
      ${dataTableStylesLit} .edit-button {
        color: var(--gray-mid);
        margin-right: 5px;
        margin-left: 20px;
      }
    </style>
    <etools-media-query
      query="(max-width: 767px)"
      @query-matches-changed="${(e: CustomEvent) => {
        this.lowResolutionLayout = e.detail.value;
      }}"
    ></etools-media-query>

    <section class="elevation page-content card-container" elevation="1">
      <etools-loading
        ?active="${this.loadingInProcess}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>

      <!-- TITLE with ADD ATTACHMENT button -->
      <div class="card-title-box with-bottom-line">
        <div class="card-title">${this.getTitle(this.staffMembersListAll)}</div>
        <div class="buttons-container">
          <sl-switch ?checked="${this.showInactive}" @sl-change="${this.onShowInactiveChange}">
            ${translate('TPM_DETAILS.SHOW_INACTIVE')}
          </sl-switch>
          <sl-tooltip content="${translate('TPM_DETAILS.ACCESS_MANAGEMENT_PORTAL')}">
            <a class="edit-button" href="${this.getAMPLink(this.organizationId, this.userData)}" target="_blank">
              <etools-icon name="open-in-new"></etools-icon>
            </a>
          </sl-tooltip>
        </div>
      </div>

      <!-- Table Header -->
      <etools-data-table-header no-title no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
        <etools-data-table-column class="col-data col-2" field="job_title">
          ${translate('TPM_CONTACTS.COLUMNS.POSITION')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-2" field="first_name">
          ${translate('TPM_CONTACTS.COLUMNS.FIRST_NAME')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-2" field="last_name">
          ${translate('TPM_CONTACTS.COLUMNS.LAST_NAME')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-2" field="phone_number">
          ${translate('TPM_CONTACTS.COLUMNS.PHONE_NUMBER')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-3" field="email">
          ${translate('TPM_CONTACTS.COLUMNS.EMAIL')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-1" field="is_active">
          ${translate('TPM_CONTACTS.COLUMNS.ACTIVE')}
        </etools-data-table-column>
      </etools-data-table-header>

      <!-- Table Empty Row -->
      ${this.loadingInProcess || !this.staffMembersList || !this.staffMembersList.length
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
        ? this.getStaffMembers(this.staffMembersList).map(
            (staffMember: ITpmPartnerStaffMemberUser) => html`
              <etools-data-table-row
                no-collapse
                secondary-bg-on-hover
                .lowResolutionLayout="${this.lowResolutionLayout}"
              >
                <div slot="row-data" class="editable-row">
                  <div class="col-data col-2" data-col-header-label="${translate('TPM_CONTACTS.COLUMNS.POSITION')}">
                    ${staffMember.profile.job_title}
                  </div>
                  <div class="col-data col-2" data-col-header-label="${translate('TPM_CONTACTS.COLUMNS.FIRST_NAME')}">
                    ${staffMember.first_name}
                  </div>
                  <div class="col-data col-2" data-col-header-label="${translate('TPM_CONTACTS.COLUMNS.LAST_NAME')}">
                    ${staffMember.last_name}
                  </div>
                  <div class="col-data col-2" data-col-header-label="${translate('TPM_CONTACTS.COLUMNS.PHONE_NUMBER')}">
                    ${staffMember.profile.phone_number}
                  </div>
                  <div class="col-data col-3" data-col-header-label="${translate('TPM_CONTACTS.COLUMNS.EMAIL')}">
                    ${staffMember.email}
                  </div>
                  <div class="col-data col-1" data-col-header-label="${translate('TPM_CONTACTS.COLUMNS.ACTIVE')}">
                    <span ?hidden="${staffMember.has_active_realm}" class="placeholder-style"
                      >${!staffMember.is_active
                        ? translate('INACTIVE')
                        : !staffMember.has_active_realm
                        ? translate('NO_ACCESS')
                        : ''}</span
                    >
                    <etools-icon name="check" ?hidden="${!staffMember.has_active_realm}"></etools-icon>
                  </div>
                </div>
              </etools-data-table-row>
            `
          )
        : ''}
      <etools-data-table-footer
        id="footer"
        .lowResolutionLayout="${this.lowResolutionLayout}"
        .rowsPerPageText="${translate('ROWS_PER_PAGE')}"
        .pageSize="${this.pageSize || undefined}"
        .pageNumber="${this.pageNumber || undefined}"
        .totalResults="${this.staffMembersList ? this.staffMembersList.length : 0}"
        @page-size-changed="${(event: CustomEvent) => this.onPageSizeChange(event.detail.value)}"
        @page-number-changed="${(event: CustomEvent) => this.onPageNumberChange(event.detail.value)}"
      >
      </etools-data-table-footer>
    </section>
  `;
}
