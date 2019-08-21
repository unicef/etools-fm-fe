import { customElement, html, LitElement, TemplateResult } from 'lit-element';
import '../../common/layout/page-content-header/page-content-header';
import '../../common/layout/etools-tabs';
import { pageLayoutStyles } from '../../styles/page-layout-styles';
import { pageContentHeaderSlottedStyles } from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import { SharedStyles } from '../../styles/shared-styles';
import { buttonsStyles } from '../../styles/button-styles';
import { getEndpoint } from '../../../endpoints/endpoints';
import { SITES_EXPORT } from '../../../endpoints/endpoints-list';
import { store } from '../../../redux/store';
import { routeDetailsSelector } from '../../../redux/selectors/app.selectors';
import { specificLocations } from '../../../redux/reducers/site-specific-locations.reducer';
import { addTranslates, ENGLISH } from '../../../localization/localisation';
import { SITES_TRANSLATES } from '../../../localization/en/settings-page/sites.translates';

store.addReducers({ specificLocations });
addTranslates(ENGLISH, [SITES_TRANSLATES]);

@customElement('fm-settings')
export class FmSettingsComponent extends LitElement {
    public pageTabs: PageTab[] = [
        {
            tab: 'sites',
            tabLabel: 'Sites',
            hidden: false
        }, {
            tab: 'other',
            tabLabel: 'Other',
            hidden: false
        }
    ];

    public activeTab: string = 'sites';

    public render(): TemplateResult | void {
        return html`
            ${SharedStyles} ${pageContentHeaderSlottedStyles} ${pageLayoutStyles} ${buttonsStyles}
            <page-content-header with-tabs-visible>
                 <h1 slot="page-title">Settings</h1>

                 <div slot="title-row-actions" class="content-header-actions">
                     <paper-button class="default left-icon" raised @tap="${() => this.exportData()}">
                        <iron-icon icon="file-download"></iron-icon>Export
                     </paper-button>
                </div>

                 <etools-tabs id="tabs" slot="tabs"
                             .tabs="${this.pageTabs}"
                             @iron-select="${({ detail }: any) => this.onSelect(detail.item)}"
                             .active-tab="${this.activeTab}"></etools-tabs>
            </page-content-header>

            <sites-tab></sites-tab>
        `;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        store.subscribe(routeDetailsSelector(({ routeName, subRouteName }: IRouteDetails) => {
            if (routeName !== 'settings') { return; }
            const oldTab: string = this.activeTab;
            this.activeTab = subRouteName as string;
            this.tabChanged(this.activeTab, oldTab);
        }));
    }

    public tabChanged(newTabName: string, oldTabName: string | undefined): void {
        if (!oldTabName) {
            // page load, tab init, component is gonna be imported in loadPageComponents action
            return;
        }
        if (newTabName !== oldTabName) {
            // go to new tab
            // updateAppLocation(
            //     `engagements/${this.engagement.id}/${newTabName}`, true);
        }
    }

    public onSelect(selectedTab: HTMLElement): void {
        const tabName: string = selectedTab.getAttribute('name') || '';
        this.tabChanged(tabName, this.activeTab);
    }

    public exportData(): void {
        const url: string = getEndpoint(SITES_EXPORT).url;
        const params: string = ''; // this.getQueryString()
        window.open(url + params, '_blank');
    }

}
