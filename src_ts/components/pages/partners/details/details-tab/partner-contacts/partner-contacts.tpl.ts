import '@polymer/iron-icons';
import '@unicef-polymer/etools-data-table/etools-data-table.js';
import {html, TemplateResult} from 'lit';
import {translate} from 'lit-translate';
import {PartnerContacts} from './partner-contacts';

export function template(this: PartnerContacts): TemplateResult {
  // language=HTML
  return html`
    <style>
      .edit-button {
        color: var(--gray-mid);
        margin-right: 5px;
        margin-left: 20px;
      }
    </style>

    <section class="elevation page-content card-container" elevation="1">
      <etools-loading
        ?active="${this.loadingInProcess}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>

      <!-- TITLE with ADD ATTACHMENT button -->
      <div class="card-title-box with-bottom-line">
        <div class="card-title">${this.getTitle(this.staffMembersListAll)}</div>
        <div class="buttons-container">
          <paper-toggle-button ?checked="${this.showInactive}" @checked-changed="${this.onShowInactiveChange}">
            ${translate('TPM_DETAILS.SHOW_INACTIVE')}
          </paper-toggle-button>

          <a class="edit-button" href="${this.getAMPLink(this.organizationId, this.userData)}" target="_blank">
            <iron-icon icon="icons:open-in-new"></iron-icon>
          </a>
          <paper-tooltip offset="0">${translate('TPM_DETAILS.ACCESS_MANAGEMENT_PORTAL')}</paper-tooltip>
        </div>
      </div>

      <!-- Table Header -->
      <etools-data-table-header no-title no-collapse>
        <etools-data-table-column class="col-data flex-2" field="job_title">
          ${translate('TPM_CONTACTS.COLUMNS.POSITION')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-2" field="first_name">
          ${translate('TPM_CONTACTS.COLUMNS.FIRST_NAME')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-2" field="last_name">
          ${translate('TPM_CONTACTS.COLUMNS.LAST_NAME')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-2" field="phone_number">
          ${translate('TPM_CONTACTS.COLUMNS.PHONE_NUMBER')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-3" field="email">
          ${translate('TPM_CONTACTS.COLUMNS.EMAIL')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-1" field="is_active">
          ${translate('TPM_CONTACTS.COLUMNS.ACTIVE')}
        </etools-data-table-column>
      </etools-data-table-header>

      <!-- Table Empty Row -->
      ${this.loadingInProcess || !this.staffMembersList || !this.staffMembersList.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="layout horizontal editable-row flex">
                <div class="col-data flex-2">-</div>
                <div class="col-data flex-2">-</div>
                <div class="col-data flex-2">-</div>
                <div class="col-data flex-2">-</div>
                <div class="col-data flex-3">-</div>
                <div class="col-data flex-1">-</div>
              </div>
            </etools-data-table-row>
          `
        : ''}

      <!-- Table Row item -->
      ${!this.loadingInProcess
        ? this.getStaffMembers(this.staffMembersList).map(
            (staffMember: ITpmPartnerStaffMemberUser) => html`
              <etools-data-table-row no-collapse secondary-bg-on-hover>
                <div slot="row-data" class="layout horizontal editable-row flex">
                  <div class="col-data flex-2">${staffMember.profile.job_title}</div>
                  <div class="col-data flex-2">${staffMember.first_name}</div>
                  <div class="col-data flex-2">${staffMember.last_name}</div>
                  <div class="col-data flex-2">${staffMember.profile.phone_number}</div>
                  <div class="col-data flex-3">${staffMember.email}</div>
                  <div class="col-data flex-1">
                    <span ?hidden="${staffMember.has_active_realm}" class="placeholder-style"
                      >${!staffMember.is_active
                        ? translate('INACTIVE')
                        : !staffMember.has_active_realm
                        ? translate('NO_ACCESS')
                        : ''}</span
                    >
                    <iron-icon icon="check" ?hidden="${!staffMember.has_active_realm}"></iron-icon>
                  </div>
                </div>
              </etools-data-table-row>
            `
          )
        : ''}
      <etools-data-table-footer
        id="footer"
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
