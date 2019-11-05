import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {outputsDataSelector} from '../../../redux/selectors/static-data.selectors';
import {PropertyDeclarations} from 'lit-element/src/lib/updating-element';
import {LitElement} from 'lit-element';

// eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type
export const CpOutputsMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    outputs!: EtoolsCpOutput[];

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
        outputsDataSelector((outputs: EtoolsCpOutput[] | undefined) => {
          if (!outputs) {
            return;
          }
          this.outputs = outputs;
        })
      );
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.outputsUnsubscribe();
    }
  };
