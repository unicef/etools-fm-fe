import {CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {addTranslates, ENGLISH} from '../../../../../localization/localisation';
import '@unicef-polymer/etools-date-time/datepicker-lite';
import '../../../../common/layout/etools-card';
import '../../../../common/location-widget/location-widget';
import {ACTIVITY_DETAILS_TRANSLATES} from '../../../../../localization/en/activities-and-data-collection/activity-details.translates';
import './details-cards/activity-details-card/activity-details-card';
import './details-cards/monitor-information-card';
import './details-cards/entities-monitor-card/entities-monitor-card';
import './details-cards/note-card';
import {store} from '../../../../../redux/store';
import {ActivityDetailsActions} from '../../../../../redux/actions/activity-details.actions';

addTranslates(ENGLISH, [ACTIVITY_DETAILS_TRANSLATES]);

@customElement('activity-details-tab')
export class ActivityDetailsTab extends LitElement {
  @property() set activityId(id: string) {
    if (!id) {
      store.dispatch({
        type: ActivityDetailsActions.ACTIVITY_DETAILS_GET_SUCCESS,
        payload: null
      });
    }
  }

  render(): TemplateResult {
    // language=HTML
    return html`
      <details-note-card></details-note-card>
      <activity-details-card class="page-content"></activity-details-card>
      <monitor-information-card class="page-content"></monitor-information-card>
      <entities-monitor-card class="page-content"></entities-monitor-card>
    `;
  }

  static get styles(): CSSResult[] {
    // language=CSS
    return [pageLayoutStyles];
  }
}
