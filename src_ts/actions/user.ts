import {Action, ActionCreator} from 'redux';
import {IEtoolsUserModel} from '../components/user/user-model';
import {ThunkAction} from 'redux-thunk';
import {RootState} from "../store";

export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';

export interface IUpdateUserActionData extends Action {
  data: IEtoolsUserModel;
}

export type UserDataAction = IUpdateUserActionData;
// @ts-ignore - for now
type ThunkResult = ThunkAction<void, RootState, undefined, UserDataAction>;

export const updateUserData: ActionCreator<IUpdateUserActionData> = (data: IEtoolsUserModel) => {
  return {
    type: UPDATE_USER_DATA,
    data: data
  };
};
