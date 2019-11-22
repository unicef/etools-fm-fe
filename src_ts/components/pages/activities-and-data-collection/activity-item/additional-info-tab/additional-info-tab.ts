import {LitElement, TemplateResult, html, customElement} from 'lit-element';
import {addTranslates, ENGLISH} from '../../../../../localization/localisation';
import {ACTIVITY_ADDITIONAL_INFO_TRANSLATES} from '../../../../../localization/en/activities-and-data-collection/activity-additiona-info.translates';
import {store} from '../../../../../redux/store';
import {additionalInfo} from '../../../../../redux/reducers/additional-info.reducer';

addTranslates(ENGLISH, [ACTIVITY_ADDITIONAL_INFO_TRANSLATES]);
store.addReducers({additionalInfo});

@customElement('additional-info-tab')
export class AdditionalInfoTab extends LitElement {
  render(): TemplateResult {
    return html`
      AdditionalInfoTab
    `;
  }
}
