import {connect} from 'pwa-helpers/connect-mixin.js';
import {store} from '../../../redux/store';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import {logError} from '@unicef-polymer/etools-behaviors/etools-logging';
import {EtoolsDropdownEl} from '@unicef-polymer/etools-dropdown/etools-dropdown';
import {customElement, html, LitElement, property, query, TemplateResult} from 'lit-element';
// import EndpointsMixin from '../../endpoints/endpoints-mixin.js';
import {fireEvent} from '../../utils/fire-custom-event';
import {changeCurrentUserCountry} from '../../../redux/effects/country.effects';
import {countrySelector} from '../../../redux/selectors/country.selectors';
import {DEFAULT_ROUTE, updateAppLocation} from '../../../routing/routes';
import {ROOT_PATH} from '../../../config/config';
import {isEmpty} from 'ramda';
import {countriesDropdownStyles} from './countries-dropdown-styles';
import {GlobalLoadingUpdate} from '../../../redux/actions/global-loading.actions';
import {etoolsCustomDexieDb} from '../../../endpoints/dexieDb';

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

  @property({type: Boolean})
  countrySelectorVisible = false;

  @property({type: Object})
  userData!: IEtoolsUserModel;

  @query('#countrySelector') private countryDropdown!: EtoolsDropdownEl;

  constructor() {
    super();
    store.subscribe(
      countrySelector((countryState: IRequestState) => {
        this.changeRequestStatus(countryState.isRequest.load);
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
      ${countriesDropdownStyles}
      <!-- shown options limit set to 250 as there are currently 195 countries in the UN council and about 230 total -->
      <etools-dropdown
        id="countrySelector"
        .selected="${this.currentCountry.id}"
        placeholder="Country"
        allow-outside-scroll
        no-label-float
        .options="${this.countries}"
        option-label="name"
        option-value="id"
        trigger-value-change-event
        @etools-selected-item-changed="${this.countrySelected}"
        shown-options-limit="250"
        ?hidden="${!this.countrySelectorVisible}"
        hide-search
        .minWidth="160px"
        .autoWidth="${true}"
      ></etools-dropdown>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    setTimeout(() => {
      const fitInto: HTMLElement | null = document
        .querySelector('app-shell')!
        .shadowRoot!.querySelector('#appHeadLayout');
      this.countryDropdown.set('fitInto', fitInto);
    }, 0);
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

      this.showCountrySelector(this.countries);
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

  protected showCountrySelector(countries: any): void {
    if (Array.isArray(countries) && countries.length > 1) {
      this.countrySelectorVisible = true;
    }
  }

  protected triggerCountryChangeRequest(selectedCountryId: number): void {
    localStorage.clear();
    etoolsCustomDexieDb
      .delete()
      .finally(() => store.dispatch<AsyncEffect>(changeCurrentUserCountry(selectedCountryId)));
  }

  protected changeRequestStatus(isRequest: boolean): void {
    const detail: any = isRequest
      ? {
          message: 'Please wait while country data is changing...',
          active: true,
          loadingSource: 'country-change'
        }
      : {
          active: false,
          loadingSource: 'country-change'
        };
    fireEvent(this, 'global-loading', detail);
    store.dispatch(new GlobalLoadingUpdate(detail.message));
  }

  protected handleChangedCountry(): void {
    updateAppLocation(DEFAULT_ROUTE);
    document.location.assign(window.location.origin + ROOT_PATH);
  }

  protected handleCountryChangeError(error: any): void {
    logError('Country change failed!', 'countries-dropdown', error);
    this.countryDropdown.set('selected', this.currentCountry.id);
    fireEvent(this, 'toast', {text: 'Something went wrong changing your workspace. Please try again'});
  }
}
