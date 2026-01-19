import Dexie from 'dexie';

import {
  CATEGORIES,
  CP_OUTCOMES,
  CP_OUTPUTS,
  INTERVENTIONS,
  METHODS,
  PARTNERS,
  SECTIONS,
  TPM_PARTNERS,
  VISIT_GOALS,
  USERS,
  FACILITY_TYPES
} from './endpoints-list';

const etoolsCustomDexieDb: Dexie = new Dexie('FM');

etoolsCustomDexieDb.version(1).stores({
  listsExpireMapTable: '&name, expire',
  [USERS]: 'id',
  [CP_OUTCOMES]: 'id',
  [PARTNERS]: 'id',
  [TPM_PARTNERS]: 'id',
  [CP_OUTPUTS]: 'id',
  [INTERVENTIONS]: 'id',
  [CATEGORIES]: 'id',
  [VISIT_GOALS]: 'id',
  [FACILITY_TYPES]: 'id',
  [SECTIONS]: 'id',
  [METHODS]: 'id'
});

export {etoolsCustomDexieDb};
