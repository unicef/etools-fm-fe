import {dynamicSelect, select} from './create-selectors';

export const locationsDataSelector: Selector<EtoolsLightLocation[] | undefined> = select<
  EtoolsLightLocation[] | undefined
>((store: IRootState) => store.staticData.locations);

export const outputsDataSelector: Selector<EtoolsCpOutput[] | undefined> = select<EtoolsCpOutput[] | undefined>(
  (store: IRootState) => store.staticData.outputs
);

export const cpOutcomeDataSelector: Selector<EtoolsCpOutcome[] | undefined> = select<EtoolsCpOutcome[] | undefined>(
  (store: IRootState) => store.staticData.cpOutcomes
);

export const partnersDataSelector: Selector<EtoolsPartner[] | undefined> = select<EtoolsPartner[] | undefined>(
  (store: IRootState) => store.staticData.partners
);

export const sectionsDataSelector: Selector<EtoolsSection[] | undefined> = select<EtoolsSection[] | undefined>(
  (store: IRootState) => store.staticData.sections
);

export const currentWorkspaceSelector: Selector<Workspace | undefined> = select<Workspace | undefined>(
  (store: IRootState) => store.staticData.currentWorkspace
);

export const staticDataDynamic: DynamicSelector<any> = dynamicSelect<IStaticDataState, any>(
  (store: IRootState) => store.staticData
);
