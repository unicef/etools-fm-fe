interface IRouteQueryParam {
    [key: string]: string;
}
interface IRouteParams {
    [key: string]: number | string;
}

interface IRouteQueryParams {
    [key: string]: string;
}

interface IRouteCallbackParams {
    matchDetails: string[];
    queryParams: IRouteQueryParams;
}

interface IRouteDetails {
    routeName: string;
    subRouteName: string | null;
    path: string;
    queryParams: IRouteQueryParam | null;
    params: IRouteParams | null;
}

interface IRoute {
    regex: RegExp | string;
    handler: (params: IRouteCallbackParams) => IRouteDetails;
}

interface IRoutesLazyLoadComponentsPath {
    [key: string]: string[];
}
