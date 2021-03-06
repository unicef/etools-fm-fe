import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {updateAppLocation} from '../../../../routing/routes';
import '../../../common/layout/page-content-header/page-content-header';
import '../../../common/layout/etools-tabs';
import '../../../common/layout/status/etools-status';
import './statuses-actions/statuses-actions';
import {RouterStyles} from '../../../app-shell/router-style';
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {buttonsStyles} from '../../../styles/button-styles';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {SharedStyles} from '../../../styles/shared-styles';
import {activityDetailsData, activityStatusIsChanging} from '../../../../redux/selectors/activity-details.selectors';
import {activityDetails} from '../../../../redux/reducers/activity-details.reducer';
import {requestActivityDetails} from '../../../../redux/effects/activity-details.effects';
import {
  ASSIGNED,
  CANCELLED,
  CHECKLIST,
  COMPLETED,
  DATA_COLLECTION,
  DRAFT,
  REPORT_FINALIZATION,
  REVIEW,
  SUBMITTED
} from './statuses-actions/activity-statuses';
import {
  ADDITIONAL_INFO,
  ATTACHMENTS_TAB,
  CHECKLIST_TAB,
  COLLECT_TAB,
  DETAILS_TAB,
  REVIEW_TAB,
  SUMMARY_TAB,
  ACTION_POINTS,
  TABS_PROPERTIES
} from './activities-tabs';
import {Unsubscribe} from 'redux';
import {STAFF, TPM} from '../../../common/dropdown-options';
import {ACTIVITIES_PAGE} from '../activities-page';
import {translate} from 'lit-translate';
import {SaveRoute} from '../../../../redux/actions/app.actions';

store.addReducers({activityDetails});

const PAGE = 'activities';
const SUB_ROUTE = 'item';

const VALID_TABS: Set<string> = new Set([
  DETAILS_TAB,
  ATTACHMENTS_TAB,
  CHECKLIST_TAB,
  REVIEW_TAB,
  COLLECT_TAB,
  SUMMARY_TAB,
  ADDITIONAL_INFO,
  ACTION_POINTS
]);

export const STATUSES: IEtoolsStatusModel[] = [
  {status: DRAFT, label: translate(`ACTIVITY_ITEM.STATUSES.${DRAFT}`)},
  {status: CHECKLIST, label: translate(`ACTIVITY_ITEM.STATUSES.${CHECKLIST}`)},
  {status: REVIEW, label: translate(`ACTIVITY_ITEM.STATUSES.${REVIEW}`)},
  {status: ASSIGNED, label: translate(`ACTIVITY_ITEM.STATUSES.${ASSIGNED}`)},
  {status: DATA_COLLECTION, label: translate(`ACTIVITY_ITEM.STATUSES.${DATA_COLLECTION}`)},
  {status: REPORT_FINALIZATION, label: translate(`ACTIVITY_ITEM.STATUSES.${REPORT_FINALIZATION}`)},
  {status: SUBMITTED, label: translate(`ACTIVITY_ITEM.STATUSES.${SUBMITTED}`)},
  {status: COMPLETED, label: translate(`ACTIVITY_ITEM.STATUSES.${COMPLETED}`)}
];
const CANCELLED_STATUS: IEtoolsStatusModel[] = [
  {
    status: CANCELLED,
    label: translate(`ACTIVITY_ITEM.STATUSES.${CANCELLED}`)
  }
];

@customElement('activity-item')
export class NewActivityComponent extends LitElement {
  @property() activityId: string | null = null;
  @property() activityDetails: IActivityDetails | null = null;
  @property() isStatusUpdating = false;
  pageTabs: PageTab[] = [
    {
      tab: DETAILS_TAB,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${DETAILS_TAB}`),
      hidden: false
    },
    {
      tab: CHECKLIST_TAB,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${CHECKLIST_TAB}`),
      hidden: false
    },
    {
      tab: REVIEW_TAB,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${REVIEW_TAB}`),
      hidden: false
    },
    {
      tab: COLLECT_TAB,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${COLLECT_TAB}`),
      hidden: false
    },
    {
      tab: SUMMARY_TAB,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${SUMMARY_TAB}`),
      hidden: false
    },
    {
      tab: ATTACHMENTS_TAB,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${ATTACHMENTS_TAB}`),
      hidden: false
    },
    {
      tab: ADDITIONAL_INFO,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${ADDITIONAL_INFO}`),
      hidden: false
    },
    {
      tab: ACTION_POINTS,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${ACTION_POINTS}`),
      hidden: false
    }
  ];
  @property() activeTab!: string;
  private isLoadUnsubscribe!: Unsubscribe;
  private activityDetailsUnsubscribe!: Unsubscribe;
  private routeDetailsUnsubscribe!: Unsubscribe;
  private isLoad = false;

  render(): TemplateResult {
    // language=HTML
    return html`
      <etools-loading
        ?active="${this.isLoad}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>

      <etools-loading
        ?active="${this.isStatusUpdating}"
        loading-text="${translate('ACTIVITY_ITEM.STATUS_CHANGE')}"
      ></etools-loading>

      <etools-status
        .statuses="${this.getStatuses()}"
        .activeStatus="${this.activityDetails?.status || DRAFT}"
      ></etools-status>

      <page-content-header with-tabs-visible>
        <h1 slot="page-title">${(this.activityDetails && this.activityDetails.reference_number) || 'New'}</h1>

        <div slot="title-row-actions" class="content-header-actions">
          <statuses-actions
            .activityId="${this.activityDetails && this.activityDetails.id}"
            .possibleTransitions="${(this.activityDetails && this.activityDetails.transitions) || []}"
            ?is-staff="${this.activityDetails && this.activityDetails.monitor_type === STAFF}"
          ></statuses-actions>

          <paper-button
            ?hidden="${this.activityDetails?.status !== DATA_COLLECTION || this.activityDetails.monitor_type !== TPM}"
            class="visit-letter-button"
            @tap="${() =>
              window.open(
                `/api/v1/field-monitoring/planning/activities/${this.activityDetails!.id}/visit-letter/`,
                '_blank'
              )}"
          >
            ${translate('ACTIVITY_DETAILS.VISIT_LETTER')}
          </paper-button>
        </div>

        <etools-tabs
          id="tabs"
          slot="tabs"
          .tabs="${this.getTabList()}"
          @iron-select="${({detail}: any) => this.onSelect(detail.item)}"
          .activeTab="${this.activeTab}"
        ></etools-tabs>
      </page-content-header>

      ${this.getTabElement()}
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    store.dispatch(new SaveRoute(null));
    this.isLoad = true;
    // On Activity data changes
    this.activityDetailsUnsubscribe = store.subscribe(
      activityDetailsData((data: IActivityDetails | null) => {
        if (!data) {
          return;
        }
        this.activityDetails = data;
        this.checkTab();
      }, false)
    );

    // On Route changes
    this.routeDetailsUnsubscribe = store.subscribe(
      routeDetailsSelector(({routeName, subRouteName, params}: IRouteDetails) => {
        if (routeName !== PAGE || subRouteName !== SUB_ROUTE) {
          return;
        }
        const activityId: string | null = params && (params.id as string);

        if (!activityId) {
          updateAppLocation('page-not-found');
        }
        this.activityId = activityId;

        if (this.activityId === 'new') {
          this.activityDetails = null;
          this.checkTab();
        } else {
          const activityDetailsState: IActivityDetailsState = store.getState().activityDetails;
          const loadedActivityId: number | null =
            activityDetailsState && activityDetailsState.data && activityDetailsState.data.id;
          const isNotLoaded: boolean = !loadedActivityId || `${loadedActivityId}` !== `${activityId}`;

          if (this.activityId && isNotLoaded) {
            store.dispatch<AsyncEffect>(requestActivityDetails(this.activityId)).then(() => {
              if (store.getState().activityDetails.error) {
                updateAppLocation(ACTIVITIES_PAGE);
              }
            });
          } else {
            this.activityDetails = activityDetailsState.data as IActivityDetails;
            this.checkTab();
          }
        }
      })
    );

    this.isLoadUnsubscribe = store.subscribe(
      activityStatusIsChanging((isLoad: boolean | null) => {
        this.isStatusUpdating = Boolean(isLoad);
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.isLoadUnsubscribe();
    this.activityDetailsUnsubscribe();
    this.routeDetailsUnsubscribe();
  }

  getTabElement(): TemplateResult {
    switch (this.activeTab) {
      case DETAILS_TAB:
        return html` <activity-details-tab .activityId="${this.activityId}"></activity-details-tab> `;
      case ATTACHMENTS_TAB:
        return html` <activity-attachments-tab .activityDetails="${this.activityDetails}"></activity-attachments-tab> `;
      case CHECKLIST_TAB:
        return html`
          <activity-checklist-tab
            .activityId="${this.activityId}"
            ?readonly="${!this.checkEditPermission(CHECKLIST_TAB)}"
          ></activity-checklist-tab>
        `;
      case REVIEW_TAB:
        return html` <activity-review-tab .activityId="${this.activityId}"></activity-review-tab> `;
      case COLLECT_TAB:
        return html` <data-collect-tab activity-id="${this.activityId}"></data-collect-tab> `;
      case SUMMARY_TAB:
        return html`
          <activity-summary-tab
            .activityId="${this.activityId}"
            ?readonly="${!this.checkEditPermission(SUMMARY_TAB)}"
          ></activity-summary-tab>
        `;
      case ADDITIONAL_INFO:
        return html` <additional-info-tab .activityDetails="${this.activityDetails}"></additional-info-tab> `;
      case ACTION_POINTS:
        return html` <action-points-tab .activityDetails="${this.activityDetails}"></action-points-tab> `;
      default:
        return html``;
    }
  }

  getTabList(): PageTab[] {
    if (this.activityId === 'new') {
      return [
        {
          tab: DETAILS_TAB,
          tabLabel: translate(`ACTIVITY_ITEM.TABS.${DETAILS_TAB}`),
          hidden: false
        }
      ];
    } else {
      return this.pageTabs.filter(({tab}: PageTab) => {
        const property: string = TABS_PROPERTIES[tab];
        return !property || this.checkActivityDetailsPermissions(this.activityDetails, property);
      });
    }
  }

  getStatuses(): IEtoolsStatusModel[] {
    return this.activityDetails?.status === CANCELLED ? CANCELLED_STATUS : STATUSES;
  }

  onSelect(selectedTab: HTMLElement): void {
    const tabName: string = selectedTab.getAttribute('name') || '';
    if (this.activeTab === tabName) {
      return;
    }
    updateAppLocation(`activities/${this.activityId || 'new'}/${tabName}`);
  }

  private checkEditPermission(target: string): boolean {
    return !!this.activityDetails?.permissions.edit[(TABS_PROPERTIES[target] || '') as keyof ActivityPermissionsObject];
  }

  private checkTab(): void {
    const {params}: IRouteDetails = store.getState().app.routeDetails;
    const activeTab: string | null = params && (params.tab as string);

    const isValidTab: boolean = VALID_TABS.has(`${activeTab}`);
    const tabProperty: string = TABS_PROPERTIES[activeTab || ''];
    const canViewTab: boolean =
      isValidTab && (!tabProperty || this.checkActivityDetailsPermissions(this.activityDetails, tabProperty));
    this.isLoad = false;
    if (canViewTab) {
      this.activeTab = `${activeTab}`;
    } else {
      this.activeTab = DETAILS_TAB;
      updateAppLocation(`activities/${this.activityDetails?.id || 'new'}/${DETAILS_TAB}`);
    }
  }

  private checkActivityDetailsPermissions(activityDetails: IActivityDetails | null, property: string): boolean {
    if (activityDetails) {
      return activityDetails.permissions.view[property as keyof ActivityPermissionsObject];
    } else return property === DETAILS_TAB;
  }

  static get styles(): CSSResultArray {
    return [
      SharedStyles,
      pageContentHeaderSlottedStyles,
      pageLayoutStyles,
      RouterStyles,
      buttonsStyles,
      css`
        .visit-letter-button {
          height: 36px;
          padding: 0 18px;
          color: white;
          background: var(--gray-mid);
          font-weight: 500;
        }
      `
    ];
  }
}
