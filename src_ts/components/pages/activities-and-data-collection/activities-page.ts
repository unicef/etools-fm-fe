import {html, LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../../common/layout/page-content-header/page-content-header';
import {store} from '../../../redux/store';
import {activities} from '../../../redux/reducers/activities.reducer';
import {SharedStyles} from '../../styles/shared-styles';
import {pageContentHeaderSlottedStyles} from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import {routeDetailsSelector} from '../../../redux/selectors/app.selectors';
import {RouterStyles} from '../../app-shell/router-style';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {loadStaticData} from '../../../redux/effects/load-static-data.effect';
import {USERS} from '../../../endpoints/endpoints-list';

store.addReducers({activities});
export const ACTIVITIES_PAGE = 'activities';
export const ACTIVITIES_LIST_PAGE = 'list';
export const ACTIVITY_ITEM_PAGE = 'item';
export const DATA_COLLECTION_PAGE = 'data-collection';

const PAGE: string = ACTIVITIES_PAGE;

const LIST_ROUTE: string = ACTIVITIES_LIST_PAGE;
const ITEM_ROUTE: string = ACTIVITY_ITEM_PAGE;
const COLLECT_ROUTE: string = DATA_COLLECTION_PAGE;

@customElement('activities-page')
export class ActivitiesPageComponent extends LitElement {
  @property() subRoute: string = LIST_ROUTE;

  static get styles(): CSSResultArray {
    return [SharedStyles, pageContentHeaderSlottedStyles, pageLayoutStyles, RouterStyles];
  }

  render(): TemplateResult | void {
    return html`<style>
        :host > * {
          position: relative;
        }
      </style>
      ${this.getPage()} `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    const data: IStaticDataState = (store.getState() as IRootState).staticData;
    if (!data.users) {
      store.dispatch<AsyncEffect>(loadStaticData(USERS));
    }
    store.subscribe(
      routeDetailsSelector(({routeName, subRouteName}: EtoolsRouteDetails) => {
        if (routeName !== PAGE) {
          return;
        }
        this.subRoute = subRouteName as string;
      })
    );
  }

  getPage(): TemplateResult {
    switch (this.subRoute) {
      case LIST_ROUTE:
        return html` <activities-list class="page" active></activities-list> `;
      case ITEM_ROUTE:
        return html` <activity-item class="page" active></activity-item> `;
      case COLLECT_ROUTE:
        return html` <data-collection-checklist class="page" active></data-collection-checklist> `;
      default:
        return html``;
    }
  }
}
