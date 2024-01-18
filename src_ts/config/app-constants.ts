import {GenericObject} from '@unicef-polymer/etools-types/dist/global.types';

export const appLanguages: GenericObject<string>[] = [
  {value: 'en', display_name: 'English'},
  {value: 'fr', display_name: 'French'}
];

export const filterPDStatuses: IOption[] = [
  {id: 'active', name: 'Active'},
  {id: 'ended', name: 'Ended'},
  {id: 'closed', name: 'Closed'},
  {id: 'suspended', name: 'Suspended'},
  {id: 'terminated', name: 'Terminated'}
];
