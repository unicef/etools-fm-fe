import { EtoolsFilterTypes, IEtoolsFilter } from '../../../common/layout/filters/etools-filters';
import { translate } from '../../../../localization/localisation';

export const TEXT_TYPE: 'text' = 'text';
export const NUMBER_TYPE: 'number' = 'number';
export const BOOLEAN_TYPE: 'bool' = 'bool';
export const SCALE_TYPE: 'likert_scale' = 'likert_scale';

export const PARTNER: 'partner' = 'partner';
export const OUTPUT: 'output' = 'output';
export const INTERVENTION: 'intervention' = 'intervention';

export const ANSWER_TYPES: AnswerTypeOption[] = [
    { value: TEXT_TYPE, display_name: translate(`ANSWER_TYPE_OPTIONS.TEXT`) },
    { value: NUMBER_TYPE, display_name: translate(`ANSWER_TYPE_OPTIONS.NUMBER`) },
    { value: BOOLEAN_TYPE, display_name: translate(`ANSWER_TYPE_OPTIONS.BOOL`) },
    { value: SCALE_TYPE, display_name: translate(`ANSWER_TYPE_OPTIONS.LIKERT_SCALE`) }
];

export const LEVELS: DefaultDropdownOption<string>[] = [
    { value: PARTNER, display_name: translate(`LEVELS_OPTIONS.PARTNER`) },
    { value: OUTPUT, display_name: translate(`LEVELS_OPTIONS.OUTPUT`) },
    { value: INTERVENTION, display_name: translate(`LEVELS_OPTIONS.INTERVENTION`) }
];

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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
        filterName: translate('QUESTIONS.LABELS.IS_HACT'),
        filterKey: 'is_hact',
        type: EtoolsFilterTypes.Toggle,
        selectedValue: false,
        defaultValue: false,
        selected: false
    }, {
        filterName: translate('QUESTIONS.LABELS.IS_ACTIVE'),
        filterKey: 'is_active',
        type: EtoolsFilterTypes.Toggle,
        selectedValue: false,
        defaultValue: false,
        selected: false
    }
];
