import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {cpOutcomesDataSelector} from '../../../redux/selectors/static-data.selectors';
import {LitElement, PropertyDeclarations} from 'lit';
import {loadStaticData} from '../../../redux/effects/load-static-data.effect';
import {CP_OUTCOMES} from '../../../endpoints/endpoints-list';

/* @LitMixin */
export const CpOutcomesMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    cpOutcomes: EtoolsCpOutcome[] = [];

    private cpOutcomesUnsubscribe!: Unsubscribe;

    static get properties(): PropertyDeclarations {
      // @ts-ignore
      const superProps: PropertyDeclarations = super.properties;
      return {
        ...superProps,
        cpOutcomes: {type: Array}
      };
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.cpOutcomesUnsubscribe = store.subscribe(
        cpOutcomesDataSelector((cpOutcomes: EtoolsCpOutcome[] | undefined) => {
          if (!cpOutcomes) {
            return;
          }
          this.cpOutcomes = cpOutcomes;
        })
      );
      const data: IStaticDataState = (store.getState() as IRootState).staticData;
      if (!data.cpOutcomes) {
        store.dispatch<AsyncEffect>(loadStaticData(CP_OUTCOMES));
      }
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.cpOutcomesUnsubscribe();
    }
  };
