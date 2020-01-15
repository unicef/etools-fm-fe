import {select} from './create-selectors';

export const userSelector: Selector<IUserState> = select<IUserState>((store: IRootState) => store.user);
export const currentUser: Selector<IEtoolsUserModel | null> = select<IEtoolsUserModel | null>(
  (store: IRootState) => store.user.data
);
