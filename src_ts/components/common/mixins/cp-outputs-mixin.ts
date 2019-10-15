import { store } from '../../../redux/store';
import { Unsubscribe } from 'redux';
import { outputsDataSelector } from '../../../redux/selectors/static-data.selectors';
import { LitElement } from 'lit-element';
import { PropertyDeclarations } from 'lit-element/src/lib/updating-element';

// tslint:disable-next-line:typedef
export const CpOutputsMixin = <T extends Constructor<LitElement>>(superclass: T) => class extends superclass {
    public outputs!: EtoolsCpOutput[];

    private outputsUnsubscribe!: Unsubscribe;

    public connectedCallback(): void {
        super.connectedCallback();
        this.outputsUnsubscribe = store.subscribe(outputsDataSelector((outputs: EtoolsCpOutput[] | undefined) => {
            if (!outputs) { return; }
            this.outputs = outputs;
        }));
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.outputsUnsubscribe();
    }

    public static get properties(): PropertyDeclarations {
        // @ts-ignore
        const superProps: PropertyDeclarations = super.properties;
        return {
            ...superProps,
            outputs: { type: Array }
        };
    }
};
