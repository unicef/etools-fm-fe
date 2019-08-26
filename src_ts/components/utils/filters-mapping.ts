import { IEtoolsFilter } from '../common/layout/filters/etools-filters';

export function mapFilters(
    filters: IEtoolsFilter[],
    options: GenericObject = {},
    values: GenericObject = {}
): IEtoolsFilter[] {
    return filters.map((filter: IEtoolsFilter) => {
        const property: string = filter.filterKey;
        return {
            ...filter,
            selectionOptions: options[property] || [],
            selectedValue: values[property] || filter.defaultValue,
            selected: Boolean(values[property])
        };
    });
}
