import {LitElement} from 'lit-element';
import clone from 'ramda/es/clone';
import {PropertyDeclarations} from 'lit-element/src/lib/updating-element';

// eslint-disable-next-line @typescript-eslint/typedef
export const DataMixin = <B extends Constructor<LitElement>>() => <T>(superclass: B) =>
  class extends superclass {
    editedData: Partial<T> = {};
    originalData!: T | null;
    errors: GenericObject = {};

    static get properties(): PropertyDeclarations {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const superProps: PropertyDeclarations = super.properties;
      return {
        ...superProps,
        errors: {type: Object},
        editedData: {type: Object}
      };
    }

    set data(data: T | null) {
      this.editedData = !data ? {} : {...this.editedData, ...data};
      this.originalData = clone(data);
    }

    connectedCallback(): void {
      super.connectedCallback();
    }

    resetFieldError(fieldName: string): void {
      if (!this.errors) {
        return;
      }
      delete this.errors[fieldName];
      this.performUpdate();
    }

    updateModelValue(fieldName: keyof T, value: any): void {
      if (!this.editedData) {
        return;
      }
      // sets values from inputs to model, refactor arrays with objects to ids arrays
      this.editedData[fieldName] = !Array.isArray(value) ? value : value.map((item: any) => item.id);
      this.requestUpdate();
    }
  };
