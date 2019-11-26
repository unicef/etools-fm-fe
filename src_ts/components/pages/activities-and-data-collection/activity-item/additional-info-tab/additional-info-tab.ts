import {LitElement, TemplateResult, html, customElement, property, CSSResult, css} from 'lit-element';
import {addTranslates, ENGLISH} from '../../../../../localization/localisation';
import {ACTIVITY_ADDITIONAL_INFO_TRANSLATES} from '../../../../../localization/en/activities-and-data-collection/activity-additiona-info.translates';
import './issue-tracker-list';
import {ISSUE_TRACKER_TRANSLATES} from '../../../../../localization/en/plan-page/issue-tracker.translates';
import {store} from '../../../../../redux/store';
import {additionalInfo} from '../../../../../redux/reducers/additional-info.reducer';
import './pd-ssfa-details/pd-ssfa-details';

addTranslates(ENGLISH, [ACTIVITY_ADDITIONAL_INFO_TRANSLATES, ISSUE_TRACKER_TRANSLATES]);
store.addReducers({additionalInfo});

@customElement('additional-info-tab')
export class AdditionalInfoTab extends LitElement {
  @property() activityId: string | null = null;

  render(): TemplateResult {
    return html`
      <issue-tracker-list .activityId="${this.activityId}"></issue-tracker-list>
      <div class="pd-ssfa-details-container"><pd-ssfa-details class="pd-ssfa-details"></pd-ssfa-details></div>
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
