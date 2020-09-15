/**
 * Simple router that will help with:
 *  - registering app routes
 *  - check for app valid routes and get route details, like name, params or queryParams,
 */
export class Router {
  private routes: IRoute[] = [];
  private readonly root: string = '/';

  constructor(rootPath?: string) {
    this.root = rootPath && rootPath !== '/' ? '/' + Router.clearSlashes(rootPath) + '/' : '/';
  }

  static clearSlashes(path: string): string {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  }

  addRoute(regex: RegExp | null, handler: (params: IRouteCallbackParams) => IRouteDetails): Router {
    if (!this.isRouteAdded(regex)) {
      // prevent adding the same route multiple times
      this.routes.push({regex: regex === null ? '' : regex, handler});
    }
    return this;
  }

  /**
   * This method will match the given path/current location to a registered route.
   * If no route is matched it will return null.
   * If a match is found, based on route regex and match callback, it will return a TRouteDetails object with
   * details about this route: name, sub-route name (if any), route params, query params, route path.
   * @param path
   */
  getRouteDetails(path?: string): IRouteDetails | null {
    let routeDetails: IRouteDetails | null = null;
    let locationPath: string = path ? this.getLocationPath(path) : this.getLocationPath();

    const qsStartIndex: number = locationPath.indexOf('?');
    let qs = '';
    if (qsStartIndex > -1) {
      const loc: string[] = locationPath.split('?');
      locationPath = loc[0];
      qs = loc[1];
    }

    for (const router of this.routes) {
      const match: RegExpMatchArray | null = locationPath.match(router.regex);
      if (match) {
        const routeParams: IRouteCallbackParams = {
          matchDetails: match.slice(0).map((matchVal: string) => decodeURIComponent(matchVal)),
          queryParams: this.buildQueryParams(qs),
          queryParamsString: qs
        };
        routeDetails = router.handler.bind({}, routeParams)();
        break;
      }
    }
    return routeDetails;
  }

  navigate(path?: string, queryParams?: IRouteQueryParams, navigateCallback?: (() => void) | null): this {
    path = path ? this.prepareLocationPath(path, queryParams) : '';
    history.pushState(null, '', path);
    if (typeof navigateCallback === 'function') {
      navigateCallback();
    }
    return this;
  }

  prepareLocationPath(path: string, queryParams: IRouteQueryParams = {}): string {
    const preparedPath: string = !path.includes(this.root) ? this.root + Router.clearSlashes(path) : path;
    const queryString: string = this.encodeParams(queryParams);
    return `${preparedPath}${queryString ? '?' + queryString : ''}`;
  }

  /**
   * Get query string from query params object
   * @param {QueryParams} params
   * @returns {string}
   */
  encodeParams(params: QueryParams): string {
    const encodedParams: string[] = [];
    const keys: string[] = Object.keys(params);

    for (const key of keys) {
      const value: any = params[key];
      const encodedKey: string = encodeURIComponent(key);
      if (!value) {
        continue;
      }

      const encodedValue: string = Array.isArray(value)
        ? value.map((param: any) => encodeURIComponent(param.toString())).join(',')
        : encodeURIComponent(value.toString());
      if (encodedValue) {
        encodedParams.push(`${encodedKey}=${encodedValue}`);
      }
    }
    return encodedParams.join('&');
  }

  private getLocationPath(path?: string): string {
    path = path || decodeURI(location.pathname + location.search);
    // remove root path
    if (path.startsWith(this.root)) {
      // remove root only if it is the first
      path = path.replace(this.root, '');
    }
    // remove ending slash
    path = path.replace(/\/$/, '');
    return path;
  }

  private isRouteAdded(regex: RegExp | null): boolean {
    const filterKey: string = regex instanceof RegExp ? regex.toString() : '';
    const route: IRoute | undefined = this.routes.find((r: IRoute) => r.regex.toString() === filterKey);
    return Boolean(route);
  }

  private buildQueryParams(qs: string): IRouteQueryParams {
    const params: IRouteQueryParams = {};
    qs = (qs || '').replace(/^\?/, '').replace(/\+/g, '%20');
    const paramList: string[] = qs.split('&');
    for (const paramListItem of paramList) {
      const param: string[] = paramListItem.split('=');
      if (param[0]) {
        const key: string = decodeURIComponent(param[0]);
        const value: string = decodeURIComponent(param[1] || '');
        if (this.isArrayParam(param)) {
          const valueItems: string[] = value.split(',');
          params[key] = valueItems.map((item: string) => {
            return !Number.isNaN(+item) ? +item : item;
          });
        } else if (value && !Number.isNaN(+value)) {
          params[key] = +value;
        } else if (value === 'true') {
          params[key] = true;
        } else {
          params[key] = value || true;
        }
      }
    }
    return params;
  }

  private isArrayParam(param: any): boolean {
    return param[0].endsWith('__in') || (param[1] && !!~param[1].indexOf(','));
  }
}
