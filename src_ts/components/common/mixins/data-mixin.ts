import { LitElement } from 'lit-element';
import clone from 'ramda/es/clone';
import { PropertyDeclarations } from 'lit-element/src/lib/updating-element';

// tslint:disable-next-line:typedef
export const DataMixin = <T, B extends Constructor<LitElement>>(superclass: B) => class extends superclass {
    public editedData: Partial<T> = {};
    public originalData!: T | null;
    public errors: GenericObject = {};

    public set data(data: T | null) {
        this.editedData = !data ? {} : { ...this.editedData, ...data };
        this.originalData = clone(data);
    }

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public resetFieldError(fieldName: string): void {
        if (!this.errors) { return; }
        delete this.errors[fieldName];
        this.performUpdate();
    }

    public updateModelValue(fieldName: keyof T, value: any): void {
        if (!this.editedData) { return; }
        // sets values from inputs to model, refactor arrays with objects to ids arrays
        this.editedData[fieldName] = !Array.isArray(value) ?
            value :
            value.map((item: any) => item.id);
    }

    public static get properties(): PropertyDeclarations {
        // @ts-ignore
        const superProps: PropertyDeclarations = super.properties;
        return {
            ...superProps,
            editedData: { type: Object }
        };
    }
};
