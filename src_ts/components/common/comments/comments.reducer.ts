import {Reducer} from 'redux';
import {SET_ENDPOINT, ADD_COMMENT, ENABLE_COMMENT_MODE, SET_COMMENTS, UPDATE_COMMENT} from './comments.actions';
import {GenericObject} from '@unicef-polymer/etools-types';
import {CommentsEndpoints} from './comments-types';
export type CommentType = {
  id: number;
  related_to: string;
  related_to_description: string;
  state: string;
  text: string;
  user: {
    id: number;
    name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
  };
  users_related: [];
};
export type CommentsCollection = GenericObject<CommentType[]>;
export type CommentsState = {
  commentsModeEnabled: boolean;
  collection: GenericObject<CommentsCollection>;
  endpoints: CommentsEndpoints;
};
const INITIAL: CommentsState = {
  commentsModeEnabled: false,
  collection: {},
  endpoints: {} as CommentsEndpoints
};

export const commentsData: Reducer<CommentsState, any> = (state = INITIAL, action) => {
  switch (action.type) {
    case SET_ENDPOINT:
      return {
        ...state,
        endpoints: action.endpoints
      };
    case SET_COMMENTS:
      return {
        ...state,
        commentsModeEnabled: state.commentsModeEnabled,
        collection: setCommentsToCollection(state.collection, action.collectionId, action.data)
      };
    case ADD_COMMENT:
      return {
        ...state,
        commentsModeEnabled: state.commentsModeEnabled,
        collection: addCommentToCollection(state.collection, action.collectionId, action.relatedTo, action.data)
      };
    case UPDATE_COMMENT:
      return {
        ...state,
        commentsModeEnabled: state.commentsModeEnabled,
        collection: updateComment(state.collection, action.collectionId, action.relatedTo, action.data)
      };
    case ENABLE_COMMENT_MODE:
      return {
        ...state,
        commentsModeEnabled: action.state
      };
    default:
      return state;
  }
};

function setCommentsToCollection(
  collection: GenericObject<CommentsCollection>,
  id: number,
  comments: GenericObject<CommentType[]>
): GenericObject<CommentsCollection> {
  collection[id] = comments;
  return collection;
}

function addCommentToCollection(
  collection: GenericObject<CommentsCollection>,
  id: number,
  relatedTo: string,
  comment: CommentType
): GenericObject<CommentsCollection> {
  if (!collection[id]) {
    collection[id] = {};
  }
  const currentComments = collection[id][relatedTo] || [];
  collection[id][relatedTo] = [...currentComments, comment];
  return collection;
}

function updateComment(
  collection: GenericObject<CommentsCollection>,
  id: number,
  relatedTo: string,
  comment: CommentType
): GenericObject<CommentsCollection> {
  const currentComments = collection[id][relatedTo] || [];
  const index: number = currentComments.findIndex(({id}: CommentType) => id === comment.id);
  if (index === -1) {
    console.warn("Comment which you want to update doesn't exists");
    return collection;
  }
  const updatedComments: CommentType[] = [...currentComments];
  updatedComments.splice(index, 1, comment);
  collection[id][relatedTo] = updatedComments;
  return collection;
}
