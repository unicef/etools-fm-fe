import Dexie from 'dexie';

const etoolsCustomDexieDb: Dexie = new Dexie('FM');
etoolsCustomDexieDb.version(1).stores({
  cpOutcomes: 'id',
  locations: 'id'
});
export {etoolsCustomDexieDb};
