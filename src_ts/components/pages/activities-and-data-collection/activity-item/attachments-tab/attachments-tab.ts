import {html, LitElement, TemplateResult, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import '../../../../common/attachmants-list/attachments-list';
import {ACTIVITY_RELATED_DOCUMENTS, ACTIVITY_REPORT_ATTACHMENTS} from '../../../../../endpoints/endpoints-list';
import './checklist-attachments';
import {CommentElementMeta, CommentsMixin} from '../../../../common/comments/comments-mixin';

@customElement('activity-attachments-tab')
export class ActivityAttachmentsTab extends CommentsMixin(LitElement) {
  @property() activityDetails: IActivityDetails | null = null;

  render(): TemplateResult {
    // language=HTML
    return this.activityDetails
      ? html`
          <attachments-list
            endpoint-name="${ACTIVITY_RELATED_DOCUMENTS}"
            .additionalEndpointData="${{id: this.activityDetails.id}}"
            related-to="attachments_related"
            comments-container
            tab-title-key="ATTACHMENTS_LIST.RELATED_DOCUMENTS"
            ?readonly="${!this.activityDetails.permissions.edit.attachments}"
          ></attachments-list>

          ${this.activityDetails.permissions.view.report_attachments
            ? html`
                <attachments-list
                  endpoint-name="${ACTIVITY_REPORT_ATTACHMENTS}"
                  related-to="attachments_report"
                  comments-container
                  .additionalEndpointData="${{id: this.activityDetails.id}}"
                  tab-title-key="ATTACHMENTS_LIST.REPORT_ATTACHMENTS"
                  ?readonly="${!this.activityDetails.permissions.edit.report_attachments}"
                ></attachments-list>

                <checklist-attachments
                  related-to="attachments_checklist"
                  comments-container
                  .activityDetailsId="${this.activityDetails.id}"
                ></checklist-attachments>
              `
            : ''}
        `
      : html``;
  }

  getSpecialElements(container: HTMLElement): CommentElementMeta[] {
    const element: HTMLElement = container.shadowRoot!.querySelector('.card-container') as HTMLElement;
    const relatedTo: string = container.getAttribute('related-to') as string;
    const relatedToDescription = container.getAttribute('related-to-description') as string;
    return [{element, relatedTo, relatedToDescription}];
  }

  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles];
  }
}
