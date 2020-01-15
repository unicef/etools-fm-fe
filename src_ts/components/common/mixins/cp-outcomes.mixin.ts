import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {cpOutcomesDataSelector} from '../../../redux/selectors/static-data.selectors';
import {PropertyDeclarations} from 'lit-element/src/lib/updating-element';
import {LitElement} from 'lit-element';
import {loadStaticData} from '../../../redux/effects/load-static-data.effect';
import {CP_OUTCOMES} from '../../../endpoints/endpoints-list';

// eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type
export const CpOutcomesMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    cpOutcomes: EtoolsCpOutcome[] = [];

    private cpOutcomesUnsubscribe!: Unsubscribe;

    static get properties(): PropertyDeclarations {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
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
