import { EtoolsFilterTypes, IEtoolsFilter } from '../../../common/layout/filters/etools-filters';

export const defaultSelectedFilters: GenericObject = {
  q: '',
  staff_member: [],
  status: [],
  unicef_focal_point: [],
  partner: [],
  assessment_date: null
};

export const engagementsFilters: IEtoolsFilter[] = [
  {
    filterName: 'Search engagement',
    filterKey: 'q',
    type: EtoolsFilterTypes.Search,
    selectedValue: '',
    selected: true
  },
  {
    filterName: 'Staff Member',
    filterKey: 'staff_member',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: 'Status',
    filterKey: 'status',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: 'Unicef Focal Point',
    filterKey: 'unicef_focal_point',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: 'Partner Org',
    filterKey: 'partner',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    selected: true,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: 'Assessment Date',
    filterKey: 'assessment_date',
    type: EtoolsFilterTypes.Date,
    selectedValue: null,
    selected: false
  }
];

export const updateFiltersSelectedValues: (selectedFilters: GenericObject, filters: IEtoolsFilter[]) => IEtoolsFilter[] = (selectedFilters: GenericObject, filters: IEtoolsFilter[]) => {
  const updatedFilters: IEtoolsFilter[] = [...filters];
  for (const fKey in selectedFilters) {
    if (selectedFilters[fKey]) {
      const filter: IEtoolsFilter | undefined = updatedFilters.find((f: IEtoolsFilter) => f.filterKey === fKey);
      if (filter) {
        filter.selectedValue = selectedFilters[fKey] instanceof Array
            ? [...selectedFilters[fKey]]
            : selectedFilters[fKey];
      }
    }
  }
  return updatedFilters;
};
