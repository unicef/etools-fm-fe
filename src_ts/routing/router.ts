export type TRouteQueryParam = {[key: string]: string};
export type TRouteParams = {[key: string]: number | string};

export type TRouteQueryParams = {
  [key: string]: string
};

export type TRouteCallbackParams = {
  matchDetails: string[];
  queryParams: TRouteQueryParams;
};

export type TRouteDetails = {
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
  routes: {regex: RegExp | string, handler: (params: TRouteCallbackParams) => TRouteDetails}[] = [];
  root: string = '/';

  static clearSlashes(path: string): string {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  }

  constructor(rootPath?: string) {
    this.root = (rootPath && rootPath !== '/') ? ('/' + Router.clearSlashes(rootPath) + '/') : '/';
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

  addRoute(regex: RegExp | null, handler: (params: TRouteCallbackParams) => TRouteDetails): Router {
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

  /**
   * This method will match the given path/current location to a registered route.
   * If no route is matched it will return null.
   * If a match is found, based on route regex and match callback, it will return a TRouteDetails object with
   * details about this route: name, sub-route name (if any), route params, query params, route path.
   * @param path
   */
  getRouteDetails(path?: string): TRouteDetails | null {
    let routeDetails: TRouteDetails | null = null;
    let locationPath: string = path ? this.getLocationPath(path) : this.getLocationPath();
    console.log('Router.getRouteDetails.locationPath: ', locationPath);

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
          matchDetails: match.slice(0).map((matchVal: string) => decodeURIComponent(matchVal)),
          queryParams: this.buildQueryParams(qs)
        };
        routeDetails = this.routes[i].handler.bind({}, routeParams)();
        break;
      }
    }
    return routeDetails;
  }

  navigate(path?: string, navigateCallback?: (() => void) | null) {
    path = path ? (this.root + Router.clearSlashes(path)) : '';
    history.pushState(null, '', path);
    if (typeof navigateCallback === 'function') {
      navigateCallback();
    }
    return this;
  }
}
