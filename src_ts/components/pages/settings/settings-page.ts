import { CSSResultArray, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
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
import { questions } from '../../../redux/reducers/questions.reducer';
import { addTranslates, ENGLISH } from '../../../localization/localisation';
import { SITES_TRANSLATES } from '../../../localization/en/settings-page/sites.translates';
import { QUESTIONS_TRANSLATES } from '../../../localization/en/settings-page/question.translates';
import { EtoolsRouter, updateAppLocation } from '../../../routing/routes';

store.addReducers({ specificLocations, questions });
addTranslates(ENGLISH, [SITES_TRANSLATES, QUESTIONS_TRANSLATES]);

const PAGE: string = 'settings';
const SITES_TAB: string = 'sites';
const QUESTIONS_TAB: string = 'questions';

@customElement('fm-settings')
export class FmSettingsComponent extends LitElement {
    public pageTabs: PageTab[] = [
        {
            tab: QUESTIONS_TAB,
            tabLabel: 'Questions',
            hidden: false
        }, {
            tab: SITES_TAB,
            tabLabel: 'Sites',
            hidden: false
        }
    ];

    @property() public activeTab: string = QUESTIONS_TAB;

    public render(): TemplateResult | void {
        return html`
            <page-content-header with-tabs-visible>
                 <h1 slot="page-title">Settings</h1>

                 <div slot="title-row-actions" class="content-header-actions" ?hidden="${this.activeTab !== SITES_TAB}">
                     <paper-button class="default left-icon" raised @tap="${() => this.exportData()}">
                        <iron-icon icon="file-download"></iron-icon>Export
                     </paper-button>
                </div>

                 <etools-tabs id="tabs" slot="tabs"
                             .tabs="${this.pageTabs}"
                             @iron-select="${({ detail }: any) => this.onSelect(detail.item)}"
                             .activeTab="${this.activeTab}"></etools-tabs>
            </page-content-header>

            ${ this.getTabElement() }
        `;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        store.subscribe(routeDetailsSelector(({ routeName, subRouteName }: IRouteDetails) => {
            if (routeName !== PAGE) { return; }
            this.activeTab = subRouteName as string;
        }));
    }

    public onSelect(selectedTab: HTMLElement): void {
        const tabName: string = selectedTab.getAttribute('name') || '';
        if (this.activeTab === tabName) { return; }
        updateAppLocation(`${PAGE}/${tabName}`);
    }

    public getTabElement(): TemplateResult {
        switch (this.activeTab) {
            case SITES_TAB:
                return html`<sites-tab></sites-tab>`;
            case QUESTIONS_TAB:
                return html`<questions-tab></questions-tab>`;
            default:
                return html`Tab Not Found`;
        }
    }

    public exportData(): void {
        const url: string = getEndpoint(SITES_EXPORT).url;
        const routeDetails: IRouteDetails | null = EtoolsRouter.getRouteDetails();
        const params: string = routeDetails && routeDetails.queryParamsString ?
            `?${routeDetails.queryParamsString}` :
            '';
        window.open(url + params, '_blank');
    }

    public static get styles(): CSSResultArray {
        return [SharedStyles, pageContentHeaderSlottedStyles, pageLayoutStyles, buttonsStyles];
    }

}
