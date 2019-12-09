import {LitElement, TemplateResult, html, customElement, property, CSSResult, css} from 'lit-element';
import {addTranslates, ENGLISH} from '../../../../../localization/localisation';
import {ACTIVITY_ADDITIONAL_INFO_TRANSLATES} from '../../../../../localization/en/activities-and-data-collection/activity-additiona-info.translates';
import './issue-tracker-list';
import {ISSUE_TRACKER_TRANSLATES} from '../../../../../localization/en/plan-page/issue-tracker.translates';
import './pd-ssfa-details/pd-ssfa-details';

addTranslates(ENGLISH, [ACTIVITY_ADDITIONAL_INFO_TRANSLATES, ISSUE_TRACKER_TRANSLATES]);

@customElement('additional-info-tab')
export class AdditionalInfoTab extends LitElement {
  @property() activityDetails: IActivityDetails | null = null;

  render(): TemplateResult {
    return html`
      <issue-tracker-list .activityId="${this.activityDetails ? this.activityDetails.id : null}"></issue-tracker-list>
      <div class="pd-ssfa-details-container">
        <pd-ssfa-details
          class="pd-ssfa-details"
          .interventions="${this.activityDetails ? this.activityDetails.interventions : null}"
        ></pd-ssfa-details>
      </div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .pd-ssfa-details-container {
        display: flex;
      }
      .pd-ssfa-details {
        flex-grow: 1;
      }
    `;
  }
}
