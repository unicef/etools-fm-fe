import {LitElement} from 'lit-element';
import {staticDataDynamic} from '../../../redux/selectors/static-data.selectors';
import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {PropertyDeclarations} from 'lit-element/src/lib/updating-element';
import {loadStaticData} from '../../../redux/effects/load-static-data.effect';
import {METHODS} from '../../../endpoints/endpoints-list';

/* eslint-disable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
/* @polymerMixin */
export const MethodsMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    /* eslint-enable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
    methods: EtoolsMethod[] = [];

    private methodsUnsubscribe!: Unsubscribe;

    connectedCallback(): void {
      super.connectedCallback();
      this.methodsUnsubscribe = store.subscribe(
        staticDataDynamic(
          (methods: EtoolsMethod[] | undefined) => {
            if (!methods) {
              return;
            }
            this.methods = methods;
          },
          [METHODS]
        )
      );
      const data: IStaticDataState = (store.getState() as IRootState).staticData;
      if (!data.methods) {
        store.dispatch<AsyncEffect>(loadStaticData(METHODS));
      }
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.methodsUnsubscribe();
    }

    static get properties(): PropertyDeclarations {
      // eslint-disable-next-line
      // @ts-ignore
      const superProps: PropertyDeclarations = super.properties;
      return {
        ...superProps,
        methods: {type: Array}
      };
    }

    getMethodName(methodId: number, short?: boolean): string {
      if (!methodId || !this.methods) {
        return '';
      }
      const property: 'name' | 'short_name' = short ? 'short_name' : 'name';
      const methodData: EtoolsMethod | undefined = this.methods.find((method: EtoolsMethod) => method.id === methodId);
      return (methodData && methodData[property]) || '';
    }
  };
