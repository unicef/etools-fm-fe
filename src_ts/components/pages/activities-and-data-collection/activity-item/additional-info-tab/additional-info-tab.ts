import {LitElement, TemplateResult, html, customElement, property} from 'lit-element';
import {addTranslates, ENGLISH} from '../../../../../localization/localisation';
import {ACTIVITY_ADDITIONAL_INFO_TRANSLATES} from '../../../../../localization/en/activities-and-data-collection/activity-additiona-info.translates';
import './issue-tracker-list';
import {ISSUE_TRACKER_TRANSLATES} from '../../../../../localization/en/plan-page/issue-tracker.translates';

addTranslates(ENGLISH, [ACTIVITY_ADDITIONAL_INFO_TRANSLATES, ISSUE_TRACKER_TRANSLATES]);

@customElement('additional-info-tab')
export class AdditionalInfoTab extends LitElement {
  @property() activityId: string | null = null;

  render(): TemplateResult {
    return html`
      <issue-tracker-list .activityId="${this.activityId}"></issue-tracker-list>
    `;
  }
}
