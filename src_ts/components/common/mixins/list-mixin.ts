import {updateQueryParams} from '../../../routing/routes';
import {PropertyDeclarations} from 'lit-element/src/lib/updating-element';
import {LitElement} from 'lit-element';

// eslint-disable-next-line @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type
export const ListMixin = <T>(superclass: typeof LitElement) =>
  class extends superclass {
    count: number = 0;
    queryParams: GenericObject | null = null;
    items: T[] = [];

    static get properties(): PropertyDeclarations {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const superProps: PropertyDeclarations = super.properties;
      return {
        ...superProps,
        queryParams: {type: Object},
        count: {type: Number},
        items: {type: Array}
      };
    }

    get tableInformation(): TableInformation {
      const {page, page_size}: GenericObject = this.queryParams || {};
      const notEnoughData: boolean = !page_size || !page || !this.count || !this.items;
      const end: number = notEnoughData ? 0 : Math.min(page * page_size, this.count);
      const start: number = notEnoughData ? 0 : end - this.items.length + 1;
      return {start, end, count: this.count};
    }

    changeSort({field, direction}: SortDetails): void {
      updateQueryParams({ordering: `${direction === 'desc' ? '-' : ''}${field}`});
    }

    changePageParam(newValue: string | number, paramName: string): void {
      const currentValue: number | string = (this.queryParams && this.queryParams[paramName]) || 0;
      if (+newValue === +currentValue) {
        return;
      }
      const newParams: IRouteQueryParams = {[paramName]: newValue};
      if (paramName === 'page_size') {
        newParams.page = 1;
      }
      updateQueryParams({[paramName]: newValue});
    }
  };
