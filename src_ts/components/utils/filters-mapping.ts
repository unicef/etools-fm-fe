import {IEtoolsFilter} from '../common/layout/filters/etools-filters';

export function mapFilters(
  filters: IEtoolsFilter[],
  options: GenericObject = {},
  values: GenericObject = {}
): IEtoolsFilter[] {
  return filters.map((filter: IEtoolsFilter) => {
    const property: string = filter.filterKey;
    return {
      ...filter,
      selectionOptions: options[property] || filter.selectionOptions || [],
      selectedValue: values[property] || filter.defaultValue,
      selected: Boolean(values[property])
    };
  });
}
