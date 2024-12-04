import {LitElement, PropertyDeclarations} from 'lit';
import clone from 'ramda/es/clone';
import equals from 'ramda/es/equals';

/* eslint-disable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
/* @LitMixin */
export const DataMixin =
  <B extends Constructor<LitElement>>() =>
  <T>(superclass: B) =>
    class extends superclass {
      /* eslint-enable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
      editedData: Partial<T> = {};
      originalData!: T | null;
      errors: GenericObject = {};

      static get properties(): PropertyDeclarations {
        // eslint-disable-next-line
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

      resetFieldError(fieldName: string, index?: number): void {
        if (!this.errors) {
          return;
        }
        if (typeof index !== 'number') {
          delete this.errors[fieldName];
        } else if (this.errors[fieldName]) {
          this.errors[fieldName][index] = null;
        }
        this.requestUpdate();
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
        if (typeof valueA === 'number') {
          valueA = valueA.toString();
        }

        if (typeof valueB === 'number') {
          valueB = valueB.toString();
        }

        return equals(valueA, valueB);

        // const baseValue: any[] = [valueA].flat();
        // const valueToMatch: any[] = [valueB].flat();
        // return (
        //   baseValue.length === valueToMatch.length &&
        //   baseValue.flat().every((value: any, index: number) => `${value}` === `${valueToMatch[index]}`)
        // );
      }
    };
