type Site = {
    id: number;
    is_active: boolean;
    name: string;
    p_code: string;
    parent: ISiteParrentLocation;
    point: GeojsonPoint;
    security_detail: string;
};

interface ISiteParrentLocation {
    gateway: LocationGateway;
    geo_point: string;
    id: string;
    name: string;
    p_code: string;
    parent: null | ISiteParrentLocation;
}

interface IGroupedSites extends ISiteParrentLocation {
    sites: Site[];
}

type LocationGateway = {
    admin_level: null | string | number
    id: number;
    name: string;
};

type GeojsonPoint = {
    coordinates: CoordinatesArray
    type: 'Point';
};

type CoordinatesArray = [number, number];

type SiteStatusOption = {
    id?: number;
    value: boolean;
    display_name: string;
};

type Workspace = {
    id: string;
    gateway: LocationGateway;
    geom: null;
    point: GeojsonPoint;
    p_code: string;
    name: string;
};