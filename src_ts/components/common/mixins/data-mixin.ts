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
      const preparedValue: any = !Array.isArray(value) ? value : value.map((item: any) => item.id);
      const equals: boolean = this.checkEquality(this.editedData[fieldName], preparedValue);
      if (equals) {
        return;
      }
      // sets values from inputs to model, refactor arrays with objects to ids arrays
      this.editedData[fieldName] = preparedValue;
      this.requestUpdate();
    }

    private checkEquality(valueA: any, valueB: any): boolean {
      const baseValue: any[] = [valueA].flat();
      const valueToMatch: any[] = [valueB].flat();
      return (
        baseValue.length === valueToMatch.length &&
        baseValue.flat().every((value: any, index: number) => `${value}` === `${valueToMatch[index]}`)
      );
    }
  };
