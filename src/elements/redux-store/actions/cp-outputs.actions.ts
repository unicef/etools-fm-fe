export const SET_CP_OUTPUTS = 'SET_CP_OUTPUTS';

export class SetCpOutputs {
    public readonly type = SET_CP_OUTPUTS;
    public constructor(
        public payload: ListData) { }
}

export type CpOutputsActions = SetCpOutputs;
