import { store } from '../../../redux/store';
import { sitesSelector } from '../../../redux/selectors/site-specific-locations.selectors';
import { locationsInvert } from '../../pages/settings/sites-tab/locations-invert';
import { Unsubscribe } from 'redux';
import { LitElement } from 'lit-element';
import { PropertyDeclarations } from 'lit-element/src/lib/updating-element';

// tslint:disable-next-line:typedef
export const SiteMixin = <T extends Constructor<LitElement>>(superclass: T) => class extends superclass {
    public locations: IGroupedSites[] = [];
    private sitesUnsubscribe!: Unsubscribe;

    public connectedCallback(): void {
        super.connectedCallback();
        this.sitesUnsubscribe = store.subscribe(sitesSelector((sites: Site[] | null) => {
            if (!sites) {
                return;
            }
            this.locations = locationsInvert(sites);
        }));
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback && super.disconnectedCallback();
        this.sitesUnsubscribe();
    }

    public static get properties(): PropertyDeclarations {
        // @ts-ignore
        const superProps: PropertyDeclarations = super.properties;
        return {
            ...superProps,
            locations: { type: Array }
        };
    }
};
