import { CSSResultArray, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { updateAppLocation } from '../../../../routing/routes';
import '../../../common/layout/page-content-header/page-content-header';
import '../../../common/layout/etools-tabs';
import '../../../common/layout/status/etools-status';
import './statuses-actions/statuses-actions';
import { RouterStyles } from '../../../app-shell/router-style';
import { pageContentHeaderSlottedStyles } from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { buttonsStyles } from '../../../styles/button-styles';
import { store } from '../../../../redux/store';
import { routeDetailsSelector } from '../../../../redux/selectors/app.selectors';
import { addTranslates, ENGLISH, translate } from '../../../../localization/localisation';
import { SharedStyles } from '../../../styles/shared-styles';
import {
    activityDetailsData,
    activityStatusIsChanging
} from '../../../../redux/selectors/activity-details.selectors';
import { activityDetails } from '../../../../redux/reducers/activity-details.reducer';
import { requestActivityDetails } from '../../../../redux/effects/activity-details.effects';
import {
    ASSIGNED,
    CHECKLIST,
    COMPLETED,
    DATA_COLLECTION,
    DRAFT,
    REPORT_FINALIZATION,
    REVIEW,
    SUBMITTED
} from './statuses-actions/activity-statuses';
import { ATTACHMENTS_TAB, CHECKLIST_TAB, DETAILS_TAB, REVIEW_TAB } from './activities-tabs';
import { Unsubscribe } from 'redux';
import { hasActivityPermission, Permissions } from '../../../../config/permissions';
import { ACTIVITY_ITEM_TRANSLATES } from '../../../../localization/en/activities-and-data-collection/activity-item.translates';

store.addReducers({ activityDetails });
addTranslates(ENGLISH, [ACTIVITY_ITEM_TRANSLATES]);

const PAGE: string = 'activities';
const SUB_ROUTE: string = 'item';

const VALID_TABS: Set<string> = new Set([DETAILS_TAB, ATTACHMENTS_TAB, CHECKLIST_TAB, REVIEW_TAB]);

export const STATUSES: IEtoolsStatusModel[] = [
    { status: DRAFT, label: translate(`ACTIVITY_ITEM.STATUSES.${ DRAFT }`) },
    { status: CHECKLIST, label: translate(`ACTIVITY_ITEM.STATUSES.${ CHECKLIST }`) },
    { status: REVIEW, label: translate(`ACTIVITY_ITEM.STATUSES.${ REVIEW }`) },
    { status: ASSIGNED, label: translate(`ACTIVITY_ITEM.STATUSES.${ ASSIGNED }`) },
    { status: DATA_COLLECTION, label: translate(`ACTIVITY_ITEM.STATUSES.${ DATA_COLLECTION }`) },
    { status: REPORT_FINALIZATION, label: translate(`ACTIVITY_ITEM.STATUSES.${ REPORT_FINALIZATION }`) },
    { status: SUBMITTED, label: translate(`ACTIVITY_ITEM.STATUSES.${ SUBMITTED }`) },
    { status: COMPLETED, label: translate(`ACTIVITY_ITEM.STATUSES.${ COMPLETED }`) }
];

@customElement('activity-item')
export class NewActivityComponent extends LitElement {
    @property() public activityId: string | null = null;
    @property() public activityDetails?: IActivityDetails;
    @property() public isStatusUpdating: boolean = false;

    public get personResponsible(): number | null {
        return this.activityDetails &&
            this.activityDetails.person_responsible &&
            this.activityDetails.person_responsible.id || null;
    }

    public pageTabs: PageTab[] = [
        {
            tab: DETAILS_TAB,
            tabLabel: translate(`ACTIVITY_ITEM.TABS.${ DETAILS_TAB }`),
            hidden: false
        }, {
            tab: CHECKLIST_TAB,
            tabLabel: translate(`ACTIVITY_ITEM.TABS.${ CHECKLIST_TAB }`),
            hidden: false,
            requiredPermission: Permissions.VIEW_CHECKLIST_TAB
        }, {
            tab: REVIEW_TAB,
            tabLabel: translate(`ACTIVITY_ITEM.TABS.${ REVIEW_TAB }`),
            hidden: false,
            requiredPermission: Permissions.VIEW_REVIEW_TAB
        }, {
            tab: ATTACHMENTS_TAB,
            tabLabel: translate(`ACTIVITY_ITEM.TABS.${ ATTACHMENTS_TAB }`),
            hidden: false
        }
    ];

    @property() public activeTab!: string;
    private isLoadUnsubscribe!: Unsubscribe;
    private activityDetailsUnsubscribe!: Unsubscribe;
    private routeDetailsUnsubscribe!: Unsubscribe;

    private tabPermissions: GenericObject<Permissions> = {
        [CHECKLIST_TAB]: Permissions.VIEW_CHECKLIST_TAB,
        [REVIEW_TAB]: Permissions.VIEW_REVIEW_TAB
    };

    public render(): TemplateResult {
        // language=HTML
        return html`

            <etools-loading ?active="${ this.isStatusUpdating }" loading-text="${ translate('ACTIVITY_ITEM.STATUS_CHANGE') }"></etools-loading>

            <etools-status .statuses="${ STATUSES }" .activeStatus="${ this.activityDetails && this.activityDetails.status }"></etools-status>

            <page-content-header with-tabs-visible>
                <h1 slot="page-title">${ !this.activityDetails ? translate('ACTIVITY_ITEM.NEW_ACTIVITY') : this.activityDetails.reference_number}</h1>

                <div slot="title-row-actions" class="content-header-actions">
                    <statuses-actions .activityDetails="${ this.activityDetails }"></statuses-actions>
                </div>

                <etools-tabs
                    id="tabs" slot="tabs"
                    .tabs="${ this.getTabList() }"
                    @iron-select="${({ detail }: any) => this.onSelect(detail.item)}"
                    .activeTab="${this.activeTab}"></etools-tabs>
            </page-content-header>

        ${ this.getTabElement() }
        `;
    }

    public connectedCallback(): void {
        super.connectedCallback();

        // On Activity data changes
        this.activityDetailsUnsubscribe = store.subscribe(activityDetailsData((data: IActivityDetails | null) => {
            if (!data) { return; }
            this.activityDetails = data;
            this.checkTab();
        }, false));

        // On Route changes
        this.routeDetailsUnsubscribe = store.subscribe(routeDetailsSelector(({ routeName, subRouteName, params }: IRouteDetails) => {
            if (routeName !== PAGE || subRouteName !== SUB_ROUTE) { return; }
            const activityId: string | null = params && params.id as string;

            if (!activityId) { updateAppLocation('page-not-found'); }
            this.activityId = activityId;

            const activityDetailsState: IActivityDetailsState = store.getState().activityDetails;
            const loadedActivityId: number | null = activityDetailsState &&
                activityDetailsState.data &&
                activityDetailsState.data.id;
            const isNotLoaded: boolean = !loadedActivityId || `${ loadedActivityId }` !== `${ activityId }`;

            if (this.activityId && isNotLoaded) {
                store.dispatch<AsyncEffect>(requestActivityDetails(this.activityId));
            } else {
                this.activityDetails = activityDetailsState.data as IActivityDetails;
                this.checkTab();
            }
        }));

        // On update status flag changes
        this.isLoadUnsubscribe = store.subscribe(activityStatusIsChanging((isLoad: boolean | null) => {
            this.isStatusUpdating = Boolean(isLoad);
        }));
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.isLoadUnsubscribe();
        this.activityDetailsUnsubscribe();
        this.routeDetailsUnsubscribe();
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
                return html``;
        }
    }

    public getTabList(): PageTab[] {
        if (!this.activityDetails) { return []; }
        return this.pageTabs.filter(({ tab }: PageTab) => {
            return !this.tabPermissions[tab] ||
                hasActivityPermission(
                    this.tabPermissions[tab],
                    this.activityDetails as IActivityDetails
                );
        });
    }

    public onSelect(selectedTab: HTMLElement): void {
        const tabName: string = selectedTab.getAttribute('name') || '';
        if (this.activeTab === tabName) { return; }
        updateAppLocation(`activities/${ this.activityId || 'new' }/${tabName}`);
    }

    private checkTab(): void {
        if (!this.activityDetails) { return; }

        const { params }: IRouteDetails = store.getState().app.routeDetails;
        const activeTab: string | null = params && params.tab as string;

        const isValidTab: boolean = VALID_TABS.has(`${ activeTab }`);
        const canViewTab: boolean = isValidTab &&
            (!this.tabPermissions[activeTab as string] ||
                hasActivityPermission(`VIEW_${ (activeTab as string).toUpperCase() }_TAB`, this.activityDetails));

        if (canViewTab) {
            this.activeTab = `${ activeTab }`;
        } else {
            this.activeTab = DETAILS_TAB;
            updateAppLocation(`activities/${ this.activityDetails.id }/${DETAILS_TAB}`);
        }
    }

    public static get styles(): CSSResultArray {
        return [SharedStyles, pageContentHeaderSlottedStyles, pageLayoutStyles, RouterStyles, buttonsStyles];
    }
}
