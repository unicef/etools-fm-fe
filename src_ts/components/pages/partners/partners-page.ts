import {LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../../common/layout/page-content-header/page-content-header';
import {store} from '../../../redux/store';
import {tpmPartners} from '../../../redux/reducers/tpm-partners.reducer';
import {SharedStyles} from '../../styles/shared-styles';
// eslint-disable-next-line
import {pageContentHeaderSlottedStyles} from '../../common/layout/page-content-header/page-content-header-slotted-styles';

import {routeDetailsSelector} from '../../../redux/selectors/app.selectors';
import {RouterStyles} from '../../app-shell/router-style';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

store.addReducers({tpmPartners});
export const PARTNERS_PAGE = 'partners';
export const PARTNERS_LIST_PAGE = 'list';
export const PARTNER_DETAILS_PAGE = 'item';

@customElement('partners-page')
export class PartnersPageComponent extends LitElement {
  @property() subRoute: string = PARTNERS_LIST_PAGE;

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
    store.subscribe(
      routeDetailsSelector(({routeName, subRouteName}: EtoolsRouteDetails) => {
        if (routeName !== PARTNERS_PAGE) {
          return;
        }
        this.subRoute = subRouteName as string;
      })
    );
  }

  getPage(): TemplateResult {
    switch (this.subRoute) {
      case PARTNERS_LIST_PAGE:
        return html` <partners-list class="page" active></partners-list> `;
      case PARTNER_DETAILS_PAGE:
        return html` <partner-details class="page" active></partner-details> `;
      default:
        return html``;
    }
  }
}
