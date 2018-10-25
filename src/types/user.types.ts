interface IUserProfile {
    date_joined: string;
    email: string;
    first_name: string;
    full_name: string;
    groups: UserGroup[];
    id: number;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    last_login: string;
    last_name: string;
    middle_name: string;
    profile: IProfile;
    t2f: T2f;
    username: string;
}

type UserGroup = {
    id: number,
    name: string
};

type UserCountry = {
    id: number,
    name: string,
    business_area_code: string
};

type T2f = {
    business_area: null | string
    roles: string[]
    travel_count: number
};

interface IProfile {
    countries_available: UserCountry[];
    country: number;
    country_name: string;
    country_override: number;
    guid: null | string;
    job_title: string;
    office: string;
    oic: null | number;
    org_unit_code: string;
    org_unit_name: string;
    partner_staff_member: null | number;
    phone_number: string;
    post_number: string;
    post_title: string;
    staff_id: null | number;
    supervisor: null | number;
    vendor_number: null | string;
}