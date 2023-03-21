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

@customElement('partner-contacts')
export class PartnerContacts extends connect(store)(LitElement) {
  @property() loadingInProcess = true;
  @property() pageSize = 5;
  @property() pageNumber = 1;
  @property() organizationId!: string;
  @property() userData!: IEtoolsUserModel;
  @property() staffMembersList: ITpmPartnerStaffMember[] = [];

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
    if (
      state.tpmPartnerDetails &&
      state.tpmPartnerDetails.data &&
      JSON.stringify(this.staffMembersList) !== JSON.stringify(state.tpmPartnerDetails.data.staff_members)
    ) {
      this.loadingInProcess = false;
      this.staffMembersList = state.tpmPartnerDetails.data.staff_members;
      this.organizationId = state.tpmPartnerDetails.data.organization_id;
    }
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

  getStaffMembers(): ITpmPartnerStaffMember[] {
    if (this.staffMembersList) {
      const startIndex: number = (this.pageNumber - 1) * this.pageSize;
      return this.staffMembersList.slice(startIndex, startIndex + this.pageSize);
    } else {
      return [];
    }
  }

  getTitle(staffMembers: ITpmPartnerStaffMember[]): string {
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
