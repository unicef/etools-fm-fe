import { InitializeApplication, FINISHED_INITIALIZATION_STATE } from './redux-store/actions/app-initialization.actions';
import { RunGlobalLoading, StopGlobalLoading } from './redux-store/actions/global-loading.actions';
import { AddNotification } from './redux-store/actions/notification.actions';

class AppShell extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.ReduxMixin,
    EtoolsMixins.LoadingMixin], Polymer.Element) {

    static get is() {return 'app-shell';}

    static get properties() {
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

    static get observers() {
        return [
            '_routePageChanged(route.path)'
        ];
    }

    ready() {
        super.ready();
        this.addEventListener('drawer-toggle-tap', e => this.toggleDrawer(e));

        this.addEventListener('404', e => this._pageNotFound(e));

        this.subscribeOnStore(store => store.globalLoading, loadingQueue => this.handleLoading(loadingQueue));
        this.subscribeOnStore(store => store.initialization, (initialization) => {
            if (initialization === FINISHED_INITIALIZATION_STATE) {
                this.page = _.get(this, 'routeData.page') || this._initRoute();
                this.dispatchOnStore(new StopGlobalLoading({type: 'initialization'}));
            }
        });
        this._setBgColor();
    }

    connectedCallback() {
        super.connectedCallback();
        this.dispatchOnStore(new RunGlobalLoading({type: 'initialization', message: 'Loading'}));
        this.dispatchOnStore(new InitializeApplication(['unicefUsers', 'locations']));
    }

    toggleDrawer() {
        const drawerWidth = !this.isDrawerOpened ? '220px' : '70px';
        this.isDrawerOpened = !this.isDrawerOpened;

        this.$.drawer.updateStyles({'--app-drawer-width': drawerWidth});
        this.$.layout.style.paddingLeft = drawerWidth;
        this.$.header.style.paddingLeft = drawerWidth;
    }

    _routePageChanged() {
        // if (!this.initLoadingComplete || !this.routeData.page) {return;}
        this.page = this.routeData.page || 'field-monitoring';
        this.scroll(0, 0);
    }

    _pageChanged(page) {
        if (this.$[`${page}`] instanceof Polymer.Element) {return;}
        // this.dispatchEvent(new CustomEvent('global-loading', {
        //     detail: {message: 'Loading...', active: true, type: 'initialisation !!Set another name!!'}
        // }));

        var resolvedPageUrl;
        if (page === 'not-found') {
            resolvedPageUrl = 'elements/pages/not-found-page-view/not-found-page-view.html';
        } else {
            resolvedPageUrl = `elements/pages/${page}-page-components/${page}-page-main/${page}-page-main.html`;
        }
        Polymer.importHref(resolvedPageUrl,
            () => this._loadPage(),
            event => this._pageNotFound(event),
            true);
    }

    _loadPage() {
        // if (!this.initLoadingComplete) {this.initLoadingComplete = true;}
        // this.dispatchEvent(new CustomEvent('global-loading', {detail:
        // {type: 'initialisation !!Set another name!!'}}));
    }

    _pageNotFound(event) {
        this.page = 'not-found';
        let message = event && event.detail && event.detail.message ?
            `${event.detail.message}` :
            'Oops you hit a 404!';

        this.dispatchOnStore(new AddNotification(message));
        // this.dispatchEvent(new CustomEvent('global-loading', {detail:
        // {type: 'initialisation !!Set another name!!'}}));
    }

    _initRoute() {
        let path = `${this.basePath}`;
        this.set('route.path', path);
        return '';
    }

    handleLoading(loadingQueue = []) {
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

    _setBgColor() {
        // If not production environment, changing header color to red
        if (!this.isProductionServer()) {
            this.updateStyles({'--header-bg-color': 'var(--nonprod-header-color)'});
        }
    }
}

customElements.define(AppShell.is, AppShell);
