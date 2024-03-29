/* eslint-disable */
// TODO: improve this user model
interface IEtoolsUserModel {
  [key: string]: any;
  countries_available: GenericObject[];
  preferences: {language: string};
  groups: UserGroup[];
  country: GenericObject;
  country_override: number;
  email: string;
  first_name: string;
  guid: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  job_title: string;
  last_login: string;
  last_name: string;
  middle_name: string;
  name: string;
  office: string | null;
  oic: any;
  user: number;
  username: string;
  vendor_number: string | null;
}

type UserGroup = {
  id: string;
  name: string;
  permissions: number[];
};
