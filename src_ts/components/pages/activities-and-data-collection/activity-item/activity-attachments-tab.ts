import {CSSResult, customElement, html, LitElement, TemplateResult} from 'lit-element';
import {elevationStyles} from '../../../styles/elevation-styles';
import {SharedStyles} from '../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import '../../../common/attachmants-list/attachments-list';
import {ACTIVITY_RELATED_DOCUMENTS, ACTIVITY_REPORT_ATTACHMENTS} from '../../../../endpoints/endpoints-list';

@customElement('activity-attachments-tab')
export class ActivityAttachmentsTab extends LitElement {
  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles];
  }

  // language=HTML
  render(): TemplateResult {
    return html`
      <attachments-list
        endpoint-name="${ACTIVITY_RELATED_DOCUMENTS}"
        .additionalEndpointData="${{id: 4}}"
        tab-title-key="ATTACHMENTS_LIST.RELATED_DOCUMENTS"
      ></attachments-list>
      <attachments-list
        endpoint-name="${ACTIVITY_REPORT_ATTACHMENTS}"
        .additionalEndpointData="${{id: 4}}"
        tab-title-key="ATTACHMENTS_LIST.REPORT_ATTACHMENTS"
      ></attachments-list>
    `;
  }
}
