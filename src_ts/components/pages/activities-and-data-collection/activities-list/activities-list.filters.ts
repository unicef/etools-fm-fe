import {EtoolsFilterTypes, IEtoolsFilter} from '../../../common/layout/filters/etools-filters';
import {addTranslates, ENGLISH, translate} from '../../../../localization/localisation';
import {ACTIVITIES_LIST_TRANSLATES} from '../../../../localization/en/activities-and-data-collection/activities-list.translates';
import {
  CP_OUTPUTS,
  INTERVENTIONS,
  LOCATIONS_ENDPOINT,
  PARTNERS,
  TPM_PARTNERS,
  USERS
} from '../../../../endpoints/endpoints-list';

addTranslates(ENGLISH, [ACTIVITIES_LIST_TRANSLATES]);

export const activitiesListFilters: IEtoolsFilter[] = [
  {
    filterName: translate('ACTIVITIES_LIST.FILTERS.ACTIVITY_TYPE'),
    filterKey: 'activity_type',
    type: EtoolsFilterTypes.Dropdown,
    selectionOptions: [],
    selectedValue: null,
    optionValue: 'value',
    optionLabel: 'display_name',
    selected: false,
    minWidth: '350px',
    hideSearch: true,
    disabled: false,
    defaultValue: null
  },
  {
    filterName: translate('ACTIVITIES_LIST.FILTERS.TPM_PARTNERS'),
    filterKey: 'tpm_partner__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'name',
    selected: false,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    defaultValue: [],
    selectionOptionsEndpoint: TPM_PARTNERS
  },
  {
    filterName: translate('ACTIVITIES_LIST.FILTERS.TEAM_MEMBERS'),
    filterKey: 'team_members__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'name',
    selected: false,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    defaultValue: [],
    selectionOptionsEndpoint: USERS
  },
  {
    filterName: translate('ACTIVITIES_LIST.FILTERS.PERSON_RESPONSIBLE'),
    filterKey: 'person_responsible__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'name',
    selected: false,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    defaultValue: [],
    selectionOptionsEndpoint: USERS
  },
  {
    filterName: translate('ACTIVITIES_LIST.FILTERS.LOCATION'),
    filterKey: 'location__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'name',
    selected: false,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    defaultValue: [],
    selectionOptionsEndpoint: LOCATIONS_ENDPOINT
  },
  {
    filterName: translate('ACTIVITIES_LIST.FILTERS.SITE'),
    filterKey: 'location_site__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'name',
    selected: false,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    defaultValue: []
  },
  {
    filterName: translate('ACTIVITIES_LIST.FILTERS.PARTNERS'),
    filterKey: 'partners__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'name',
    selected: false,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    defaultValue: [],
    selectionOptionsEndpoint: PARTNERS
  },
  {
    filterName: translate('ACTIVITIES_LIST.FILTERS.INTERVENTIONS'),
    filterKey: 'interventions__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'title',
    selected: false,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    defaultValue: [],
    selectionOptionsEndpoint: INTERVENTIONS
  },
  {
    filterName: translate('ACTIVITIES_LIST.FILTERS.CP_OUTPUTS'),
    filterKey: 'cp_outputs__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'name',
    selected: false,
    minWidth: '350px',
    hideSearch: false,
    disabled: false,
    defaultValue: [],
    selectionOptionsEndpoint: CP_OUTPUTS
  },
  {
    filterName: translate('ACTIVITIES_LIST.FILTERS.STATUS'),
    filterKey: 'status__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'value',
    optionLabel: 'display_name',
    selected: false,
    minWidth: '350px',
    hideSearch: true,
    disabled: false,
    defaultValue: []
  },
  {
    filterName: translate('ACTIVITIES_LIST.FILTERS.START_DATE'),
    filterKey: 'start_date__gte',
    type: EtoolsFilterTypes.Date,
    selectedValue: false,
    defaultValue: false,
    selected: false
  },
  {
    filterName: translate('ACTIVITIES_LIST.FILTERS.END_DATE'),
    filterKey: 'end_date__lte',
    type: EtoolsFilterTypes.Date,
    selectedValue: false,
    defaultValue: false,
    selected: false
  }
];
