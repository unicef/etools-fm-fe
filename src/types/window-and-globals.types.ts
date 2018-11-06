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
    QueryParamsMixin: any;
    ErrorHandlerMixin: any;
}

declare const EtoolsMixinFactory: any;
declare const EtoolsAjaxRequestMixin: any;
declare const FMMixins: FMMixins;
declare const EtoolsMixins: {LoadingMixin: any};
declare const etoolsBehaviors: {EtoolsRefreshBehavior: any};
declare const _: any;
