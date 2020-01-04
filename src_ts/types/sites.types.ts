type Site = {
  id: number;
  is_active: boolean;
  name: string;
  p_code: string;
  parent: ISiteParrentLocation;
  point: GeojsonPoint;
  security_detail: string;
};

type EditedSite = Partial<Site>;

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
  admin_level: null | string | number;
  id: number;
  name: string;
};

type GeojsonPoint = {
  coordinates: CoordinatesArray;
  type: 'Point';
};

type LocationGeometry = {
  coordinates: [[CoordinatesArray[]]];
  type: 'MultiPolygon';
};

type CoordinatesArray = [number, number];

type SiteStatusOption = {
  id?: number;
  value: boolean;
  display_name: string | Callback;
};

type Workspace = {
  id: string;
  gateway: LocationGateway;
  geom: null;
  point: GeojsonPoint;
  p_code: string;
  name: string;
};

type WidgetLocation = {
  gateway: LocationGateway;
  geom: LocationGeometry;
  id: string;
  is_leaf: boolean;
  name: string;
  p_code: string;
  point: GeojsonPoint;
};

type WidgetStoreData = {
  [query: string]: WidgetLocation[];
};

type SitesPopupData = {
  sitesObjects: Site[];
  model?: Site;
};
