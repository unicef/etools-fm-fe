import {dynamicSelect, select} from './create-selectors';

export const cpOutcomesDataSelector: Selector<EtoolsCpOutcome[] | undefined> = select<EtoolsCpOutcome[] | undefined>(
  (store: IRootState) => store.staticData.cpOutcomes
);

export const partnersDataSelector: Selector<EtoolsPartner[] | undefined> = select<EtoolsPartner[] | undefined>(
  (store: IRootState) => store.staticData.partners
);

export const sectionsDataSelector: Selector<EtoolsSection[] | undefined> = select<EtoolsSection[] | undefined>(
  (store: IRootState) => store.staticData.sections
);

export const officesDataSelector: Selector<ActionPointsOffice[] | undefined> = select<ActionPointsOffice[] | undefined>(
  (store: IRootState) => store.staticData.offices
);

export const currentWorkspaceSelector: Selector<Workspace | undefined> = select<Workspace | undefined>(
  (store: IRootState) => store.staticData.currentWorkspace
);

export const usersDataSelectors: Selector<User[] | undefined> = select<User[] | undefined>(
  (store: IRootState) => store.staticData.users
);

export const visitGoalsSelector: Selector<VisitGoal[] | undefined> = select<VisitGoal[] | undefined>(
  (store: IRootState) => store.staticData.visitGoals
);

export const facilityTypesSelector: Selector<FacilityType[] | undefined> = select<FacilityType[] | undefined>(
  (store: IRootState) => store.staticData.facilityTypes
);

export const staticDataDynamic: DynamicSelector<any> = dynamicSelect<IStaticDataState, any>(
  (store: IRootState) => store.staticData
);
