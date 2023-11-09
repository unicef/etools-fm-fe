import {EtoolsFilterTypes, EtoolsFilter} from '@unicef-polymer/etools-unicef/src/etools-filters/etools-filters';
import {
  ACTION_POINTS_OFFICES,
  CP_OUTPUTS,
  INTERVENTIONS,
  LOCATIONS_ENDPOINT,
  PARTNERS,
  SECTIONS,
  TPM_PARTNERS,
  USERS
} from '../../../../endpoints/endpoints-list';
import {translate, get as getTranslation} from 'lit-translate';
import {FiltersHelper} from '@unicef-polymer/etools-unicef/src/etools-filters/filters-helper.class';
import {setselectedValueTypeByFilterKey} from '@unicef-polymer/etools-filters/src/filters';

export interface ActivityFilter extends EtoolsFilter {
  selectionOptionsEndpoint?: string;
}

export enum ActivityFilterKeys {
  monitor_type = 'monitor_type',
  tpm_partner__in = 'tpm_partner__in',
  team_members__in = 'team_members__in',
  visit_lead__in = 'visit_lead__in',
  location__in = 'location__in',
  location_site__in = 'location_site__in',
  partners__in = 'partners__in',
  offices__in = 'offices__in',
  interventions__in = 'interventions__in',
  cp_outputs__in = 'cp_outputs__in',
  status__in = 'status__in',
  start_date__gte = 'start_date__gte',
  end_date__lte = 'end_date__lte',
  sections__in = 'sections__in'
}

export const selectedValueTypeByFilterKey: GenericObject = {
  [ActivityFilterKeys.monitor_type]: 'string',
  [ActivityFilterKeys.tpm_partner__in]: 'Array',
  [ActivityFilterKeys.team_members__in]: 'Array',
  [ActivityFilterKeys.visit_lead__in]: 'Array',
  [ActivityFilterKeys.location__in]: 'Array',
  [ActivityFilterKeys.location_site__in]: 'Array',
  [ActivityFilterKeys.partners__in]: 'Array',
  [ActivityFilterKeys.offices__in]: 'Array',
  [ActivityFilterKeys.interventions__in]: 'Array',
  [ActivityFilterKeys.cp_outputs__in]: 'Array',
  [ActivityFilterKeys.status__in]: 'Array',
  [ActivityFilterKeys.start_date__gte]: 'string',
  [ActivityFilterKeys.end_date__lte]: 'string'
};

export const ActivitiesFiltersHelper = new FiltersHelper(selectedValueTypeByFilterKey);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getAllAtivitiesFilters() {
  return [
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.MONITOR_TYPE'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.MONITOR_TYPE',
      filterKey: ActivityFilterKeys.monitor_type,
      type: EtoolsFilterTypes.Dropdown,
      selectionOptions: [],
      selectedValue: null,
      optionValue: 'value',
      optionLabel: 'display_name',
      selected: false,
      minWidth: '350px',
      hideSearch: true,
      disabled: false
    },
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.TPM_PARTNERS'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.TPM_PARTNERS',
      filterKey: ActivityFilterKeys.tpm_partner__in,
      type: EtoolsFilterTypes.DropdownMulti,
      selectionOptions: [],
      selectedValue: [],
      optionValue: 'id',
      optionLabel: 'name',
      selected: false,
      minWidth: '350px',
      hideSearch: false,
      disabled: false,
      selectionOptionsEndpoint: TPM_PARTNERS
    },
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.TEAM_MEMBERS'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.TEAM_MEMBERS',
      filterKey: ActivityFilterKeys.team_members__in,
      type: EtoolsFilterTypes.DropdownMulti,
      selectionOptions: [],
      selectedValue: [],
      optionValue: 'id',
      optionLabel: 'name',
      selected: true,
      minWidth: '350px',
      hideSearch: false,
      disabled: false,
      selectionOptionsEndpoint: USERS
    },
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.VISIT_LEAD'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.VISIT_LEAD',
      filterKey: ActivityFilterKeys.visit_lead__in,
      type: EtoolsFilterTypes.DropdownMulti,
      selectionOptions: [],
      selectedValue: [],
      optionValue: 'id',
      optionLabel: 'name',
      selected: false,
      minWidth: '350px',
      hideSearch: false,
      disabled: false,
      selectionOptionsEndpoint: USERS
    },
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.LOCATION'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.LOCATION',
      filterKey: ActivityFilterKeys.location__in,
      type: EtoolsFilterTypes.DropdownMulti,
      selectionOptions: [],
      selectedValue: [],
      optionValue: 'id',
      optionLabel: 'name',
      selected: false,
      minWidth: '350px',
      hideSearch: false,
      disabled: false,
      selectionOptionsEndpoint: LOCATIONS_ENDPOINT
    },
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.SITE'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.SITE',
      filterKey: ActivityFilterKeys.location_site__in,
      type: EtoolsFilterTypes.DropdownMulti,
      selectionOptions: [],
      selectedValue: [],
      optionValue: 'id',
      optionLabel: 'name',
      selected: true,
      minWidth: '350px',
      hideSearch: false,
      disabled: false
    },
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.PARTNERS'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.PARTNERS',
      filterKey: ActivityFilterKeys.partners__in,
      type: EtoolsFilterTypes.DropdownMulti,
      selectionOptions: [],
      selectedValue: [],
      optionValue: 'id',
      optionLabel: 'name',
      selected: false,
      minWidth: '350px',
      hideSearch: false,
      disabled: false,
      selectionOptionsEndpoint: PARTNERS
    },
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.OFFICE'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.OFFICE',
      filterKey: ActivityFilterKeys.offices__in,
      type: EtoolsFilterTypes.DropdownMulti,
      selectionOptions: [],
      selectedValue: [],
      optionValue: 'id',
      optionLabel: 'name',
      selected: false,
      minWidth: '350px',
      hideSearch: false,
      disabled: false,
      selectionOptionsEndpoint: ACTION_POINTS_OFFICES
    },
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.INTERVENTIONS'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.INTERVENTIONS',
      filterKey: ActivityFilterKeys.interventions__in,
      type: EtoolsFilterTypes.DropdownMulti,
      selectionOptions: [],
      selectedValue: [],
      optionValue: 'id',
      optionLabel: 'title',
      selected: false,
      minWidth: '350px',
      hideSearch: false,
      disabled: false,
      selectionOptionsEndpoint: INTERVENTIONS
    },
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.CP_OUTPUTS'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.CP_OUTPUTS',
      filterKey: ActivityFilterKeys.cp_outputs__in,
      type: EtoolsFilterTypes.DropdownMulti,
      selectionOptions: [],
      selectedValue: [],
      optionValue: 'id',
      optionLabel: 'name',
      selected: false,
      minWidth: '350px',
      hideSearch: false,
      disabled: false,
      selectionOptionsEndpoint: CP_OUTPUTS
    },
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.STATUS'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.STATUS',
      filterKey: ActivityFilterKeys.status__in,
      type: EtoolsFilterTypes.DropdownMulti,
      selectionOptions: [],
      selectedValue: [],
      optionValue: 'value',
      optionLabel: 'display_name',
      selected: true,
      minWidth: '350px',
      hideSearch: true,
      disabled: false
    },
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.SECTIONS'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.SECTIONS',
      filterKey: ActivityFilterKeys.sections__in,
      type: EtoolsFilterTypes.DropdownMulti,
      selectionOptions: [],
      selectedValue: [],
      optionValue: 'id',
      optionLabel: 'name',
      selected: true,
      minWidth: '350px',
      hideSearch: true,
      disabled: false,
      selectionOptionsEndpoint: SECTIONS
    },
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.START_DATE'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.START_DATE',
      filterKey: ActivityFilterKeys.start_date__gte,
      type: EtoolsFilterTypes.Date,
      selectedValue: false,
      selected: false
    },
    {
      filterName: getTranslation('ACTIVITIES_LIST.FILTERS.END_DATE'),
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.END_DATE',
      filterKey: ActivityFilterKeys.end_date__lte,
      type: EtoolsFilterTypes.Date,
      selectedValue: false,
      selected: false
    }
  ];
}

const filtersOnlyForUnicefUser: string[] = [
  ActivityFilterKeys.monitor_type,
  ActivityFilterKeys.tpm_partner__in,
  ActivityFilterKeys.partners__in,
  ActivityFilterKeys.interventions__in,
  ActivityFilterKeys.cp_outputs__in,
  ActivityFilterKeys.sections__in
];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getActivitiesFilters = (isUnicefUser: boolean) => {
  if (isUnicefUser) {
    return getAllAtivitiesFilters();
  }
  return getAllAtivitiesFilters().filter((x) => !filtersOnlyForUnicefUser.includes(x.filterKey));
};
