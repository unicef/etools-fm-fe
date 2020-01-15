import {EtoolsFilterTypes, IEtoolsFilter} from '../../../common/layout/filters/etools-filters';
import {translate} from '../../../../localization/localisation';

export const questionsFilters: IEtoolsFilter[] = [
  {
    filterName: translate('QUESTIONS.LABELS.LEVEL'),
    filterKey: 'level__in',
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
    filterName: translate('QUESTIONS.LABELS.SECTIONS'),
    filterKey: 'sections__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'name',
    selected: false,
    minWidth: '350px',
    hideSearch: true,
    disabled: false,
    defaultValue: []
  },
  {
    filterName: translate('QUESTIONS.LABELS.METHODS'),
    filterKey: 'methods__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'name',
    selected: false,
    minWidth: '350px',
    hideSearch: true,
    disabled: false,
    defaultValue: []
  },
  {
    filterName: translate('QUESTIONS.LABELS.CATEGORY'),
    filterKey: 'category__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'name',
    selected: false,
    minWidth: '350px',
    hideSearch: true,
    disabled: false,
    defaultValue: []
  },
  {
    filterName: translate('QUESTIONS.LABELS.ANSWER_TYPE'),
    filterKey: 'answer_type__in',
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
    filterName: translate('QUESTIONS.LABELS.IS_HACT'),
    filterKey: 'is_hact',
    type: EtoolsFilterTypes.Toggle,
    selectedValue: false,
    defaultValue: false,
    selected: false
  },
  {
    filterName: translate('QUESTIONS.LABELS.IS_ACTIVE'),
    filterKey: 'is_active',
    type: EtoolsFilterTypes.Toggle,
    selectedValue: false,
    defaultValue: false,
    selected: false
  }
];
