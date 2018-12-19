import { RunGlobalLoading, StopGlobalLoading } from '../../redux-store/actions/global-loading.actions';
import { AddNotification } from '../../redux-store/actions/notification.actions';

class CountriesDropdown extends Polymer.mixinBehaviors([etoolsBehaviors.EtoolsRefreshBehavior],
    FMMixins.AppConfig(FMMixins.ReduxMixin(Polymer.Element))) {

    public countryIndex: number | undefined;
    public countryData: any;
    public url: any;
    public refreshInProgress: any;

    public static get is() { return 'countries-dropdown'; }

    public static get properties() {
        return {
            opened: {
                type: Boolean,
                reflectToAttribute: true,
                value: false
            },
            countries: {
                type: Array,
                value: []
            },
            countryId: {
                type: Number
            },
            countryIndex: {
                type: Number
            }
        };
    }

    public static get observers() {
        return [
            'setCountryIndex(countries, countryId)'
        ];
    }

    public connectedCallback() {
        // @ts-ignore
        super.connectedCallback();
        // @ts-ignore
        this.addEventListener('paper-dropdown-close', this.toggleOpened);
        // @ts-ignore
        this.addEventListener('paper-dropdown-open', this.toggleOpened);
    }

    public setCountryIndex(countries: UserCountry[], countryId: number) {
        if (!(countries instanceof Array)) { return; }

        this.countryIndex = countries.findIndex((country) => {
            return country.id === countryId;
        });
    }

    public _countrySelected(event: CustomEvent) {
        // @ts-ignore
        this.set('country', this.$.repeat.itemForElement(event.detail.item));
    }

    public _changeCountry(event: any) {
        const country = event && event.model && event.model.item;
        const id = country && country.id;

        if (Number(parseFloat(id)) !== id) {throw new Error('Can not find country id!'); }

        // @ts-ignore
        this.dispatchOnStore(new RunGlobalLoading({
            type: 'change-country',
            message: 'Please wait while country is changing...'}));

        this.countryData = {country: id};
        // @ts-ignore
        this.url = this.getEndpoint('changeCountry').url;
    }

    public _handleError() {
        this.countryData = null;
        this.url = null;
        // @ts-ignore
        this.dispatchOnStore(new StopGlobalLoading({type: 'change-country'}));
        // @ts-ignore
        this.dispatchOnStore(new AddNotification('Can not change country. Please, try again later'));
    }

    public _handleResponse() {
        this.refreshInProgress = true;
        // @ts-ignore
        this.clearDexieDbs();
        // @ts-ignore
        // TODO: fix clearDexieDbs logic
        this._triggerPageRefresh();
    }

    public _refreshPage() {
        this.refreshInProgress = false;
        window.location.href = `${window.location.origin}/fm/`;
    }

    private toggleOpened() {
        // @ts-ignore
        this.set('opened', this.$.dropdown.opened);
    }

}

window.customElements.define(CountriesDropdown.is, CountriesDropdown);
