import {LitElement, TemplateResult, html, customElement, CSSResult, css} from 'lit-element';
import {addTranslates, ENGLISH} from '../../../../../localization/localisation';
import {ACTIVITY_ADDITIONAL_INFO_TRANSLATES} from '../../../../../localization/en/activities-and-data-collection/activity-additiona-info.translates';
import {store} from '../../../../../redux/store';
import {additionalInfo} from '../../../../../redux/reducers/additional-info.reducer';
import './pd-ssfa-details/pd-ssfa-details';

addTranslates(ENGLISH, [ACTIVITY_ADDITIONAL_INFO_TRANSLATES]);
store.addReducers({additionalInfo});

@customElement('additional-info-tab')
export class AdditionalInfoTab extends LitElement {
  render(): TemplateResult {
    return html`
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
