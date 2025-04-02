import {store} from '../../../redux/store';
import {sitesSelector} from '../../../redux/selectors/site-specific-locations.selectors';
import {locationsInvert} from '../../pages/management/sites/locations-invert';
import {Unsubscribe} from 'redux';
import {LitElement, PropertyDeclarations} from 'lit';

/* @LitMixin */
export const SiteMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    locations: IGroupedSites[] = [];
    private sitesUnsubscribe!: Unsubscribe;

    static get properties(): PropertyDeclarations {
      // @ts-ignore
      const superProps: PropertyDeclarations = super.properties;
      return {
        ...superProps,
        locations: {type: Array}
      };
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.sitesUnsubscribe = store.subscribe(
        sitesSelector((sites: Site[] | null) => {
          if (!sites) {
            return;
          }
          this.locations = locationsInvert(sites);
        })
      );
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.sitesUnsubscribe();
    }
  };
