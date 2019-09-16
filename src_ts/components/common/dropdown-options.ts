import { translate } from '../../localization/localisation';

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
