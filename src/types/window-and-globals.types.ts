// tslint:disable-next-line
interface Window {
    FMMixins: FMMixins;
    EtoolsMixinFactory: any;
    EtoolsAjaxRequestMixin: any;
}
// tslint:disable-next-line
interface FMMixins {
    AppConfig: any;
    ReduxMixin: any;
    CommonMethods: any;
    PermissionController: any;
    RouteHelperMixin: any;
    ErrorHandlerMixin: any;
    MapMixin: any;
}

declare const EtoolsMixinFactory: any;
declare const EtoolsAjaxRequestMixin: any;
declare const FMMixins: FMMixins;
declare const EtoolsMixins: {LoadingMixin: any};
declare const etoolsBehaviors: {EtoolsRefreshBehavior: any};
declare const _: any;
declare const L: any;
type HTMLElementEvent<T extends HTMLElement> = Event & {
    target: T & {invalid: boolean};
};

type RequestMethod = 'POST' | 'PATCH' | 'DELETE' | 'OPTIONS';
