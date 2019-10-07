import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { updateAppLocation } from '../../../../routing/routes';
import '../../../common/layout/page-content-header/page-content-header';
import '../../../common/layout/etools-tabs';
import '../../../common/layout/status/etools-status';
import { IEtoolsStatusModel } from '../../../common/layout/status/etools-status';
import { RouterStyles } from '../../../app-shell/router-style';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageContentHeaderSlottedStyles } from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { buttonsStyles } from '../../../styles/button-styles';
import { store } from '../../../../redux/store';
import { routeDetailsSelector } from '../../../../redux/selectors/app.selectors';
import { translate } from '../../../../localization/localisation';

const PAGE: string = 'activities';
const SUB_ROUTE: string = 'item';

const DETAILS_TAB: string = 'details';
const ATTACHMENTS_TAB: string = 'attachments';

const STATUSES: IEtoolsStatusModel[] = [
    { status: 'draft', label: 'Draft' },
    { status: 'checklist', label: 'Checklist' },
    { status: 'review', label: 'Review' },
    { status: 'assigned', label: 'Assigned' },
    { status: 'data_collection', label: 'Data Collection' },
    { status: 'report_finalize', label: 'Report finalization' },
    { status: 'submitted', label: 'Submitted' },
    { status: 'completed', label: 'Completed' }
];

@customElement('activity-item')
export class NewActivityComponent extends LitElement {
    @property() public activityId: string | null = null;
    public pageTabs: PageTab[] = [
        {
            tab: DETAILS_TAB,
            tabLabel: 'Details',
            hidden: false
        }, {
            tab: ATTACHMENTS_TAB,
            tabLabel: 'Attachments',
            hidden: false
        }
    ];

    @property() public activeTab!: string;

    public connectedCallback(): void {
        super.connectedCallback();
        store.subscribe(routeDetailsSelector(({ routeName, subRouteName, params }: IRouteDetails) => {
            if (routeName !== PAGE || subRouteName !== SUB_ROUTE) { return; }
            const activeTab: string | null = params && params.tab as string;
            const activityId: string | null = params && params.id as string;
            this.activityId = activityId && activityId.trim() !== 'new'.trim() ? activityId : null;
            if (activeTab) {
                this.activeTab = activeTab;
            } else {
                this.activeTab = DETAILS_TAB;
                updateAppLocation(`activities/new/${DETAILS_TAB}`);
            }
        }));
    }

    public render(): TemplateResult {
        // language=HTML
        return html`
        ${SharedStyles} ${pageContentHeaderSlottedStyles} ${pageLayoutStyles} ${buttonsStyles} ${RouterStyles}

        <etools-status .statuses="${ STATUSES }"></etools-status>
        <page-content-header with-tabs-visible>
            <h1 slot="page-title">${ !this.activityId ? translate('ACTIVITY_ITEM.NEW_ACTIVITY') : this.activityId}</h1>

            <div slot="title-row-actions" class="content-header-actions">
            </div>

            <etools-tabs
                id="tabs" slot="tabs"
                .tabs="${this.pageTabs}"
                @iron-select="${({ detail }: any) => this.onSelect(detail.item)}"
                .activeTab="${this.activeTab}"></etools-tabs>
        </page-content-header>

        ${ this.getTabElement() }
        `;
    }

    public getTabElement(): TemplateResult {
        switch (this.activeTab) {
            case DETAILS_TAB:
                return html`<activity-details-tab></activity-details-tab>`;
            case ATTACHMENTS_TAB:
                return html`<activity-attachments-tab></activity-attachments-tab>`;
            default:
                return html`Tab Not Found`;
        }
    }

    public onSelect(selectedTab: HTMLElement): void {
        const tabName: string = selectedTab.getAttribute('name') || '';
        if (this.activeTab === tabName) { return; }
        updateAppLocation(`activities/new/${tabName}`);
    }
}
