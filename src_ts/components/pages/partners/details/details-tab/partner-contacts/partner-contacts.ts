import {CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {template} from './partner-contacts.tpl';
import {store} from '../../../../../../redux/store';
import {elevationStyles} from '../../../../../styles/elevation-styles';
import {connect} from 'pwa-helpers/connect-mixin.js';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../../styles/card-styles';
// import {fireEvent} from '../../utils/fire-custom-event';
import {get as getTranslation} from 'lit-translate';
import {getEndpoint} from '../../../../../../endpoints/endpoints';
import {TPM_PARTNER_STAFF} from '../../../../../../endpoints/endpoints-list';
import {request} from '../../../../../../endpoints/request';

@customElement('partner-contacts')
export class PartnerContacts extends connect(store)(LitElement) {
  @property() pageSize = 10;
  @property() pageNumber = 1;
  @property() loadingInProcess = true;
  @property() organizationId!: string;
  @property() partnerId!: number;
  @property() userData!: IEtoolsUserModel;
  @property() staffMembersListAll!: ITpmPartnerStaffMemberUser[];
  @property() staffMembersList!: ITpmPartnerStaffMemberUser[];
  @property({type: Boolean}) showInactive = false;

  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles];
  }

  render(): TemplateResult {
    return template.call(this);
  }

  stateChanged(state: IRootState): void {
    if (state.user && state.user.data && JSON.stringify(this.userData) !== JSON.stringify(state.user.data)) {
      this.userData = state.user.data;
    }
    if (state.tpmPartnerDetails && state.tpmPartnerDetails.data && this.partnerId !== state.tpmPartnerDetails.data.id) {
      this.partnerId = state.tpmPartnerDetails.data.id;
      this.organizationId = state.tpmPartnerDetails.data.organization_id;
      this.loadStaffMembers(this.partnerId);
    }
  }

  onShowInactiveChange(e: CustomEvent): void {
    if (!e.detail) {
      return;
    }
    this.showInactive = e.detail.value;
    this.filterStaffMembersByActive();
  }

  onPageSizeChange(pageSize: number): void {
    if (this.pageSize !== pageSize) {
      this.pageSize = pageSize;
    }
  }

  onPageNumberChange(pageNumber: number): void {
    if (this.pageNumber !== pageNumber) {
      this.pageNumber = pageNumber;
    }
  }

  filterStaffMembersByActive(): void {
    this.staffMembersList = (this.staffMembersListAll || []).filter((x) => x.is_active || this.showInactive);
    this.onPageNumberChange(1);
  }

  getStaffMembers(staffMembersList: ITpmPartnerStaffMemberUser[]): ITpmPartnerStaffMemberUser[] {
    if (staffMembersList) {
      const startIndex: number = (this.pageNumber - 1) * this.pageSize;
      return staffMembersList.slice(startIndex, startIndex + this.pageSize);
    } else {
      return [];
    }
  }

  loadStaffMembers(partnerId: number): void {
    const endpoint: IResultEndpoint = getEndpoint(TPM_PARTNER_STAFF, {id: partnerId});
    request<ITpmPartnerStaffMemberUser[]>(endpoint.url, {method: 'GET'})
      .then((response: ITpmPartnerStaffMemberUser[]) => {
        this.staffMembersListAll = response;
        this.filterStaffMembersByActive();
        this.loadingInProcess = false;
      })
      .catch((err) => {
        console.log(err);
        this.loadingInProcess = false;
      });
  }

  getTitle(staffMembers: ITpmPartnerStaffMemberUser[]): string {
    return (
      getTranslation('TPM_DETAILS.TPM_CONTACTS') +
      (staffMembers && staffMembers.length ? ` (${staffMembers.length})` : '')
    );
  }

  getAMPLink(organizationId: string, user: IEtoolsUserModel): string {
    let url = `/amp/users/`;
    if (user && user.is_unicef_user) {
      url += `list?organization_type=tpm&organization_id=${organizationId}`;
    }
    return url;
  }
}
