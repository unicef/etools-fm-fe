import './etools-user';
import { EtoolsUser } from './etools-user';

const userEl: EtoolsUser = document.createElement('etools-user') as EtoolsUser;

export const getCurrentUserData: () => void = () => {
    // TODO: find a better way of getting user data or continue with this
    userEl.getUserData(); // should req data and polpuate redux state...
};

export const updateCurrentUserData: (profile: any) => any = (profile: any) => {
    return userEl.updateUserData(profile);
};

export const changeCurrentUserCountry: (countryId: number) => any = (countryId: number) => {
    return userEl.changeCountry(countryId);
    // .then(() => {
    //   // refresh user data (no other way, country change req returns 204)
    //   getCurrentUserData();
    // });
};
