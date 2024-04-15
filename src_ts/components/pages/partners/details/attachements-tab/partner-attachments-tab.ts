import {CSSResult, LitElement, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import '../attachements-tab/components/attachments-list';
import {TPM_PARTNER_ATTACHMENTS} from '../../../../../endpoints/endpoints-list';

@customElement('partner-attachments-tab')
export class PartnerAttachmentsTab extends LitElement {
  @property() partnerDetails: IActivityTpmPartner | null = null;

  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles];
  }

  render(): TemplateResult {
    // language=HTML
    return this.partnerDetails
      ? html`
          <partner-attachments-list
            endpoint-name="${TPM_PARTNER_ATTACHMENTS}"
            tab-title-key="TPM_DETAILS.TABS.attachments"
            .additionalEndpointData="${{id: this.partnerDetails.id}}"
            ?readOnly="${false}"
          ></partner-attachments-list>
        `
      : html``;
  }
}
