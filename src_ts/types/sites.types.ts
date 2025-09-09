/* eslint-disable */
type Site = {
  id: number;
  is_active: boolean;
  name: string;
  p_code: string;
  parent: ISiteParrentLocation;
  point: GeojsonPoint;
  security_detail: string;
};

type VisitGoal = {
  id: number;
  name: string;
  info: string[];
};

type EditedSite = Partial<Site>;

interface ISiteParrentLocation {
  admin_level_name: string;
  admin_level: string;
  geo_point: string;
  id: string;
  name: string;
  p_code: string;
  parent: null | ISiteParrentLocation;
}

interface IGroupedSites extends ISiteParrentLocation {
  sites: Site[];
}

type GeojsonPoint = {
  coordinates: CoordinatesArray;
  type: 'Point';
};

type LocationGeometry = {
  coordinates: [CoordinatesArray[]];
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
  admin_level_name: string;
  admin_level: string;
  geom: null;
  point: GeojsonPoint;
  p_code: string;
  name: string;
};

type WidgetLocation = {
  admin_level_name: string;
  admin_level: number;
  geom: LocationGeometry;
  id: string;
  is_leaf: boolean;
  name: string;
  p_code: string;
  point: GeojsonPoint;
  is_active?: boolean;
};

type WidgetStoreData = {
  [query: string]: WidgetLocation[];
};

type SitesPopupData = {
  sitesObjects: Site[];
  model?: Site;
};
