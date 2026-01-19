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
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {FiltersHelper} from '@unicef-polymer/etools-unicef/src/etools-filters/filters-helper.class';
import {ACTIVE_STATUS_FILTER} from '../activity-item/statuses-actions/activity-statuses';

export interface ActivityFilter extends EtoolsFilter {
  selectionOptionsEndpoint?: string;
}

export enum ActivityFilterKeys {
  search = 'search',
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

export function getAllAtivitiesFilters(loadSiteDropdownOptions: any) {
  return [
    {
      filterName: translate('ACTIVITIES_LIST.REFERENCE_NO') as any as string,
      filterNameKey: 'ACTIVITIES_LIST.REFERENCE_NO',
      filterKey: ActivityFilterKeys.search,
      type: EtoolsFilterTypes.Search,
      selectedValue: '',
      selected: true
    },
    {
      filterName: translate('ACTIVITIES_LIST.FILTERS.MONITOR_TYPE') as any as string,
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
      filterName: translate('ACTIVITIES_LIST.FILTERS.TPM_PARTNERS') as any as string,
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
      filterName: translate('ACTIVITIES_LIST.FILTERS.TEAM_MEMBERS') as any as string,
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
      filterName: translate('ACTIVITIES_LIST.FILTERS.VISIT_LEAD') as any as string,
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
      filterName: translate('ACTIVITIES_LIST.FILTERS.LOCATION') as any as string,
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
      filterName: translate('ACTIVITIES_LIST.FILTERS.SITE') as any as string,
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
      disabled: false,
      loadDataDropdownOptions: loadSiteDropdownOptions
    },
    {
      filterName: translate('ACTIVITIES_LIST.FILTERS.PARTNERS') as any as string,
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
      filterName: translate('ACTIVITIES_LIST.FILTERS.OFFICE') as any as string,
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
      filterName: translate('ACTIVITIES_LIST.FILTERS.INTERVENTIONS') as any as string,
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
      filterName: translate('ACTIVITIES_LIST.FILTERS.CP_OUTPUTS') as any as string,
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
      filterName: translate('ACTIVITIES_LIST.FILTERS.STATUS') as any as string,
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.STATUS',
      filterKey: ActivityFilterKeys.status__in,
      type: EtoolsFilterTypes.DropdownMulti,
      selectionOptions: [],
      selectedValue: ACTIVE_STATUS_FILTER,
      optionValue: 'value',
      optionLabel: 'display_name',
      selected: true,
      minWidth: '350px',
      hideSearch: true,
      disabled: false
    },
    {
      filterName: translate('ACTIVITIES_LIST.FILTERS.SECTIONS') as any as string,
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
      filterName: translate('ACTIVITIES_LIST.FILTERS.STARTS_AFTER') as any as string,
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.STARTS_AFTER',
      filterKey: ActivityFilterKeys.start_date__gte,
      type: EtoolsFilterTypes.Date,
      selectedValue: false,
      selected: false
    },
    {
      filterName: translate('ACTIVITIES_LIST.FILTERS.END_BEFORE') as any as string,
      filterNameKey: 'ACTIVITIES_LIST.FILTERS.END_BEFORE',
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

export const getActivitiesFilters = (isUnicefUser: boolean, loadSiteDropdownOptions: any) => {
  if (isUnicefUser) {
    return getAllAtivitiesFilters(loadSiteDropdownOptions);
  }
  return getAllAtivitiesFilters(loadSiteDropdownOptions).filter((x) => !filtersOnlyForUnicefUser.includes(x.filterKey));
};
