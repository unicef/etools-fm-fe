interface IRouteQueryParam {
  [key: string]: string;
}

interface IRouteParams {
  [key: string]: number | string;
}

interface IRouteQueryParams {
  [key: string]: any;
}

interface IRouteCallbackParams {
  matchDetails: string[];
  queryParams: IRouteQueryParams;
  queryParamsString: string | null;
}

interface IRouteDetails {
  routeName: string;
  subRouteName: string | null;
  path: string;
  queryParams: IRouteQueryParam | null;
  queryParamsString: string | null;
  params: IRouteParams | null;
}

interface IRoute {
  regex: RegExp | string;
  handler: (params: IRouteCallbackParams) => IRouteDetails;
}

interface IRoutesLazyLoadComponentsPath {
  [key: string]: string[];
}
