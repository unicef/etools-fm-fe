interface IRootState {
  app: IAppState;
  user: IUserState;
  country: IRequestState;
  staticData: IStaticDataState;
  specificLocations: ISpecificLocationsState;
  questions: IQuestionsState;
  issueTracker: IIssueTrackerState;
  questionTemplates: IQuestionTemplatesState;
  rationale: IRationaleState;
  activities: IActivitiesState;
  activityDetails: IActivityDetailsState;
  activityChecklist: IActivityChecklistState;
  attachmentsList: IAttachmentsListState;
  widgetLocations: IWidgetLocationsState;
  dataCollection: IDataCollectionState;
  monitoringActivities: IMonitoringActivityState;
  fullReports: IFullReportsState;
  activitySummary: IActivitySummaryState;
  findingsComponents: IFindingsComponentsState;
}

type StoreSelectorFunction<T> = (store: IRootState) => T;

interface IAppState {
  routeDetails: IRouteDetails;
  drawerOpened: boolean;
}

interface IRequestState {
  isRequest: {[key: string]: boolean};
  error: GenericObject | null;
}

interface IUserState extends IRequestState {
  data: IEtoolsUserModel | null;
}

interface IStaticDataState {
  locations?: EtoolsLightLocation[];
  currentWorkspace?: any;
  categories?: EtoolsCategory[];
  sections?: EtoolsSection[];
  methods?: EtoolsMethod[];
  partners?: EtoolsPartner[];
  tpmPartners?: EtoolsTPMPartner[];
  interventions?: EtoolsIntervention[];
  outputs?: EtoolsCpOutput[];
  users?: User[];
  teamMembers?: User[];
  planningOutputs?: EtoolsCpOutput[];
  cpOutcomes?: EtoolsCpOutcome[];
}

interface ISpecificLocationsState {
  updateInProcess: null | boolean;
  errors: null | GenericObject;
  data: null | IStatedListData<Site>;
}

interface IQuestionsState {
  updateInProcess: null | boolean;
  error: null | GenericObject;
  data: null | IListData<IQuestion>;
}

interface IRationaleState {
  updateInProcess: null | boolean;
  error: null | GenericObject;
  data: null | IRationale;
}

interface IAttachmentsListState {
  rationale_attachments: null | IAttachment[];
  updateInProcess: null | boolean;
  error: GenericObject;
}

interface IQuestionTemplatesState {
  data: null | IListData<IQuestionTemplate>;
}

interface IActivitiesState {
  listData: null | IListData<IListActivity>;
}

type IFullReportsState = {
  isRequest: {
    load: boolean;
  };
  data: GenericObject<FullReportData>;
  error: null | GenericObject;
};

interface IActivityChecklistState {
  data: null | IChecklistItem[];
  editedCard: null | string;
}

interface IIssueTrackerState extends IRequestState {
  data: null | IListData<LogIssue>;
}

interface IActivityDetailsState extends IRequestState {
  data: null | IActivityDetails;
  editedCard: null | string;
  error: null | GenericObject;
  isRequest: {
    create: boolean;
    load: boolean;
    update: boolean;
    statusChange: boolean;
  };
  checklistAttachments: IChecklistAttachment[];
}

interface IWidgetLocationsState {
  loading: null | boolean;
  data: WidgetStoreData;
  pathLoading: null | boolean;
  pathCollection: WidgetStoreData;
}

interface IDataCollectionState {
  loading: {
    checklistCollect: null | boolean;
    checklistCreate: null | boolean;
    checklist: null | boolean;
    findings: null | boolean;
    overallAndFindingsUpdate: null | boolean;
  };
  checklistCollect: DataCollectionChecklist[];
  checklist: {
    data: null | DataCollectionChecklist;
    findingsAndOverall: FindingsAndOverall;
  };
  errors: {
    checklistCollect: null | GenericObject;
    checklistCreate: null | GenericObject;
    checklist: null | GenericObject;
    findings: null | GenericObject;
    overallAndFindingsUpdate: null | GenericObject;
  };
}

interface IAdditionalInfoState {
  isRequest: {
    issueTrackingLoad: null | boolean;
  };
  issueTracking: LogIssue[];
  errors: {
    issueTracking: null | GenericObject;
  };
}

type FindingsAndOverall<T = DataCollectionFinding, U = DataCollectionOverall> = {
  findings: null | T[];
  overall: null | U[];
};

interface IActivitySummaryState {
  findingsAndOverall: FindingsAndOverall<SummaryFinding, SummaryOverall>;
  error: null | GenericObject;
  editedFindingsTab: null | string;
  updateInProcess: null | boolean;
  loading: null | boolean;
}

interface IFindingsComponentsState {
  editedFindingsComponent: null | string;
  overallAndFindingsUpdate: null | boolean;
}

interface IMonitoringActivityState {
  overallActivities: OverallActivities;
  partnersCoverage: PartnersCoverage[];
  interventionsCoverage: InterventionsCoverage[];
  cpOutputCoverage: CpOutputCoverage[];
  geographicCoverage: GeographicCoverage[];
  openIssuesPartnership: OpenIssuesActionPoints[];
  openIssuesCpOutput: OpenIssuesActionPoints[];
  openIssuesLocation: OpenIssuesActionPoints[];
  lastActivatedTab: string;
  hactVisits: HactVisits[];
}

type Selector<T> = (onChange: (state: T) => void, initialize?: boolean) => Callback;
type DynamicSelector<T> = (onChange: (state: T) => void, path?: string[], initialize?: boolean) => Callback;

type AsyncEffect = any;

type MiddlewareLoadingAction<T> = {
  type: T;
};
type MiddlewareRequestAction<T, S = any> = {
  type: T;
  payload: S;
};
