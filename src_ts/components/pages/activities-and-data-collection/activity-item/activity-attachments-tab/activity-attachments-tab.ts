import {CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import '../../../../common/attachmants-list/attachments-list';
import {ACTIVITY_RELATED_DOCUMENTS, ACTIVITY_REPORT_ATTACHMENTS} from '../../../../../endpoints/endpoints-list';

@customElement('activity-attachments-tab')
export class ActivityAttachmentsTab extends LitElement {
  @property() activityDetails: IActivityDetails | null = null;

  render(): TemplateResult {
    // language=HTML
    return this.activityDetails
      ? html`
          <attachments-list
            endpoint-name="${ACTIVITY_RELATED_DOCUMENTS}"
            .additionalEndpointData="${{id: this.activityDetails.id}}"
            tab-title-key="ATTACHMENTS_LIST.RELATED_DOCUMENTS"
            ?readonly="${!this.activityDetails.permissions.edit.attachments}"
          ></attachments-list>

          ${this.activityDetails.permissions.view.report_attachments
            ? html`
                <attachments-list
                  endpoint-name="${ACTIVITY_REPORT_ATTACHMENTS}"
                  .additionalEndpointData="${{id: this.activityDetails.id}}"
                  tab-title-key="ATTACHMENTS_LIST.REPORT_ATTACHMENTS"
                  ?readonly="${!this.activityDetails.permissions.edit.report_attachments}"
                ></attachments-list>
              `
            : ''}
        `
      : html``;
  }

  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles];
  }
}
