import { CSSResultArray, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { store } from '../../../redux/store';
import { routeDetailsSelector } from '../../../redux/selectors/app.selectors';
import { updateAppLocation } from '../../../routing/routes';
import { SharedStyles } from '../../styles/shared-styles';
import { pageContentHeaderSlottedStyles } from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import { buttonsStyles } from '../../styles/button-styles';
import { pageLayoutStyles } from '../../styles/page-layout-styles';
import '../../common/layout/page-content-header/page-content-header';
import '../../common/layout/etools-tabs';
import { addTranslates, ENGLISH } from '../../../localization/localisation';
import { TEMPLATES_TRANSLATES } from '../../../localization/en/plan-page/templates-tab.translates';
import { questionTemplates } from '../../../redux/reducers/templates.reducer';
import { rationale } from '../../../redux/reducers/rationale.reducer';
import { RATIONALE_TRANSLATES } from '../../../localization/en/plan-page/rationale-tab.translates';
import { ISSUE_TRACKER_TRANSLATES } from '../../../localization/en/plan-page/issue-tracker.translates';
import { issueTracker } from '../../../redux/reducers/issue-tracker.reducer';
import { specificLocations } from '../../../redux/reducers/site-specific-locations.reducer';
import { attachmentsList } from '../../../redux/reducers/attachments-list.reducer';

store.addReducers({ questionTemplates, rationale, issueTracker, specificLocations, attachmentsList });
addTranslates(ENGLISH, [TEMPLATES_TRANSLATES, RATIONALE_TRANSLATES, ISSUE_TRACKER_TRANSLATES]);

const PAGE: string = 'plan';

const RATIONALE_TAB: string = 'rationale';
const ISSUE_TRACKER_TAB: string = 'issue-tracker';
const TEMPLATES_TAB: string = 'templates';

@customElement('plan-page')
export class PlanPage extends LitElement {
    public pageTabs: PageTab[] = [
        {
            tab: RATIONALE_TAB,
            tabLabel: 'Rationale',
            hidden: false
        },
        {
            tab: ISSUE_TRACKER_TAB,
            tabLabel: 'Issue Tracker',
            hidden: false
        },
        {
            tab: TEMPLATES_TAB,
            tabLabel: 'Templates',
            hidden: false
        }
    ];

    @property() public activeTab: string = ISSUE_TRACKER_TAB;

    public connectedCallback(): void {
        super.connectedCallback();
        store.subscribe(routeDetailsSelector(({ routeName, subRouteName }: IRouteDetails) => {
            if (routeName !== PAGE) { return; }
            this.activeTab = subRouteName as string;
        }));
    }

    public static get styles(): CSSResultArray {
        return [SharedStyles, pageContentHeaderSlottedStyles, pageLayoutStyles, buttonsStyles];
    }

    public render(): TemplateResult {
        return html`
        <page-content-header with-tabs-visible>
                 <h1 slot="page-title">Plan</h1>

                 <etools-tabs id="tabs" slot="tabs"
                             .tabs="${this.pageTabs}"
                             @iron-select="${({ detail }: any) => this.onSelect(detail.item)}"
                             .activeTab="${this.activeTab}"></etools-tabs>
            </page-content-header>

            ${ this.getTabElement() }`;
    }

    public getTabElement(): TemplateResult {
        switch (this.activeTab) {
            case RATIONALE_TAB:
                return html`<rationale-tab></rationale-tab>`;
            case ISSUE_TRACKER_TAB:
                return html`<issue-tracker-tab></issue-tracker-tab>`;
            case TEMPLATES_TAB:
                return html`<templates-tab></templates-tab>`;
            default:
                return html`Tab Not Found`;
        }
    }

    public onSelect(selectedTab: HTMLElement): void {
        const tabName: string = selectedTab.getAttribute('name') || '';
        if (this.activeTab === tabName) { return; }
        updateAppLocation(`${PAGE}/${tabName}`);
    }
}
