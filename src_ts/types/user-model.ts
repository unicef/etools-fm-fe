// TODO: improve this user model
interface IEtoolsUserModel {
    countries_available: object[];
    groups: object[];
    country: object;
    country_override: number;
    email: string;
    first_name: string;
    guid: string;
    is_active: string;
    is_staff: string;
    is_superuser: string;
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

    [key: string]: any;
}
