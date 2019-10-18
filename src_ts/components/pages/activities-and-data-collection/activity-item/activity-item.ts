import { CSSResultArray, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { updateAppLocation } from '../../../../routing/routes';
import '../../../common/layout/page-content-header/page-content-header';
import '../../../common/layout/etools-tabs';
import '../../../common/layout/status/etools-status';
import './statuses-actions/statuses-actions';
import { IEtoolsStatusModel } from '../../../common/layout/status/etools-status';
import { RouterStyles } from '../../../app-shell/router-style';
import { pageContentHeaderSlottedStyles } from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { buttonsStyles } from '../../../styles/button-styles';
import { store } from '../../../../redux/store';
import { routeDetailsSelector } from '../../../../redux/selectors/app.selectors';
import { translate } from '../../../../localization/localisation';
import { SharedStyles } from '../../../styles/shared-styles';
import {
    activityDetailsData,
    activityStatusIsChanging
} from '../../../../redux/selectors/activity-details.selectors';
import { activityDetails } from '../../../../redux/reducers/activity-details.reducer';
import { requestActivityDetails } from '../../../../redux/effects/activity-details.effects';
import {
    ASSIGNED,
    CHECKLIST, COMPLETED,
    DATA_COLLECTION,
    DRAFT,
    REPORT_FINALIZATION,
    REVIEW, SUBMITTED
} from './statuses-actions/activity-statuses';
import { Unsubscribe } from 'redux';

store.addReducers({ activityDetails });

const PAGE: string = 'activities';
const SUB_ROUTE: string = 'item';

const DETAILS_TAB: string = 'details';
const ATTACHMENTS_TAB: string = 'attachments';
const CHECKLIST_TAB: string = 'checklist';
const REVIEW_TAB: string = 'review';

const STATUSES: IEtoolsStatusModel[] = [
    { status: DRAFT, label: 'Draft' },
    { status: CHECKLIST, label: 'Checklist' },
    { status: REVIEW, label: 'Review' },
    { status: ASSIGNED, label: 'Assigned' },
    { status: DATA_COLLECTION, label: 'Data Collection' },
    { status: REPORT_FINALIZATION, label: 'Report finalization' },
    { status: SUBMITTED, label: 'Submitted' },
    { status: COMPLETED, label: 'Completed' }
];

@customElement('activity-item')
export class NewActivityComponent extends LitElement {
    @property() public activityId: string | null = null;
    @property() public activityDetails?: IActivityDetails;
    @property() public isLoad: boolean = false;

    public pageTabs: PageTab[] = [
        {
            tab: DETAILS_TAB,
            tabLabel: 'Details',
            hidden: false
        }, {
            tab: ATTACHMENTS_TAB,
            tabLabel: 'Attachments',
            hidden: false
        }, {
            tab: CHECKLIST_TAB,
            tabLabel: 'Checklist',
            hidden: false
        }, {
            tab: REVIEW_TAB,
            tabLabel: 'Review',
            hidden: false
        }
    ];

    @property() public activeTab!: string;
    private isLoadUnsubscribe!: Unsubscribe;

    public static get styles(): CSSResultArray {
        return [SharedStyles, pageContentHeaderSlottedStyles, pageLayoutStyles, RouterStyles, buttonsStyles];
    }

    public render(): TemplateResult {
        // language=HTML
        return html`

            <etools-loading ?active="${ this.isLoad }" loading-text="${ translate('ACTIVITY_ITEM.STATUS_CHANGE') }"></etools-loading>

            <etools-status .statuses="${ STATUSES }" .activeStatus="${ this.activityDetails && this.activityDetails.status }"></etools-status>

            <page-content-header with-tabs-visible>
            <h1 slot="page-title">${ !this.activityDetails ? translate('ACTIVITY_ITEM.NEW_ACTIVITY') : this.activityDetails.reference_number}</h1>

            <div slot="title-row-actions" class="content-header-actions">
                <statuses-actions
                        .currentStatus="${ this.activityDetails && this.activityDetails.status }"
                        .activityType="${ this.activityDetails && this.activityDetails.activity_type }"
                        .activityId="${ this.activityDetails && this.activityDetails.id }"></statuses-actions>
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

    public connectedCallback(): void {
        super.connectedCallback();
        store.subscribe(activityDetailsData((data: IActivityDetails | null) => {
            if (data) {
                this.activityDetails = data;
            }
        }));
        store.subscribe(routeDetailsSelector(({ routeName, subRouteName, params }: IRouteDetails) => {
            if (routeName !== PAGE || subRouteName !== SUB_ROUTE) { return; }
            const activeTab: string | null = params && params.tab as string;
            const activityId: string | null = params && params.id as string;
            this.activityId = activityId && activityId.trim() !== 'new'.trim() ? activityId : null;
            const state: IActivityDetailsState = (store.getState() as IRootState).activityDetails;
            const isNotLoaded: boolean = !state || !state.data;
            if (this.activityId && isNotLoaded) {
                store.dispatch<AsyncEffect>(requestActivityDetails(this.activityId));
            }
            if (activeTab) {
                this.activeTab = activeTab;
            } else {
                this.activeTab = DETAILS_TAB;
                updateAppLocation(`activities/${ activityId }/${DETAILS_TAB}`);
            }
        }));
        this.isLoadUnsubscribe = store.subscribe(activityStatusIsChanging((isLoad: boolean | null) => {
            this.isLoad = Boolean(isLoad);
        }));
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.isLoadUnsubscribe();
    }

    public getTabElement(): TemplateResult {
        switch (this.activeTab) {
            case DETAILS_TAB:
                return html`<activity-details-tab .activityId="${ this.activityId }"></activity-details-tab>`;
            case ATTACHMENTS_TAB:
                return html`<activity-attachments-tab></activity-attachments-tab>`;
            case CHECKLIST_TAB:
                return html`<activity-checklist-tab .activityId="${ this.activityId }"></activity-checklist-tab>`;
            case REVIEW_TAB:
                return html`<activity-review-tab .activityId="${ this.activityId }"></activity-review-tab>`;
            default:
                return html`Tab Not Found`;
        }
    }

    public onSelect(selectedTab: HTMLElement): void {
        const tabName: string = selectedTab.getAttribute('name') || '';
        if (this.activeTab === tabName) { return; }
        updateAppLocation(`activities/${ this.activityId || 'new' }/${tabName}`);
    }
}
