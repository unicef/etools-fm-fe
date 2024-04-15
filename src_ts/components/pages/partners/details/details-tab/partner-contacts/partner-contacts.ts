import {CSSResult, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {template} from './partner-contacts.tpl';
import {store} from '../../../../../../redux/store';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {connect} from '@unicef-polymer/etools-utils/dist/pwa.utils';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../../../styles/card-styles';
// import {fireEvent} from '../../utils/fire-custom-event';
import {get as getTranslation} from 'lit-translate';
import {getEndpoint} from '../../../../../../endpoints/endpoints';
import {TPM_PARTNER_STAFF} from '../../../../../../endpoints/endpoints-list';
import {request} from '../../../../../../endpoints/request';
import SlSwitch from '@shoelace-style/shoelace/dist/components/switch/switch';

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
  @property({type: Boolean})
  lowResolutionLayout = false;

  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles, layoutStyles, CardStyles];
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
    if (!e.target) {
      return;
    }
    this.showInactive = (e.target as SlSwitch).checked;
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
    this.staffMembersList = (this.staffMembersListAll || []).filter((x) => x.has_active_realm || this.showInactive);
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
