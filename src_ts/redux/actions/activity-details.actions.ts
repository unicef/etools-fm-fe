export enum ActivityDetailsActions {
    SET_EDITED_DETAILS_CARD = '[Activity Details Action]: SET_EDITED_DETAILS_CARD',

    ACTIVITY_DETAILS_GET_REQUEST = '[Activity Details Action]: ACTIVITY_DETAILS_GET_REQUEST',
    ACTIVITY_DETAILS_GET_SUCCESS = '[Activity Details Action]: ACTIVITY_DETAILS_GET_SUCCESS',
    ACTIVITY_DETAILS_GET_FAILURE = '[Activity Details Action]: ACTIVITY_DETAILS_GET_FAILURE',

    ACTIVITY_DETAILS_UPDATE_REQUEST = '[Activity Details Action]: ACTIVITY_DETAILS_UPDATE_REQUEST',
    ACTIVITY_DETAILS_UPDATE_SUCCESS = '[Activity Details Action]: ACTIVITY_DETAILS_UPDATE_SUCCESS',
    ACTIVITY_DETAILS_UPDATE_FAILURE = '[Activity Details Action]: ACTIVITY_DETAILS_UPDATE_FAILURE'
}

export class SetEditedDetailsCard {
    public readonly type: ActivityDetailsActions.SET_EDITED_DETAILS_CARD =
        ActivityDetailsActions.SET_EDITED_DETAILS_CARD;
    public constructor(public payload: string | null) {}
}
