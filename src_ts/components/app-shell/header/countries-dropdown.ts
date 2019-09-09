import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../redux/store';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import { logError } from '@unicef-polymer/etools-behaviors/etools-logging';
import { EtoolsDropdownEl } from '@unicef-polymer/etools-dropdown/etools-dropdown';
import { customElement, html, LitElement, property, query, TemplateResult } from 'lit-element';

// import EndpointsMixin from '../../endpoints/endpoints-mixin.js';
import { fireEvent } from '../../utils/fire-custom-event';
import { countriesDropdownStyles } from './countries-dropdown-styles';
import { changeCurrentUserCountry } from '../../../redux/effects/country.effects';
import { countrySelector } from '../../../redux/selectors/country.selectors';
import { DEFAULT_ROUTE, updateAppLocation } from '../../../routing/routes';
import { ROOT_PATH } from '../../../config/config';
import { isEmpty } from 'lodash-es';

/**
 * @LitElement
 * @customElement
 */
@customElement('countries-dropdown')
export class CountriesDropdown extends connect(store)(LitElement) {

    @property({ type: Object })
    public currentCountry: GenericObject = {};

    @property({ type: Array })
    public countries: any[] = [];

    @property({ type: Boolean })
    public countrySelectorVisible: boolean = false;

    @property({ type: Object })
    public userData!: IEtoolsUserModel;

    @query('#countrySelector') private countryDropdown!: EtoolsDropdownEl;

    public constructor() {
        super();
        store.subscribe(countrySelector((countryState: IRequestState) => {
            this.changeRequestStatus(countryState.isRequest);
            if (!countryState.isRequest && !countryState.error) {
                this.handleChangedCountry();
            }
            if (!countryState.isRequest && !isEmpty(countryState.error)) {
                this.handleCountryChangeError(countryState.error);
            }
        }));
    }

    public render(): TemplateResult {
        // main template
        // language=HTML
        return html`
      ${countriesDropdownStyles}
      <!-- shown options limit set to 250 as there are currently 195 countries in the UN council and about 230 total -->
      <etools-dropdown id="countrySelector"
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
                       hide-search></etools-dropdown>

    `;
    }

    public connectedCallback(): void {
        super.connectedCallback();

        setTimeout(() => {
            const fitInto: HTMLElement | null =
                document.querySelector('app-shell')!.shadowRoot!.querySelector('#appHeadLayout');
            this.countryDropdown.set('fitInto', fitInto);
        }, 0);
    }

    public stateChanged(state: IRootState): void {
        if (!state.user || !state.user.data || JSON.stringify(this.userData) === JSON.stringify(state.user.data)) {
            return;
        }
        this.userData = state.user.data;
        this.userDataChanged(this.userData);
    }

    public userDataChanged(userData: IEtoolsUserModel): void {
        if (userData) {
            this.countries = userData.countries_available;
            this.currentCountry = userData.country;

            this.showCountrySelector(this.countries);
        }

    }

    public countrySelected(e: CustomEvent): void {
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
        if (Array.isArray(countries) && (countries.length > 1)) {
            this.countrySelectorVisible = true;
        }
    }

    protected triggerCountryChangeRequest(selectedCountryId: number): void {
        store.dispatch<AsyncEffect>(changeCurrentUserCountry(selectedCountryId));
    }

    protected changeRequestStatus(isRequest: boolean): void {
        const detail: any = isRequest ? {
            message: 'Please wait while country data is changing...',
            active: true,
            loadingSource: 'country-change'
        } : {
            active: false,
            loadingSource: 'country-change'
        };
        fireEvent(this, 'global-loading', detail);
    }

    protected handleChangedCountry(): void {
        updateAppLocation(DEFAULT_ROUTE);
        document.location.assign(window.location.origin + ROOT_PATH);
    }

    protected handleCountryChangeError(error: any): void {
        logError('Country change failed!', 'countries-dropdown', error);
        this.countryDropdown.set('selected', this.currentCountry.id);
        fireEvent(this, 'toast', { text: 'Something went wrong changing your workspace. Please try again' });
    }

}