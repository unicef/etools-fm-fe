import {LitElement} from 'lit';
import {staticDataDynamic} from '../../../redux/selectors/static-data.selectors';
import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {PropertyDeclarations} from 'lit-element/src/lib/updating-element';
import {loadStaticData} from '../../../redux/effects/load-static-data.effect';
import {PARTNERS} from '../../../endpoints/endpoints-list';

/* eslint-disable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
/* @LitMixin */
export const PartnersMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    /* eslint-enable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
    partners: EtoolsPartner[] = [];

    private partnersUnsubscribe!: Unsubscribe;

    static get properties(): PropertyDeclarations {
      // eslint-disable-next-line
      // @ts-ignore
      const superProps: PropertyDeclarations = super.properties;
      return {
        ...superProps,
        partners: {type: Array}
      };
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.partnersUnsubscribe = store.subscribe(
        staticDataDynamic(
          (partners: EtoolsPartner[] | undefined) => {
            if (!partners) {
              return;
            }
            this.partners = partners;
          },
          [PARTNERS]
        )
      );
      const data: IStaticDataState = (store.getState() as IRootState).staticData;
      if (!data.partners) {
        store.dispatch<AsyncEffect>(loadStaticData(PARTNERS));
      }
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.partnersUnsubscribe();
    }
  };
