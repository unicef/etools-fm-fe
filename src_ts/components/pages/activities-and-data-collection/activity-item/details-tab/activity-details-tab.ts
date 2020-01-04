import {CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import '@unicef-polymer/etools-date-time/datepicker-lite';
import '../../../../common/layout/etools-card';
import '../../../../common/location-widget/location-widget';
import './details-cards/activity-details-card/activity-details-card';
import './details-cards/monitor-information-card';
import './details-cards/entities-monitor-card/entities-monitor-card';
import './details-cards/note-card';
import {store} from '../../../../../redux/store';
import {ActivityDetailsActions, SetEditedDetailsCard} from '../../../../../redux/actions/activity-details.actions';
import {routeDetailsSelector} from '../../../../../redux/selectors/app.selectors';
import {ACTIVITIES_PAGE} from '../../activities-page';

const PAGE: string = ACTIVITIES_PAGE;

@customElement('activity-details-tab')
export class ActivityDetailsTab extends LitElement {
  private routeUnsubscribe!: Callback;
  @property() set activityId(id: string) {
    if (!id) {
      store.dispatch({
        type: ActivityDetailsActions.ACTIVITY_DETAILS_GET_SUCCESS,
        payload: null
      });
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.routeUnsubscribe = store.subscribe(
      routeDetailsSelector(({routeName}: IRouteDetails) => {
        if (routeName !== PAGE) {
          return;
        }
        store.dispatch(new SetEditedDetailsCard(null));
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.routeUnsubscribe();
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
