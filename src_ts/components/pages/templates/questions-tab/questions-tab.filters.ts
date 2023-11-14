import {EtoolsFilterTypes, EtoolsFilter} from '@unicef-polymer/etools-unicef/src/etools-filters/etools-filters';
import {setselectedValueTypeByFilterKey} from '@unicef-polymer/etools-unicef/src/etools-filters/filters';
import {get} from 'lit-translate';

export enum QuestionFilterKeys {
  level__in = 'level__in',
  sections__in = 'sections__in',
  methods__in = 'methods__in',
  category__in = 'category__in',
  answer_type__in = 'answer_type__in',
  is_hact = 'is_hact',
  is_active = 'is_active'
}

export const selectedValueTypeByFilterKey: GenericObject = {
  [QuestionFilterKeys.level__in]: 'Array',
  [QuestionFilterKeys.sections__in]: 'Array',
  [QuestionFilterKeys.methods__in]: 'Array',
  [QuestionFilterKeys.category__in]: 'Array',
  [QuestionFilterKeys.answer_type__in]: 'Array',
  [QuestionFilterKeys.is_hact]: 'boolean',
  [QuestionFilterKeys.is_active]: 'boolean'
};

setselectedValueTypeByFilterKey(selectedValueTypeByFilterKey);

export const questionsFilters: EtoolsFilter[] = [
  {
    filterName: get('QUESTIONS.LABELS.LEVEL'),
    filterKey: 'level__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'value',
    optionLabel: 'display_name',
    selected: false,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: get('QUESTIONS.LABELS.SECTIONS'),
    filterKey: 'sections__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'name',
    selected: false,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: get('QUESTIONS.LABELS.METHODS'),
    filterKey: 'methods__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'name',
    selected: false,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: get('QUESTIONS.LABELS.GROUP'),
    filterKey: 'category__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'id',
    optionLabel: 'name',
    selected: false,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: get('QUESTIONS.LABELS.ANSWER_TYPE'),
    filterKey: 'answer_type__in',
    type: EtoolsFilterTypes.DropdownMulti,
    selectionOptions: [],
    selectedValue: [],
    optionValue: 'value',
    optionLabel: 'display_name',
    selected: false,
    minWidth: '350px',
    hideSearch: true,
    disabled: false
  },
  {
    filterName: get('QUESTIONS.LABELS.IS_HACT'),
    filterKey: 'is_hact',
    type: EtoolsFilterTypes.Toggle,
    selectedValue: false,
    selected: false
  },
  {
    filterName: get('QUESTIONS.LABELS.IS_ACTIVE'),
    filterKey: 'is_active',
    type: EtoolsFilterTypes.Toggle,
    selectedValue: false,
    selected: false
  }
];
