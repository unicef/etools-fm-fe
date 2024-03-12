import {EtoolsFilterTypes} from '@unicef-polymer/etools-unicef/src/etools-filters/etools-filters';
import {setselectedValueTypeByFilterKey} from '@unicef-polymer/etools-unicef/src/etools-filters/filters';
import {translate} from 'lit-translate';

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

export function questionsFilters() {
  return [
    {
      filterName: translate('QUESTIONS.LABELS.LEVEL') as any as string,
      filterNameKey: 'QUESTIONS.LABELS.LEVEL',
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
      filterName: translate('QUESTIONS.LABELS.SECTIONS') as any as string,
      filterNameKey: 'QUESTIONS.LABELS.SECTIONS',
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
      filterName: translate('QUESTIONS.LABELS.METHODS') as any as string,
      filterNameKey: 'QUESTIONS.LABELS.METHODS',
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
      filterName: translate('QUESTIONS.LABELS.GROUP') as any as string,
      filterNameKey: 'QUESTIONS.LABELS.GROUP',
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
      filterName: translate('QUESTIONS.LABELS.ANSWER_TYPE') as any as string,
      filterNameKey: 'QUESTIONS.LABELS.ANSWER_TYPE',
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
      filterName: translate('QUESTIONS.LABELS.IS_HACT') as any as string,
      filterNameKey: 'QUESTIONS.LABELS.IS_HACT',
      filterKey: 'is_hact',
      type: EtoolsFilterTypes.Toggle,
      selectedValue: false,
      selected: false
    },
    {
      filterName: translate('QUESTIONS.LABELS.IS_ACTIVE') as any as string,
      filterNameKey: 'QUESTIONS.LABELS.IS_ACTIVE',
      filterKey: 'is_active',
      type: EtoolsFilterTypes.Toggle,
      selectedValue: false,
      selected: false
    }
  ];
}
