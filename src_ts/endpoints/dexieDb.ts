import Dexie from 'dexie';

import {
  CATEGORIES,
  CP_OUTCOMES,
  CP_OUTPUTS,
  INTERVENTIONS,
  INTERVENTIONS_SHORT,
  LOCATIONS_ENDPOINT,
  METHODS,
  PARTNERS,
  SECTIONS,
  TPM_PARTNERS,
  USERS
} from './endpoints-list';

const etoolsCustomDexieDb: Dexie = new Dexie('FM');

etoolsCustomDexieDb.version(1).stores({
  listsExpireMapTable: '&name, expire',
  [USERS]: 'id',
  [CP_OUTCOMES]: 'id',
  [LOCATIONS_ENDPOINT]: 'id',
  [PARTNERS]: 'id',
  [TPM_PARTNERS]: 'id',
  [CP_OUTPUTS]: 'id',
  [INTERVENTIONS]: 'id',
  [INTERVENTIONS_SHORT]: 'id',
  [CATEGORIES]: 'id',
  [SECTIONS]: 'id',
  [METHODS]: 'id'
});

export {etoolsCustomDexieDb};
