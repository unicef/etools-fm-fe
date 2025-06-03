import {getEndpoint} from '@unicef-polymer/etools-utils/dist/endpoint.util';
import {GenericObject, EtoolsEndpoint} from '@unicef-polymer/etools-types';
import {_sendRequest} from '@unicef-polymer/etools-modules-common/dist/utils/request-helper';
import {CommentsEndpoints} from './comments-types';
import {CommentType} from './comments.reducer';
export const SET_ENDPOINT = 'SET_ENDPOINT';
export const SET_COMMENTS = 'SET_COMMENTS';
export const ADD_COMMENT = 'ADD_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const ENABLE_COMMENT_MODE = 'ENABLE_COMMENT_MODE';

export const enableCommentMode = (state: boolean) => {
  return {
    type: ENABLE_COMMENT_MODE,
    state
  };
};

export const setCommentsEndpoint = (endpoints: CommentsEndpoints) => {
  return {
    type: SET_ENDPOINT,
    endpoints: endpoints
  };
};

export const addComment = (relatedTo: string, comment: CommentType, collectionId: number) => {
  return {
    type: ADD_COMMENT,
    data: comment,
    relatedTo,
    collectionId
  };
};

export const updateComment = (relatedTo: string, comment: CommentType, collectionId: number) => {
  return {
    type: UPDATE_COMMENT,
    data: comment,
    relatedTo,
    collectionId
  };
};

export const setComments = (comments: GenericObject<CommentType[]>, collectionId: number) => {
  return {
    type: SET_COMMENTS,
    data: comments,
    collectionId
  };
};

export const getComments = (endpoint: EtoolsEndpoint, collectionId: number) => (dispatch: any) => {
  return _sendRequest({
    endpoint: getEndpoint(endpoint, {collectionId})
  }).then((comments: CommentType[]) => {
    dispatch(setComments(mapComments(comments), collectionId));
  });
};

function mapComments(comments: CommentType[]): GenericObject<CommentType[]> {
  return comments.reduce((commentsMap: GenericObject<CommentType[]>, comment: CommentType) => {
    if (!commentsMap[comment.related_to]) {
      commentsMap[comment.related_to] = [];
    }
    commentsMap[comment.related_to].push(comment);
    return commentsMap;
  }, {});
}
