export type TRouteQueryParam = {[key: string]: string};
export type TRouteParams = {[key: string]: number | string};

export type TRouteQueryParams = {
  [key: string]: string
};

export type TRouteCallbackParams = {
  matchDetails: string[];
  queryParams: TRouteQueryParams;
};

export type TRouteMatchDetails = {
  routeName: string;
  subRouteName: string | null;
  path: string;
  queryParams: TRouteQueryParam | null;
  params: TRouteParams | null;
};
/**
 * Simple router that will help with:
 *  - registering app routes
 *  - check for app valid routes and get route details, like name, params or queryParams,
 */
export class Router {
  routes: {regex: RegExp | string, handler: (params: TRouteCallbackParams) => TRouteMatchDetails}[] = [];
  root: string = '/';

  static clearSlashes(path: string): string {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  }

  constructor(rootPath?: string) {
    this.root = rootPath ? ('/' + Router.clearSlashes(rootPath) + '/') : '/';
  }

  getLocationPath(path?: string): string {
    path = path || decodeURI(location.pathname + location.search);
    // remove root path
    path = this.root !== '/' ? path.replace(this.root, '') : path;
    return Router.clearSlashes(path);
  }

  isRouteAdded(regex: RegExp | null): boolean {
    const filterKey: string = regex instanceof RegExp ? regex.toString() : '';
    const route = this.routes.find(r => r.regex.toString() === filterKey);
    return !!route;
  }

  addRoute(regex: RegExp | null, handler: (params: TRouteCallbackParams) => TRouteMatchDetails): Router {
    if (!this.isRouteAdded(regex)) { // prevent adding the same route multiple times
      this.routes.push({regex: regex === null ? '' : regex, handler: handler});
    }
    return this;
  }

  buildQueryParams(paramsStr: string): TRouteQueryParams {
    let qParams: TRouteQueryParams = {} as TRouteQueryParams;
    if (paramsStr) {
      let qs: string[] = paramsStr.split('&');
      qs.forEach((qp: string) => {
        const qParam = qp.split('=');
        qParams[qParam[0] as string] = qParam[1];
      });
    }
    return qParams;
  }

  checkRouteDetails(path?: string): TRouteMatchDetails | null {
    let routeDetails: TRouteMatchDetails | null = null;
    let locationPath: string = path ? this.getLocationPath(path) : this.getLocationPath();
    console.log('Router.checkRouteDetails.locationPath: ', locationPath);

    const qsStartIndex: number = locationPath.indexOf('?');
    let qs: string = '';
    if (qsStartIndex > -1) {
      const loc = locationPath.split('?');
      locationPath = loc[0];
      qs = loc[1];
    }

    for (let i = 0; i < this.routes.length; i++) {
      let match = locationPath.match(this.routes[i].regex);
      if (match) {
        const routeParams: TRouteCallbackParams = {
          matchDetails: match.slice(0),
          queryParams: this.buildQueryParams(qs)
        };
        routeDetails = this.routes[i].handler.bind({}, routeParams)();
        break;
      }
    }
    return routeDetails;
  }

  navigate(path?: string, navigateCallback?: (() => void) | null) {
    path = path ? path : '';
    history.pushState(null, '', this.root + Router.clearSlashes(path));
    if (typeof navigateCallback === 'function') {
      navigateCallback();
    }
    return this;
  }
}
