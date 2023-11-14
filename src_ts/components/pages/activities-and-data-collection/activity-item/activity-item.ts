import {html, css, LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {updateAppLocation} from '../../../../routing/routes';
import '../../../common/layout/page-content-header/page-content-header';
import '../../../common/layout/etools-tabs';
import '../../../common/layout/status/etools-status';
import './statuses-actions/statuses-actions';
import {RouterStyles} from '../../../app-shell/router-style';
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import {buttonsStyles} from '@unicef-polymer/etools-unicef/src/styles/button-styles';
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
import {translate, get as getTranslate} from 'lit-translate';
import {SaveRoute} from '../../../../redux/actions/app.actions';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {ActivityDetailsActions} from '../../../../redux/actions/activity-details.actions';
import {currentUser} from '../../../../redux/selectors/user.selectors';

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
  {status: DRAFT, label: getTranslate(`ACTIVITY_ITEM.STATUSES.${DRAFT}`)},
  {status: CHECKLIST, label: getTranslate(`ACTIVITY_ITEM.STATUSES.${CHECKLIST}`)},
  {status: REVIEW, label: getTranslate(`ACTIVITY_ITEM.STATUSES.${REVIEW}`)},
  {status: ASSIGNED, label: getTranslate(`ACTIVITY_ITEM.STATUSES.${ASSIGNED}`)},
  {status: DATA_COLLECTION, label: getTranslate(`ACTIVITY_ITEM.STATUSES.${DATA_COLLECTION}`)},
  {status: REPORT_FINALIZATION, label: getTranslate(`ACTIVITY_ITEM.STATUSES.${REPORT_FINALIZATION}`)},
  {status: SUBMITTED, label: getTranslate(`ACTIVITY_ITEM.STATUSES.${SUBMITTED}`)},
  {status: COMPLETED, label: getTranslate(`ACTIVITY_ITEM.STATUSES.${COMPLETED}`)}
];
const CANCELLED_STATUS: IEtoolsStatusModel[] = [
  {
    status: CANCELLED,
    label: getTranslate(`ACTIVITY_ITEM.STATUSES.${CANCELLED}`)
  }
];

@customElement('activity-item')
export class NewActivityComponent extends MatomoMixin(LitElement) {
  @property() activityId: string | null = null;
  @property() activityDetails: IActivityDetails | null = null;
  @property() isStatusUpdating = false;
  @property() activeTab!: string;
  @property() childInEditMode = false;
  @property() isUnicefUser = false;

  pageTabs: PageTab[] = [
    {
      tab: DETAILS_TAB,
      tabLabel: getTranslate(`ACTIVITY_ITEM.TABS.${DETAILS_TAB}`),
      hidden: false
    },
    {
      tab: CHECKLIST_TAB,
      tabLabel: getTranslate(`ACTIVITY_ITEM.TABS.${CHECKLIST_TAB}`),
      hidden: false
    },
    {
      tab: REVIEW_TAB,
      tabLabel: getTranslate(`ACTIVITY_ITEM.TABS.${REVIEW_TAB}`),
      hidden: false
    },
    {
      tab: COLLECT_TAB,
      tabLabel: getTranslate(`ACTIVITY_ITEM.TABS.${COLLECT_TAB}`),
      hidden: false
    },
    {
      tab: SUMMARY_TAB,
      tabLabel: getTranslate(`ACTIVITY_ITEM.TABS.${SUMMARY_TAB}`),
      hidden: false
    },
    {
      tab: ATTACHMENTS_TAB,
      tabLabel: getTranslate(`ACTIVITY_ITEM.TABS.${ATTACHMENTS_TAB}`),
      hidden: false
    },
    {
      tab: ADDITIONAL_INFO,
      tabLabel: getTranslate(`ACTIVITY_ITEM.TABS.${ADDITIONAL_INFO}`),
      hidden: false
    },
    {
      tab: ACTION_POINTS,
      tabLabel: getTranslate(`ACTIVITY_ITEM.TABS.${ACTION_POINTS}`),
      hidden: false
    }
  ];
  private isLoadUnsubscribe!: Unsubscribe;
  private activityDetailsUnsubscribe!: Unsubscribe;
  private routeDetailsUnsubscribe!: Unsubscribe;
  private userUnsubscribe!: Unsubscribe;
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
        <h1 slot="page-title">
          ${(this.activityDetails && this.activityDetails.reference_number) || translate('ACTIVITY_ITEM.NEW_ACTIVITY')}
        </h1>

        <div slot="title-row-actions" class="content-header-actions">
          <sl-button
              id="export"
              class="neutral"
              variant="text"
              @click="${this.export}"
              tracker="Export PDF"
              ?hidden="${this.hideExportButton()}"
            >
              <etools-icon name="file-download"></etools-icon>
              ${translate('ACTIVITY_DETAILS.EXPORT')}
           </sl-button>

          <statuses-actions
            .activityId="${this.activityDetails && this.activityDetails.id}"
            ?disableBtns="${this.childInEditMode}"
            .possibleTransitions="${(this.activityDetails && this.activityDetails.transitions) || []}"
            ?is-staff="${this.activityDetails && this.activityDetails.monitor_type === STAFF}"
          ></statuses-actions>

          <sl-button
            ?hidden="${this.activityDetails?.status !== DATA_COLLECTION || this.activityDetails.monitor_type !== TPM}"
            variant="text"
            class="neutral"
            target="_blank"
            href="${`/api/v1/field-monitoring/planning/activities/${this.activityDetails!.id}/visit-letter/`}"
          >
            ${translate('ACTIVITY_DETAILS.VISIT_LETTER')}
          </sl-button>
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
    this.addEventListener(
      'child-in-edit-mode-changed',
      ((e: CustomEvent) => (this.childInEditMode = e.detail.inEditMode)) as any
    );
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
      routeDetailsSelector(({routeName, subRouteName, params}: EtoolsRouteDetails) => {
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
          store.dispatch({
            type: ActivityDetailsActions.ACTIVITY_DETAILS_GET_SUCCESS,
            payload: null
          });
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
    this.userUnsubscribe = store.subscribe(
      currentUser((user: IEtoolsUserModel | null) => {
        this.isUnicefUser = user && user.is_unicef_user;
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.isLoadUnsubscribe();
    this.activityDetailsUnsubscribe();
    this.routeDetailsUnsubscribe();
    this.userUnsubscribe();
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
        return html`
          <additional-info-tab
            .isUnicefUser="${this.isUnicefUser}"
            .activityDetails="${this.activityDetails}"
          ></additional-info-tab>
        `;
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
          tabLabel: getTranslate(`ACTIVITY_ITEM.TABS.${DETAILS_TAB}`),
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

    fireEvent(this, 'child-in-edit-mode-changed', {inEditMode: false});
    updateAppLocation(`activities/${this.activityId || 'new'}/${tabName}`);
  }

  hideExportButton(): boolean {
    return (
      !this.activityDetails?.id || ![REPORT_FINALIZATION, SUBMITTED, COMPLETED].includes(this.activityDetails.status)
    );
  }

  export(e: any): void {
    e.currentTarget.blur();
    this.trackAnalytics(e);
    window.open(`/api/v1/field-monitoring/planning/activities/${this.activityDetails!.id}/pdf/`, '_blank');
  }

  private checkEditPermission(target: string): boolean {
    return !!this.activityDetails?.permissions.edit[(TABS_PROPERTIES[target] || '') as keyof ActivityPermissionsObject];
  }

  private checkTab(): void {
    const {params}: EtoolsRouteDetails = store.getState().app.routeDetails;
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

        statuses-actions {
          margin-left: 10px;
        }
      `
    ];
  }
}
