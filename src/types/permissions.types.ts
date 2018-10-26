type PermissionsCollections = {
    [key: string]: IPermissionActions
};

interface IBackendPermissions {
    actions: IBackendPermissionActions;
    description: string;
    name: string;
    parses: string[];
    renders: string[];
}

interface IPermissionActions extends IBackendPermissionActions {
    allowed_actions: TransitionObject[];
    title: string;
}

interface IBackendPermissionActions {
    GET?: DescriptorsList;
    POST?: DescriptorsList;
    PUT?: DescriptorsList;
    allowed_FSM_transitions: TransitionObject[];
}

interface IFieldDescriptor {
    label: string;
    read_only: boolean;
    required: boolean;
    type: string;
}

interface INestedDescriptorsList extends IFieldDescriptor {
    children?: IFieldDescriptor;
    child?: IFieldDescriptor;
}

type DescriptorsList = {
    [key: string]: IFieldDescriptor | INestedDescriptorsList;
};

type TransitionObject = {
    code: string;
    display_name: string;
};

type ActionTypes = 'GET' | 'PUT' | 'POST';