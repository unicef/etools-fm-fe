import {
    AttachmentsActions,
    FINISH_REQUEST_ATTACHMENTS,
    SET_ATTACHMENTS,
    START_REQUEST_ATTACHMENTS
} from '../actions/attachments.actions';

const INITIAL = {
    requestInProcess: null,
    data: {
        count: 0,
        results: [] as Attachment[]
    }
};

export function attachments(state = INITIAL, action: AttachmentsActions) {
    switch (action.type) {
        case SET_ATTACHMENTS: {
            const data = {...action.payload};
            return Object.assign({}, state, {data});
        }
        case START_REQUEST_ATTACHMENTS:
            return Object.assign({}, state, {requestInProcess: true});
        case FINISH_REQUEST_ATTACHMENTS:
            return Object.assign({}, state, {requestInProcess: false});
        default:
            return state;
    }
}
