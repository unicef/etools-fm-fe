import {CSSResult, LitElement, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import '@unicef-polymer/etools-unicef/src/etools-date-time/datepicker-lite';
import '../../../../common/layout/etools-card';
import '../../../../common/location-widget/location-widget';
import '../../../../common/location-sites-widget/location-sites-widget';
import './details-cards/activity-details-card/activity-details-card';
import './details-cards/monitor-information-card';
import './details-cards/entities-monitor-card/entities-monitor-card';
import './details-cards/note-card';
import {store} from '../../../../../redux/store';
import {SetEditedDetailsCard} from '../../../../../redux/actions/activity-details.actions';
import {routeDetailsSelector} from '../../../../../redux/selectors/app.selectors';
import {ACTIVITIES_PAGE} from '../../activities-and-data-collection-page';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

const PAGE: string = ACTIVITIES_PAGE;

@customElement('activity-details-tab')
export class ActivityDetailsTab extends LitElement {
  @property() activityId: string | null = null;
  private routeUnsubscribe!: Callback;

  connectedCallback(): void {
    super.connectedCallback();
    this.routeUnsubscribe = store.subscribe(
      routeDetailsSelector(({routeName}: EtoolsRouteDetails) => {
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

  checkActivityId(): TemplateResult {
    return this.activityId === 'new'
      ? html``
      : html`
          <monitor-information-card class="page-content"></monitor-information-card>
          <entities-monitor-card class="page-content"></entities-monitor-card>
        `;
  }

  render(): TemplateResult {
    // language=HTML
    return html`
      <details-note-card></details-note-card>
      <activity-details-card class="page-content"></activity-details-card>
      ${this.checkActivityId()}
    `;
  }

  static get styles(): CSSResult[] {
    // language=CSS
    return [pageLayoutStyles];
  }
}
