import {css, LitElement, TemplateResult, html, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import './issue-tracker-list';
import './pd-ssfa-details/pd-ssfa-details';
import {CommentElementMeta, CommentsMixin} from '../../../../common/comments/comments-mixin';

@customElement('additional-info-tab')
export class AdditionalInfoTab extends CommentsMixin(LitElement) {
  @property() activityDetails: IActivityDetails | null = null;
  @property() isUnicefUser = false;

  render(): TemplateResult {
    return html`
      <issue-tracker-list
        related-to="additional_info_points_of_note"
        comments-container
        .activityId="${this.activityDetails ? this.activityDetails.id : null}"
      ></issue-tracker-list>
      ${this.isUnicefUser
        ? html` <div class="pd-spd-details-container">
            <pd-ssfa-details
              related-to="additional_info_pd_spd_details"
              comments-container
              class="pd-ssfa-details"
              .interventionsData="${this.activityDetails ? this.activityDetails.interventions : null}"
            ></pd-ssfa-details>
          </div>`
        : ''}
    `;
  }

  getSpecialElements(container: HTMLElement): CommentElementMeta[] {
    const element: HTMLElement = container.shadowRoot!.querySelector('.card-container') as HTMLElement;
    const relatedTo: string = container.getAttribute('related-to') as string;
    const relatedToDescription = container.getAttribute('related-to-description') as string;
    return [{element, relatedTo, relatedToDescription}];
  }

  static get styles(): CSSResult {
    return css`
      .pd-spd-details-container {
        display: flex;
      }
      .pd-ssfa-details {
        flex-grow: 1;
      }
    `;
  }
}
