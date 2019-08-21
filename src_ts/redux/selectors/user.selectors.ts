import { select } from './create-selectors';

export const userDataSelector: Selector<GenericObject> = select<GenericObject>((store: IRootState) => {
    return {
        error: store.user.error,
        data: store.user.data
    };
});

export const userSelector: Selector<IUserState> = select<IUserState>((store: IRootState) => store.user);
export const currentUser: Selector<IEtoolsUserModel | null> = select<IEtoolsUserModel | null>((store: IRootState) => store.user.data);
