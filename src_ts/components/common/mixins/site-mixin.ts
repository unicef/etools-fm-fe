import {store} from '../../../redux/store';
import {sitesSelector} from '../../../redux/selectors/site-specific-locations.selectors';
import {locationsInvert} from '../../pages/management/sites-tab/locations-invert';
import {Unsubscribe} from 'redux';
import {LitElement} from 'lit';
import {PropertyDeclarations} from 'lit-element/src/lib/updating-element';

/* eslint-disable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
/* @polymerMixin */
export const SiteMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    /* eslint-enable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
    locations: IGroupedSites[] = [];
    private sitesUnsubscribe!: Unsubscribe;

    static get properties(): PropertyDeclarations {
      // eslint-disable-next-line
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
      super.disconnectedCallback && super.disconnectedCallback();
      this.sitesUnsubscribe();
    }
  };
