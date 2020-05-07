import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {staticDataDynamic} from '../../../redux/selectors/static-data.selectors';
import {PropertyDeclarations} from 'lit-element/src/lib/updating-element';
import {LitElement} from 'lit-element';
import {loadStaticData} from '../../../redux/effects/load-static-data.effect';
import {CP_OUTPUTS} from '../../../endpoints/endpoints-list';

/* eslint-disable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
/* @polymerMixin */
export const CpOutputsMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    /* eslint-enable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
    outputs: EtoolsCpOutput[] = [];

    private outputsUnsubscribe!: Unsubscribe;

    static get properties(): PropertyDeclarations {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const superProps: PropertyDeclarations = super.properties;
      return {
        ...superProps,
        outputs: {type: Array}
      };
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.outputsUnsubscribe = store.subscribe(
        staticDataDynamic(
          (outputs?: EtoolsCpOutput[]) => {
            if (!outputs) {
              return;
            }
            this.outputs = outputs;
          },
          [CP_OUTPUTS]
        )
      );
      const data: IStaticDataState = (store.getState() as IRootState).staticData;
      if (!data.outputs) {
        store.dispatch<AsyncEffect>(loadStaticData(CP_OUTPUTS));
      }
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.outputsUnsubscribe();
    }
  };
