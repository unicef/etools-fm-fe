// tslint:disable-next-line
interface Window {
    FMMixins: FMMixins;
    EtoolsMixinFactory: any;
}
// tslint:disable-next-line
interface FMMixins {
    AppConfig: any;
    ReduxMixin: any;
    PermissionController: any;
    QueryParamsMixin: any;
}

declare const EtoolsMixinFactory: any;
declare const FMMixins: FMMixins;
declare const EtoolsMixins: {LoadingMixin: any};
declare const etoolsBehaviors: {EtoolsRefreshBehavior: any};
declare const _: any;
