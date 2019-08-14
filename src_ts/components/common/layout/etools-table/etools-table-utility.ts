/**
 * Utility functions used in etools data lists
 */
import { EtoolsTableColumnSort, IEtoolsTableColumn } from './etools-table';

export interface IEtoolsTableSortItem {
  name: string;
  sort: EtoolsTableColumnSort;
}

export const getUrlQueryStringSort: (sortFields: IEtoolsTableSortItem[]) => string = (sortFields: IEtoolsTableSortItem[]): string => {
  let sort: string = '';
  if (sortFields.length > 0) {
    sort = sortFields.map((sortItem: IEtoolsTableSortItem) => `${sortItem.name}.${sortItem.sort}`).join('|');
  }
  return sort;
};

export const getSortFields: (columns: IEtoolsTableColumn[]) => IEtoolsTableSortItem[] = (columns: IEtoolsTableColumn[]): IEtoolsTableSortItem[] => {
  let sortItems: IEtoolsTableSortItem[] = [];
  const sortedColumns: any[] = columns.filter((c: IEtoolsTableColumn) => c.sort !== undefined);
  if (sortedColumns.length > 0) {
    sortItems = sortedColumns.map((c: IEtoolsTableColumn) =>
        Object.assign({}, { name: c.name, sort: c.sort })) as IEtoolsTableSortItem[];
  }
  return sortItems;
};

export const getSortFieldsFromUrlSortParams: (param: string) => IEtoolsTableSortItem[] = (param: string): IEtoolsTableSortItem[] => {
  const sortFields: IEtoolsTableSortItem[] = param.split('|').map((sort: string) => {
    const s: string[] = sort.split('.');
    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    const sortItem: IEtoolsTableSortItem = {
      name: s[0],
      sort: s[1]
    } as IEtoolsTableSortItem;
    return sortItem;
  });
  return sortFields;
};

export const buildUrlQueryString: (params: GenericObject) => string = (params: GenericObject): string => {
  const queryParams: any[] = [];

  for (const param in params) {
    if (params[param]) {
      const paramValue: any = params[param];
      let filterUrlValue!: string;

      if (paramValue instanceof Array && paramValue.length > 0) {
        filterUrlValue = paramValue.join('|');
      } else if (typeof paramValue === 'boolean') {
        if (paramValue) { // ignore if it's false
          filterUrlValue = 'true';
        }
      } else {
        if (!(param === 'page' && paramValue === 1)) { // do not include page if page=1
          filterUrlValue = String(paramValue).trim();
        }
      }

      if (filterUrlValue) {
        queryParams.push(param + '=' + filterUrlValue);
      }
    }
  }

  return queryParams.join('&');
};

export const getSelectedFiltersFromUrlParams: (selectedFilters: GenericObject, params: GenericObject) => GenericObject = (selectedFilters: GenericObject,
                                                                                                                          params: GenericObject): GenericObject => {
  const filters: GenericObject = { ...selectedFilters };
  for (const param in params) {
    if (params[param]) {
      if (filters[param] instanceof Array) {
        filters[param] = params[param].split('|');
      } else if (typeof filters[param] === 'boolean') {
        filters[param] = params[param] === 'true';
      } else {
        filters[param] = params[param];
      }
    }
  }
  return filters;
};
