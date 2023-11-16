import {get as getTranslation} from 'lit-translate';

export const ISSUE_STATUSES: DefaultDropdownOption<string>[] = [
  {value: 'new', display_name: getTranslation('ISSUE_TRACKER.STATUSES.NEW')},
  {value: 'past', display_name: getTranslation('ISSUE_TRACKER.STATUSES.PAST')}
];
