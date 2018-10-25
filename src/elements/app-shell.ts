import { FINISHED_INITIALIZATION_STATE, InitializeApplication } from './redux-store/actions/app-initialization.actions';
import { RunGlobalLoading, StopGlobalLoading } from './redux-store/actions/global-loading.actions';
import { AddNotification } from './redux-store/actions/notification.actions';

class AppShell extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.ReduxMixin,
    EtoolsMixins.LoadingMixin], Polymer.Element) {

    public static get is() { return 'app-shell'; }

    public static get properties() {
        return {
            page: {
                type: String,
                reflectToAttribute: true,
                observer: '_pageChanged'
            },
            isDrawerOpened: {
                type: Boolean,
                value: true
            },
            route: {
                type: Object,
                notify: true
            },
            queryParams: Object
        };
    }

    public static get observers() {
        return [
            '_routePageChanged(route.path)'
        ];
    }

    public ready() {
        super.ready();
        this.addEventListener('drawer-toggle-tap', () => this.toggleDrawer());

        this.addEventListener('404', (event: CustomEvent) => this._pageNotFound(event));

        this.subscribeOnStore(
            (store: FMStore) => store.globalLoading,
            (loadingQueue: LoadingData[]) => this.handleLoading(loadingQueue)
        );
        this.subscribeOnStore((store: FMStore) => store.initialization, (initialization: string) => {
            if (initialization === FINISHED_INITIALIZATION_STATE) {
                this.page = _.get(this, 'routeData.page') || this._initRoute();
                this.dispatchOnStore(new StopGlobalLoading({type: 'initialization'}));
            }
        });
        this._setBgColor();
    }

    public connectedCallback() {
        super.connectedCallback();
        this.dispatchOnStore(new RunGlobalLoading({type: 'initialization', message: 'Loading'}));
        this.dispatchOnStore(new InitializeApplication(['unicefUsers', 'locations']));
    }

    public toggleDrawer() {
        const drawerWidth = !this.isDrawerOpened ? '220px' : '70px';
        this.isDrawerOpened = !this.isDrawerOpened;

        this.$.drawer.updateStyles({'--app-drawer-width': drawerWidth});
        this.$.layout.style.paddingLeft = drawerWidth;
        this.$.header.style.paddingLeft = drawerWidth;
    }

    public handleLoading(loadingQueue: LoadingData[] = []) {
        const loadingElement = this.$['global-loading'];
        const currentData = loadingQueue[0];

        if (currentData && loadingElement.type !== currentData.type) {
            loadingElement.loadingText = currentData.message;
            loadingElement.active = true;
            loadingElement.type = currentData.type;
        } else {
            loadingElement.active = false;
            loadingElement.type = null;
        }
    }

    public _routePageChanged() {
        // if (!this.initLoadingComplete || !this.routeData.page) {return;}
        this.page = this.routeData.page || 'field-monitoring';
        this.scroll(0, 0);
    }

    public _pageChanged(page: string) {
        if (this.$[`${page}`] instanceof Polymer.Element) { return; }
        // this.dispatchEvent(new CustomEvent('global-loading', {
        //     detail: {message: 'Loading...', active: true, type: 'initialisation !!Set another name!!'}
        // }));

        let resolvedPageUrl;
        if (page === 'not-found') {
            resolvedPageUrl = 'elements/pages/not-found-page-view/not-found-page-view.html';
        } else {
            resolvedPageUrl = `elements/pages/${page}-page-components/${page}-page-main/${page}-page-main.html`;
        }
        Polymer.importHref(resolvedPageUrl,
            () => this._loadPage(),
            (event: ErrorEvent) => this._pageNotFound(event),
            true);
    }

    private _loadPage() {
        // if (!this.initLoadingComplete) {this.initLoadingComplete = true;}
        // this.dispatchEvent(new CustomEvent('global-loading', {detail:
        // {type: 'initialisation !!Set another name!!'}}));
    }

    private _initRoute() {
        const path = `${this.basePath}`;
        this.set('route.path', path);
        return '';
    }

    private _pageNotFound(event: CustomEvent | ErrorEvent) {
        this.page = 'not-found';
        const reason = event instanceof ErrorEvent ?  event.message : _.get(event, 'detail.message');
        const message = reason ? `${reason}` : 'Oops you hit a 404!';

        this.dispatchOnStore(new AddNotification(message));
        // this.dispatchEvent(new CustomEvent('global-loading', {detail:
        // {type: 'initialisation !!Set another name!!'}}));
    }

    private _setBgColor() {
        // If not production environment, changing header color to red
        if (!this.isProductionServer()) {
            this.updateStyles({'--header-bg-color': 'var(--nonprod-header-color)'});
        }
    }
}

customElements.define(AppShell.is, AppShell);
