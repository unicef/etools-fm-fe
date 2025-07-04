interface IRootState {
  app: IAppState;
  user: IUserState;
  country: IRequestState;
  organization: IRequestState;
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
  actionPointsList: IActionPointsListState;
  tpmActionPointsList: ITPMActionPointsListState;
  widgetLocations: IWidgetLocationsState;
  dataCollection: IDataCollectionState;
  monitoringActivities: IMonitoringActivityState;
  fullReports: IFullReportsState;
  activitySummary: IActivitySummaryState;
  findingsComponents: IFindingsComponentsState;
  activeLanguage: IActiveLanguageState;
  globalLoading: IGlobalLoadingState;
  tpmPartners: ITPMPartnersState;
  tpmPartnerDetails: ITPMPartnerDetailsState;
  commentsData: {
    commentsModeEnabled: boolean;
    collection: GenericObject<CommentsCollection>;
    endpoints: CommentsEndpoints;
  };
}

type StoreSelectorFunction<T> = (store: IRootState) => T;

interface IAppState {
  routeDetails: EtoolsRouteDetails;
  previousRoute: string | null;
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
  interventionsActive?: EtoolsIntervention[];
  outputs?: EtoolsCpOutput[];
  outputsActive?: EtoolsCpOutput[];
  users?: User[];
  teamMembers?: User[];
  planningOutputs?: EtoolsCpOutput[];
  cpOutcomes?: EtoolsCpOutcome[];
  offices?: ActionPointsOffice[];
  actionPointsCategories?: ActionPointsCategory[];
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
  dataAll: null | IQuestion[];
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
  attachmentsTypes: AttachmentsTypesState;
  permissions: GenericObject;
}

type AttachmentsTypesState = {
  rationale_attachments: AttachmentType[];
  activityRelatedDocuments: AttachmentType[];
  activityReportAttachments: AttachmentType[];
};

interface IActionPointsListState {
  data: ActionPoint[];
  updateInProcess: null | boolean;
  error: GenericObject;
}

interface ITPMActionPointsListState {
  data: TPMActionPoint[];
  updateInProcess: null | boolean;
  error: GenericObject;
}

interface IQuestionTemplatesState {
  data: null | IListData<IQuestionTemplate>;
}

interface IActivitiesState {
  listData: null | IListData<IListActivity>;
}

interface ITPMPartnersState {
  listData: null | IListData<IActivityTpmPartner>;
  permissions: null | GenericObject;
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
  checklistAttachmentsTypes: AttachmentType[];
}

interface ITPMPartnerDetailsState extends IRequestState {
  data: null | IActivityTpmPartnerExtended;
  permissions: null | GenericObject;
  editedCard: null | string;
  error: null | GenericObject;
  isRequest: {
    create: boolean;
    load: boolean;
    update: boolean;
    statusChange: boolean;
  };
  attachments: IChecklistAttachment[];
}

interface IWidgetLocationsState {
  loading: null | boolean;
  items: WidgetLocation[];
  query: string;
  search: string;
  hasNext: boolean;
  pathLoading: null | boolean;
  pathCollection: WidgetStoreData;
}

interface IDataCollectionState {
  loading: {
    checklistCollect: null | boolean;
    checklistCreate: null | boolean;
    checklist: null | boolean;
    findings: null | boolean;
    dataCollectionMethods: null | boolean;
    overallAndFindingsUpdate: null | boolean;
  };
  checklistCollect: DataCollectionChecklist[];
  dataCollectionMethods: null | IDataCollectionMethods;
  checklist: {
    blueprint: null | ChecklistFormJson;
    data: null | DataCollectionChecklist;
    findingsAndOverall: FindingsAndOverall;
    removalInProgress: boolean;
  };
  errors: {
    checklistCollect: null | GenericObject;
    checklistCreate: null | GenericObject;
    checklist: null | GenericObject;
    findings: null | GenericObject;
    dataCollectionMethods: null | GenericObject;
    overallAndFindingsUpdate: null | GenericObject;
    dataCollectionChecklistItemRemovalFailure: null | GenericObject;
  };
}

interface IDataCollectionMethods {
  forActivity: number;
  methods: EtoolsMethod[];
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

interface IGlobalLoadingState {
  message: string | null;
}

interface IActiveLanguageState {
  activeLanguage: string;
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
