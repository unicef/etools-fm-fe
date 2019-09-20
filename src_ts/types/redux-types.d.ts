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
    attachmentsList: IAttachmentsListState;
}

type StoreSelectorFunction<T> = (store: IRootState) => T;

interface IAppState {
    routeDetails: IRouteDetails;
    drawerOpened: boolean;
}

interface IRequestState {
    isRequest: { [key: string]: boolean };
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

interface IIssueTrackerState extends IRequestState {
    data: null | IListData<LogIssue>;
}

type Selector<T> = (onChange: (state: T) => void, initialize?: boolean) => Callback;
type DynamicSelector<T> = (onChange: (state: T) => void, path?: string[], initialize?: boolean) => Callback;

type AsyncEffect = any;
