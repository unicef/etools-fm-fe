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
  rationale_attachments: null | Attachment[];
  updateInProcess: null | boolean;
  error: GenericObject;
}

interface IQuestionTemplatesState {
  data: null | IListData<IQuestionTemplate>;
}

interface IActivitiesState {
  listData: null | IListData<IListActivity>;
}

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
    load: boolean;
    update: boolean;
    statusChange: boolean;
  };
}

interface IWidgetLocationsState {
  loading: null | boolean;
  data: WidgetStoreData;
  pathLoading: null | boolean;
  pathCollection: WidgetStoreData;
}

interface IDataCollectionState {
  checklistLoading: null | boolean;
  checklist: {
    data: null | DataCollectionChecklist;
    findings: null | DataCollectionFinding[];
    overallFindings: null;
  };
  checklistError: null | GenericObject;
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
