// import {store} from '../../store';
// import {IEtoolsUserModel} from './user-model';
import './etools-user';
import {EtoolsUser} from "./etools-user";

export const getCurrentUserData = () => {
  const userEl = document.createElement('etools-user') as EtoolsUser;
  userEl.getUserData();
};
