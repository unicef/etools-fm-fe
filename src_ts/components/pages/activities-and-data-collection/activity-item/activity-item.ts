import {html, css, LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {updateAppLocation} from '../../../../routing/routes';
import '../../../common/layout/page-content-header/page-content-header';
import '@unicef-polymer/etools-modules-common/dist/layout/etools-tabs';
import '../../../common/layout/status/etools-status';
import './statuses-actions/statuses-actions';
import {RouterStyles} from '../../../app-shell/router-style';
// eslint-disable-next-line
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import './statuses-actions/confirm-duplicate-popup';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {SharedStyles} from '../../../styles/shared-styles';
import {activityDetailsData, activityStatusIsChanging} from '../../../../redux/selectors/activity-details.selectors';
import {activityDetails} from '../../../../redux/reducers/activity-details.reducer';
import {duplicateActivityDetails, requestActivityDetails} from '../../../../redux/effects/activity-details.effects';
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
import {ACTIVITIES_PAGE} from '../activities-and-data-collection-page';
import {translate, get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {SaveRoute} from '../../../../redux/actions/app.actions';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {ActivityDetailsActions, ActivityDetailsCreation} from '../../../../redux/actions/activity-details.actions';
import {currentUser} from '../../../../redux/selectors/user.selectors';
import {loadSummaryFindingsAndOverall} from '../../../../redux/effects/activity-summary-effects';
import {loadActionPoints, loadTPMActionPoints} from '../../../../redux/effects/action-points.effects';
import {hasPermission, Permissions} from '../../../../config/permissions';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';

store.addReducers({activityDetails});

const PAGE = 'activities-and-data-collection';
const SUB_ROUTE = 'activity-item';

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

@customElement('activity-item')
export class NewActivityComponent extends MatomoMixin(LitElement) {
  @property() activityId: string | null = null;
  @property() activityDetails: IActivityDetails | null = null;
  @property() isStatusUpdating = false;
  @property() isSaving = false;
  @property() activeTab!: string;
  @property() childInEditMode = false;
  @property() isUnicefUser = false;

  pageTabs: PageTab[] = [
    {
      tab: DETAILS_TAB,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${DETAILS_TAB}`) as any as string,
      hidden: false
    },
    {
      tab: CHECKLIST_TAB,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${CHECKLIST_TAB}`) as any as string,
      hidden: false
    },
    {
      tab: REVIEW_TAB,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${REVIEW_TAB}`) as any as string,
      hidden: false
    },
    {
      tab: COLLECT_TAB,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${COLLECT_TAB}`) as any as string,
      hidden: false
    },
    {
      tab: SUMMARY_TAB,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${SUMMARY_TAB}`) as any as string,
      hidden: false
    },
    {
      tab: ATTACHMENTS_TAB,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${ATTACHMENTS_TAB}`) as any as string,
      hidden: false
    },
    {
      tab: ADDITIONAL_INFO,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${ADDITIONAL_INFO}`) as any as string,
      hidden: false
    },
    {
      tab: ACTION_POINTS,
      tabLabel: translate(`ACTIVITY_ITEM.TABS.${ACTION_POINTS}`) as any as string,
      hidden: false
    }
  ];
  private isLoadUnsubscribe!: Unsubscribe;
  private activityDetailsUnsubscribe!: Unsubscribe;
  private routeDetailsUnsubscribe!: Unsubscribe;
  private userUnsubscribe!: Unsubscribe;
  private isLoad = false;
  private statuses: IEtoolsStatusModel[] = [
    {status: DRAFT, label: translate(`ACTIVITY_ITEM.STATUSES.${DRAFT}`) as any as string},
    {status: CHECKLIST, label: translate(`ACTIVITY_ITEM.STATUSES.${CHECKLIST}`) as any as string},
    {status: REVIEW, label: translate(`ACTIVITY_ITEM.STATUSES.${REVIEW}`) as any as string},
    {status: ASSIGNED, label: translate(`ACTIVITY_ITEM.STATUSES.${ASSIGNED}`) as any as string},
    {status: DATA_COLLECTION, label: translate(`ACTIVITY_ITEM.STATUSES.${DATA_COLLECTION}`) as any as string},
    {status: REPORT_FINALIZATION, label: translate(`ACTIVITY_ITEM.STATUSES.${REPORT_FINALIZATION}`) as any as string},
    {status: SUBMITTED, label: translate(`ACTIVITY_ITEM.STATUSES.${SUBMITTED}`) as any as string},
    {status: COMPLETED, label: translate(`ACTIVITY_ITEM.STATUSES.${COMPLETED}`) as any as string}
  ];
  private cancelledStatus: IEtoolsStatusModel[] = [
    {
      status: CANCELLED,
      label: translate(`ACTIVITY_ITEM.STATUSES.${CANCELLED}`) as any as string
    }
  ];

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

      <etools-loading
        ?active="${this.isSaving}"
        loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
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
          <sl-dropdown id="pdMenuBtn" ?hidden="${this.hideMoreActionsButton()}">
            <etools-icon-button label="menu" name="more-vert" slot="trigger"> </etools-icon-button>
            <sl-menu>
              <sl-menu-item tracker="Export PDF" ?hidden="${this.hideExportButton()}" @click="${this.export}">
                <etools-icon slot="prefix" name="file-download"></etools-icon>
                ${translate('ACTIVITY_DETAILS.EXPORT')}
              </sl-menu-item>
            </sl-menu>
          </sl-dropdown>

          <etools-button
            variant="text"
            class="neutral"
            tracker="Duplicate Activity"
            ?hidden="${!hasPermission(Permissions.CREATE_VISIT)}"
            @click="${this.onDuplicateClick}"
          >
            <etools-icon slot="prefix" name="content-copy"></etools-icon>${translate('DUPLICATE')}
          </etools-button>

          <statuses-actions
            .activityId="${this.activityDetails && this.activityDetails.id}"
            ?disableBtns="${this.childInEditMode}"
            .possibleTransitions="${(this.activityDetails && this.activityDetails.transitions) || []}"
            ?is-staff="${this.activityDetails && this.activityDetails.monitor_type === STAFF}"
          ></statuses-actions>

          <etools-button
            ?hidden="${this.activityDetails?.status !== DATA_COLLECTION || this.activityDetails.monitor_type !== TPM}"
            variant="neutral"
            target="_blank"
            href="${`/api/v1/field-monitoring/planning/activities/${this.activityDetails?.id}/visit-letter/`}"
          >
            ${translate('ACTIVITY_DETAILS.VISIT_LETTER')}
          </etools-button>
        </div>

        <etools-tabs-lit
          id="tabs"
          slot="tabs"
          .tabs="${this.getTabList()}"
          @sl-tab-show="${({detail}: any) => this.onSelect(detail.name)}"
          .activeTab="${this.activeTab}"
        ></etools-tabs-lit>
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
            // loadSummaryFindingsAndOverall & loadActionPoints here because we need data loaded
            // for Action button click even if user doesn't open the tabs
            store.dispatch<AsyncEffect>(loadSummaryFindingsAndOverall(Number(this.activityId)));

            store.dispatch<AsyncEffect>(loadActionPoints(Number(this.activityId)));
            store.dispatch<AsyncEffect>(loadTPMActionPoints(Number(this.activityId)));

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

  onDuplicateClick(e: Event) {
    this.trackAnalytics(e);
    openDialog({
      dialog: 'confirm-duplicate-popup',
      dialogData: {
        showChecklist: this.activityDetails?.status !== DRAFT
      }
    }).then((response: any) => {
      if (!response.confirmed) {
        return;
      }
      this.createDuplicate(this.activityDetails!.id, response.withChecklist);
    });
  }

  createDuplicate(id: number, withChecklist: boolean) {
    this.isSaving = true;
    store
      .dispatch<AsyncEffect>(duplicateActivityDetails(id, withChecklist))
      .then(({payload}: ActivityDetailsCreation) => {
        if (payload && payload.id) {
          updateAppLocation(`activities/${payload.id}/details/`);
        } else {
          fireEvent(this, 'toast', {
            text: `${getTranslation('ERROR_AT_SAVING_DUPLICATE')}\n ${(payload as any).statusText || ''}`
          });
          console.log((payload as any).statusText);
        }
      })
      .finally(() => (this.isSaving = false));
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
          tabLabel: translate(`ACTIVITY_ITEM.TABS.${DETAILS_TAB}`) as any as string,
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
    return this.activityDetails?.status === CANCELLED ? this.cancelledStatus : this.statuses;
  }

  onSelect(tabName: string): void {
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

  hideMoreActionsButton() {
    if (!this.activityDetails?.id) {
      return true;
    }
    return this.hideExportButton();
  }

  export(e: any): void {
    e.currentTarget.blur();
    this.trackAnalytics(e);
    window.open(`/api/v1/field-monitoring/planning/activities/${this.activityDetails?.id}/pdf/`, '_blank');
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
      if (property === TABS_PROPERTIES[ACTION_POINTS]) {
        return (
          activityDetails.permissions.view[property as keyof ActivityPermissionsObject] ||
          activityDetails.permissions.view['tpm_concerns']
        );
      } else {
        return activityDetails.permissions.view[property as keyof ActivityPermissionsObject];
      }
    } else return property === DETAILS_TAB;
  }

  static get styles(): CSSResultArray {
    return [
      SharedStyles,
      pageContentHeaderSlottedStyles,
      pageLayoutStyles,
      RouterStyles,
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

        @media (max-width: 576px) {
          statuses-actions {
            margin-left: 0px;
          }
        }
      `
    ];
  }
}
