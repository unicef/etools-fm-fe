import { LitElement } from 'lit-element';
import { staticDataDynamic } from '../../../redux/selectors/static-data.selectors';
import { store } from '../../../redux/store';
import { Unsubscribe } from 'redux';
import { PropertyDeclarations } from 'lit-element/src/lib/updating-element';
import { loadStaticData } from '../../../redux/effects/load-static-data.effect';
import { METHODS } from '../../../endpoints/endpoints-list';

// tslint:disable-next-line:typedef
export const MethodsMixin = <T extends Constructor<LitElement>>(superclass: T) => class extends superclass {
    public methods!: EtoolsMethod[];

    private methodsUnsubscribe!: Unsubscribe;

    public connectedCallback(): void {
        super.connectedCallback();
        this.methodsUnsubscribe = store.subscribe(staticDataDynamic((methods: EtoolsMethod[] | undefined) => {
            if (!methods) { return; }
            this.methods = methods;
        }, [METHODS]));
        const data: IStaticDataState = (store.getState() as IRootState).staticData;
        if (!data.methods) {
            store.dispatch<AsyncEffect>(loadStaticData(METHODS));
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.methodsUnsubscribe();
    }

    public static get properties(): PropertyDeclarations {
        // @ts-ignore
        const superProps: PropertyDeclarations = super.properties;
        return {
            ...superProps,
            methods: { type: Array }
        };
    }

    public getMethodName(methodId: number): string {
        if (!methodId || !this.methods) { return ''; }
        const methodData: EtoolsMethod | undefined = this.methods.find((method: EtoolsMethod) => method.id === methodId);
        return methodData && methodData.name || '';
    }
};
