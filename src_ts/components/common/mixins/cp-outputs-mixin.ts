import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {staticDataDynamic} from '../../../redux/selectors/static-data.selectors';
import {LitElement, PropertyDeclarations} from 'lit';
import {loadStaticData} from '../../../redux/effects/load-static-data.effect';
import {CP_OUTPUTS, CP_OUTPUTS_ACTIVE} from '../../../endpoints/endpoints-list';

/* @LitMixin */
export const CpOutputsMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    outputs: EtoolsCpOutput[] = [];
    outputsActive: EtoolsCpOutput[] = [];

    private outputsUnsubscribe!: Unsubscribe;
    private outputsActiveUnsubscribe!: Unsubscribe;

    static get properties(): PropertyDeclarations {
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
      this.outputsActiveUnsubscribe = store.subscribe(
        staticDataDynamic(
          (outputsActive?: EtoolsCpOutput[]) => {
            if (!outputsActive) {
              return;
            }
            this.outputsActive = outputsActive;
          },
          [CP_OUTPUTS_ACTIVE]
        )
      );
      const data: IStaticDataState = (store.getState() as IRootState).staticData;
      if (!data.outputs) {
        store.dispatch<AsyncEffect>(loadStaticData(CP_OUTPUTS));
      }
      if (!data.outputsActive) {
        store.dispatch<AsyncEffect>(loadStaticData(CP_OUTPUTS_ACTIVE));
      }
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.outputsUnsubscribe();
      this.outputsActiveUnsubscribe();
    }
  };
