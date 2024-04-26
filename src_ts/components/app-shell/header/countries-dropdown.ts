import {connect} from '@unicef-polymer/etools-utils/dist/pwa.utils';
import {store} from '../../../redux/store';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import {EtoolsLogger} from '@unicef-polymer/etools-utils/dist/singleton/logger';
import {EtoolsDropdownEl} from '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';

import {html, LitElement, TemplateResult} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {changeCurrentUserCountry} from '../../../redux/effects/country.effects';
import {countrySelector} from '../../../redux/selectors/country.selectors';
import {updateAppLocation} from '../../../routing/routes';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {ROOT_PATH} from '../../../config/config';
import {isEmpty} from 'ramda';
import {headerDropdownStyles} from './header-dropdown-styles';
import {GlobalLoadingUpdate} from '../../../redux/actions/global-loading.actions';
import {etoolsCustomDexieDb} from '../../../endpoints/dexieDb';
import {get as getTranslation} from 'lit-translate';
import {EtoolsRedirectPath} from '@unicef-polymer/etools-utils/dist/enums/router.enum';

/**
 * @LitElement
 * @customElement
 */
@customElement('countries-dropdown')
export class CountriesDropdown extends connect(store)(LitElement) {
  @property({type: Object})
  currentCountry: GenericObject = {};

  @property({type: Array})
  countries: any[] = [];

  @property({type: Object})
  userData!: IEtoolsUserModel;

  @query('#countrySelector') private countryDropdown!: EtoolsDropdownEl;

  constructor() {
    super();
    store.subscribe(
      countrySelector((countryState: IRequestState) => {
        this.changeRequestStatus(countryState.isRequest.load);
        if (countryState.isRequest.load) {
          return;
        }
        if (!countryState.error) {
          this.handleChangedCountry();
        }
        if (!countryState.isRequest && countryState.error && !isEmpty(countryState.error)) {
          this.handleCountryChangeError(countryState.error);
        }
      })
    );
  }

  render(): TemplateResult {
    // main template
    // language=HTML
    return html`
      ${headerDropdownStyles}
      <!-- shown options limit set to 250 as there are currently 195 countries in the UN council and about 230 total -->
      <etools-dropdown
        transparent
        id="countrySelector"
        class="w100"
        .selected="${this.currentCountry.id}"
        placeholder="Country"
        allow-outside-scroll
        no-label-float
        .options="${this.countries}"
        option-label="name"
        option-value="id"
        trigger-value-change-event
        @etools-selected-item-changed="${this.countrySelected}"
        .shownOptionsLimit="${250}"
        hide-search
        min-width="160px"
        placement="bottom-end"
        .syncWidth="${false}"
      ></etools-dropdown>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  stateChanged(state: IRootState): void {
    if (!state.user || !state.user.data || JSON.stringify(this.userData) === JSON.stringify(state.user.data)) {
      return;
    }
    this.userData = state.user.data;
    this.userDataChanged(this.userData);
  }

  userDataChanged(userData: IEtoolsUserModel): void {
    if (userData) {
      this.countries = userData.countries_available;
      this.currentCountry = userData.country;
    }
  }

  countrySelected(e: CustomEvent): void {
    if (!e.detail.selectedItem) {
      return;
    }

    const selectedCountryId: number = parseInt(e.detail.selectedItem.id, 10);

    if (selectedCountryId !== this.currentCountry.id) {
      // send post request to change_country endpoint
      this.triggerCountryChangeRequest(selectedCountryId);
    }
  }

  protected triggerCountryChangeRequest(selectedCountryId: number): void {
    localStorage.clear();
    etoolsCustomDexieDb.delete().finally(() => {
      store.dispatch<AsyncEffect>(changeCurrentUserCountry(selectedCountryId));
    });
  }

  protected changeRequestStatus(isRequest: boolean): void {
    const waitMessage = getTranslation('PLEASE_WAIT_COUNTRY_CHANGE');
    const detail: any = isRequest
      ? {
          message: waitMessage,
          active: true,
          loadingSource: 'country-change'
        }
      : {
          active: false,
          loadingSource: 'country-change'
        };
    fireEvent(this, 'global-loading', detail);
    if (detail.message || (!detail.message && store.getState().globalLoading.message?.includes(waitMessage))) {
      store.dispatch(new GlobalLoadingUpdate(detail.message));
    }
  }

  protected handleChangedCountry(): void {
    updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.DEFAULT));
    document.location.assign(window.location.origin + ROOT_PATH);
  }

  protected handleCountryChangeError(error: any): void {
    EtoolsLogger.error('Country change failed!', 'countries-dropdown', error);
    this.countryDropdown.selected = this.currentCountry.id;
    fireEvent(this, 'toast', {text: getTranslation('ERROR_CHANGING_WORKSPACE')});
  }
}
