export const SET_CP_OUTPUTS = 'SET_CP_OUTPUTS';
export const START_REQUEST_CP_OUTPUT = 'START_REQUEST_CP_OUTPUT';
export const FINISH_REQUEST_CP_OUTPUT = 'FINISH_REQUEST_CP_OUTPUT';
export const SET_ERROR_CP_OUTPUT = 'SET_ERROR_CP_OUTPUT';

export class SetCpOutputs {
    public readonly type = SET_CP_OUTPUTS;
    public constructor(public payload: IListData<CpOutput>) { }
}

export class StartRequestCpOutput {
    public readonly type = START_REQUEST_CP_OUTPUT;
}

export class FinishRequestCpOutput {
    public readonly type = FINISH_REQUEST_CP_OUTPUT;
}

export class SetRequestErrorCpOutput {
    public readonly type = SET_ERROR_CP_OUTPUT;
    public constructor(public payload: {errors: any}) {}
}

export type CpOutputsActions = SetCpOutputs | StartRequestCpOutput | FinishRequestCpOutput | SetRequestErrorCpOutput;
