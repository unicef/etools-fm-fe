import {css, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {BaseDetailsCard} from './base-details-card';
import {CardStyles} from '../../../../../styles/card-styles';
import {repeat} from 'lit/directives/repeat.js';
import '@unicef-polymer/etools-unicef/src/etools-radio/etools-radio-group';
import '@shoelace-style/shoelace/dist/components/radio/radio.js';
import {store} from '../../../../../../redux/store';
import {SetEditedDetailsCard} from '../../../../../../redux/actions/activity-details.actions';
import {staticDataDynamic} from '../../../../../../redux/selectors/static-data.selectors';
import {TPM_PARTNERS, USERS} from '../../../../../../endpoints/endpoints-list';
import {loadStaticData} from '../../../../../../redux/effects/load-static-data.effect';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {InputStyles} from '../../../../../styles/input-styles';
import {simplifyValue} from '@unicef-polymer/etools-utils/dist/equality-comparisons.util';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {clone} from 'ramda';
import {EtoolsDropdownMultiEl} from '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown-multi.js';
import {waitForCondition} from '@unicef-polymer/etools-utils/dist/wait.util';
import {FormBuilderCardStyles} from '@unicef-polymer/etools-form-builder/dist/lib/styles/form-builder-card.styles';

export const CARD_NAME = 'monitor-information';
const ELEMENT_FIELDS: (keyof IActivityDetails)[] = ['tpm_partner', 'monitor_type', 'team_members', 'visit_lead'];

const USER_STAFF: UserType = 'staff';
const USER_TPM: UserType = 'tpm';

type MemberOptions = {
  userType: UserType;
  tpmPartner?: IActivityTpmPartner | null;
};

@customElement('monitor-information-card')
export class MonitorInformationCard extends BaseDetailsCard {
  @property() membersOptions: User[] = [];
  @property() tpmPartnersOptions: EtoolsTPMPartner[] = [];
  @property() visitLeadOptions: User[] = [];
  @property() userType!: UserType;

  @property() tpmPartner?: IActivityTpmPartner | null;
  @property() teamMembers?: ActivityTeamMember[] = [];
  @property() reviewerOptions: User[] = [];
  @property() reportReviewer?: ActivityTeamMember;
  @property() personResponsible?: ActivityTeamMember | null;
  @query('#teamMembers')
  teamMembersDd!: EtoolsDropdownMultiEl;

  userTypes: UserType[] = [USER_STAFF, USER_TPM];
  users: User[] = [];
  preserveSelectedLeadVisit = false;

  private userUnsubscribe!: Callback;
  private tpmPartnerUnsubscribe!: Callback;

  set data(data: IActivityDetails | null) {
    super.data = data;
    if (!data) {
      this.editedData.monitor_type = USER_STAFF;
    }

    if (this.editedData.monitor_type) {
      this.userType = this.editedData.monitor_type;
    }

    if (!data) {
      return;
    }
    this.tpmPartner = this.editedData.tpm_partner;
  }

  render(): TemplateResult {
    // language=HTML
    return html`
      ${InputStyles}
      <style>
        ${FormBuilderCardStyles}
      </style>
      <etools-card
        related-to="monitor_info"
        comments-container
        card-title="${translate('ACTIVITY_DETAILS.MONITOR_INFO')}"
        ?is-editable="${(!this.editedCard || this.editedCard === CARD_NAME) &&
        !ELEMENT_FIELDS.every((field: string) => this.isFieldReadonly(field))}"
        ?edit="${this.isEditMode}"
        @start-edit="${() => this.startEdit()}"
        @save="${() => this.save()}"
        @cancel="${() => this.cancel()}"
      >
        <div class="card-content" slot="content">
          <etools-loading
            ?active="${this.isLoad}"
            loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
          ></etools-loading>
          <etools-loading
            ?active="${this.isUpdate}"
            loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
          ></etools-loading>
          <div class="layout-horizontal user-types">
            <label>${translate('ACTIVITY_DETAILS.USER_TYPE')}</label>
            <etools-radio-group
              .value="${this.userType}"
              @sl-change="${(e: any) => this.setUserType(e.target.value)}"
              ?disabled="${!this.isEditMode || this.isFieldReadonly('monitor_type')}"
            >
              ${repeat(
                this.userTypes,
                (type: UserType) => html`
                  <sl-radio value="${type}" ?disabled="${!this.isEditMode || this.isFieldReadonly('monitor_type')}">
                    ${translate(`ACTIVITY_DETAILS.USER_TYPES.${type.toUpperCase()}`)}
                  </sl-radio>
                `
              )}
            </etools-radio-group>
          </div>
          <div class="row">
            ${this.editedData.monitor_type === USER_TPM
              ? html`
                  <etools-dropdown
                    class="col-md-6 col-12"
                    id="tpmPartner"
                    .selected="${simplifyValue(this.tpmPartner)}"
                    @etools-selected-item-changed="${({detail}: CustomEvent) => {
                      this.setTpmPartner(detail.selectedItem);
                      this.setTeamMembers([]);
                      this.setPersonResponsible(null);
                    }}"
                    ?trigger-value-change-event="${this.isEditMode}"
                    label="${translate('ACTIVITY_DETAILS.TPM_PARTNER')}"
                    .options="${this.tpmPartnersOptions}"
                    option-label="name"
                    option-value="id"
                    ?readonly="${!this.isEditMode || this.isFieldReadonly('tpm_partner')}"
                    ?invalid="${this.errors && this.errors.tpm_partner}"
                    .errorMessage="${this.errors && this.errors.tpm_partner}"
                    @focus="${() => this.resetFieldError('tpm_partner')}"
                    @click="${() => this.resetFieldError('tpm_partner')}"
                    allow-outside-scroll
                    dynamic-align
                  ></etools-dropdown>
                `
              : ''}

            <etools-dropdown-multi
              class="col-md-6 col-12"
              id="teamMembers"
              .selectedValues="${simplifyValue(this.teamMembers)}"
              @etools-selected-items-changed="${({detail}: CustomEvent) => {
                this.setTeamMembers(detail.selectedItems);
                this.setPersonResponsible(null);
              }}"
              ?trigger-value-change-event="${this.isEditMode}"
              label="${translate('ACTIVITY_DETAILS.TEAM_MEMBERS')}"
              .options="${this.membersOptions}"
              option-label="name"
              option-value="id"
              ?readonly="${!this.isEditMode || this.isFieldReadonly('team_members')}"
              ?invalid="${this.errors && this.errors.team_members}"
              .errorMessage="${this.errors && this.errors.team_members}"
              @focus="${() => this.resetFieldError('team_members')}"
              @click="${() => this.resetFieldError('team_members')}"
              allow-outside-scroll
              dynamic-align
            ></etools-dropdown-multi>

            <etools-dropdown
              class="col-md-6 col-12"
              id="visitLead"
              .selected="${simplifyValue(this.personResponsible)}"
              @etools-selected-item-changed="${({detail}: CustomEvent) =>
                this.setPersonResponsible(detail.selectedItem)}"
              ?trigger-value-change-event="${this.isEditMode}"
              label="${translate('ACTIVITY_DETAILS.VISIT_LEAD')}"
              .options="${this.visitLeadOptions}"
              option-label="name"
              option-value="id"
              ?readonly="${!this.isEditMode || this.isFieldReadonly('visit_lead')}"
              ?invalid="${this.errors && this.errors.visit_lead}"
              .errorMessage="${this.errors && this.errors.visit_lead}"
              @focus="${() => this.resetFieldError('visit_lead')}"
              @click="${() => this.resetFieldError('visit_lead')}"
              allow-outside-scroll
              dynamic-align
            ></etools-dropdown>
          </div>
          <div class="row layout-vertical">
            <span
              class="col-md-6 col-12 warning"
              ?hidden=${!this.showReportReviewerWarning(
                this.editedData.team_members,
                this.editedData?.report_reviewers
              )}
              >${translate('WARNING_REVIEWER_TEAM_MEMBER')}</span
            >
            <etools-dropdown-multi
              class="col-md-6 col-12"
              id="reportReviewerPreliminary"
              .selectedValues="${simplifyValue(this.editedData.report_reviewers)}"
              @etools-selected-items-changed="${({detail}: CustomEvent) =>
                this.updateModelValue('report_reviewers', detail.selectedItems)}"
              ?trigger-value-change-event="${this.isEditMode}"
              label="${translate('ACTIVITY_DETAILS.REPORT_REVIEWERS')}"
              .options="${this.reviewerOptions}"
              option-label="name"
              option-value="id"
              ?readonly="${!this.isEditMode || this.isFieldReadonly('report_reviewers')}"
              ?invalid="${this.errors && this.errors.report_reviewers}"
              .errorMessage="${this.errors && this.errors.report_reviewers}"
              @focus="${() => this.resetFieldError('report_reviewers')}"
              @click="${() => this.resetFieldError('report_reviewers')}"
              allow-outside-scroll
              dynamic-align
            ></etools-dropdown-multi>
            <div class="col-md-6 col-12">
              <etools-input
                label="${translate('ACTIVITY_DETAILS.REVIEWED_BY')}"
                .value="${this.editedData.reviewed_by?.name}"
                disabled
                readonly
                ?hidden="${!this.editedData.reviewed_by?.id}"
              >
              </etools-input>
            </div>
          </div>
        </div>
      </etools-card>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.userUnsubscribe = store.subscribe(
      staticDataDynamic(
        (users: User[] | undefined) => {
          if (!users) {
            return;
          }
          this.users = users;
          this.getMembersOptions({
            userType: this.userType,
            tpmPartner: this.tpmPartner
          });
          // Waited for dropdown options
          this.getReviewerOptions();

          this.personResponsible = this.editedData.visit_lead;
          if (this.personResponsible) {
            this.preserveSelectedLeadVisit = !(this.editedData.team_members || []).some(
              (x) => x.id === this.personResponsible!.id
            );
          }

          waitForCondition(() => !!this.teamMembersDd, 100).then(() => {
            // this.teamMembersDd.triggerValueChangeEvent = true;
            this.teamMembers = clone(this.editedData.team_members);
            this.visitLeadOptions = (clone(this.editedData.team_members) || []) as User[];
          });
        },
        [USERS]
      )
    );

    this.tpmPartnerUnsubscribe = store.subscribe(
      staticDataDynamic(
        (tpmPartners: EtoolsTPMPartner[] | undefined) => {
          if (!tpmPartners) {
            return;
          }
          this.tpmPartnersOptions = tpmPartners;
        },
        [TPM_PARTNERS]
      )
    );

    const data: IStaticDataState = (store.getState() as IRootState).staticData;

    if (!data.users) {
      store.dispatch<AsyncEffect>(loadStaticData(USERS));
    }

    if (this.userType === USER_TPM && !data.tpmPartners) {
      store.dispatch<AsyncEffect>(loadStaticData(TPM_PARTNERS));
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.userUnsubscribe();
    this.tpmPartnerUnsubscribe();
  }

  getMembersOptions({userType, tpmPartner}: MemberOptions): void {
    this.membersOptions = this.users.filter((user: User) => {
      let isValid = false;
      if (userType) {
        isValid = userType === user.user_type;
      }
      if (userType === USER_TPM) {
        isValid = tpmPartner ? tpmPartner.id === user.tpm_partner : false;
      }
      return isValid;
    });
  }

  getReviewerOptions(): void {
    this.reviewerOptions = this.users.filter((user: User) => user.user_type === USER_STAFF);
  }

  setTpmPartner(tpmPartner: EtoolsTPMPartner | null): void {
    if (tpmPartner !== this.tpmPartner) {
      const id: number | null = tpmPartner ? tpmPartner.id : null;
      this.tpmPartner = tpmPartner;
      this.updateModelValue('tpm_partner', id);
      this.getMembersOptions({userType: USER_TPM, tpmPartner});
    }
  }

  setTeamMembers(members: User[]): void {
    if (JSON.stringify(members) !== JSON.stringify(this.teamMembers)) {
      this.updateModelValue('team_members', members);
      this.teamMembers = members;

      // visitLeadOptions will contain only selected team members
      // and will preserve the previos selection if this is missing in selected teamMembers (backward compatibility)
      const visitLeads = clone(members);
      if (this.preserveSelectedLeadVisit && !visitLeads.some((x: User) => x.id === this.personResponsible?.id)) {
        visitLeads.push(this.personResponsible as User);
      }
      this.visitLeadOptions = visitLeads;
    }
  }

  setPersonResponsible(responsible: User | null): void {
    if (responsible !== this.personResponsible) {
      this.updateModelValue('visit_lead', responsible);
      this.personResponsible = responsible;
    }
  }

  setUserType(userType: UserType): void {
    if (this.userType !== userType) {
      this.clearMembers();
    }
    this.userType = userType;
    this.updateModelValue('monitor_type', userType);
    const state: IRootState = store.getState() as IRootState;
    if (userType === USER_TPM && !state.staticData.tpmPartners) {
      store.dispatch<AsyncEffect>(loadStaticData(TPM_PARTNERS));
    }
    this.getMembersOptions({userType: userType, tpmPartner: this.tpmPartner});
  }

  cancel(): void {
    super.cancel();
    this.getMembersOptions({userType: this.userType, tpmPartner: this.tpmPartner});
  }

  clearMembers(): void {
    this.setTpmPartner(null);
    this.setPersonResponsible(null);
    this.setTeamMembers([]);
  }

  startEdit(): void {
    super.startEdit();
    store.dispatch(new SetEditedDetailsCard(CARD_NAME));
  }

  showReportReviewerWarning(teamMembers: any, reportReviewers: any) {
    if (!teamMembers || !teamMembers.length || !reportReviewers || !reportReviewers.length) {
      return false;
    }
    const members = simplifyValue(teamMembers);
    const reviewers = simplifyValue(reportReviewers);
    const commonIDs = members.filter((id: any) => reviewers.includes(id));
    return commonIDs.length;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      elevationStyles,
      SharedStyles,
      CardStyles,
      layoutStyles,
      css`
        .card-content {
          padding: 12px 18px;
        }
        #teamMembers,
        #tpmPartner,
        #reportReviewerPreliminary {
          padding-inline-end: 12px;
        }
        .user-types {
          align-items: center;
        }
        .warning {
          padding-inline-start: 15px;
          margin-block-end: -6px;
          line-height: 16px;
          color: var(--warning-color, #f59e0b);
        }
      `
    ];
  }
}
