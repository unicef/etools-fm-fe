import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import '../../../common/layout/page-content-header/page-content-header';
import {SharedStyles} from '../../../styles/shared-styles';
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {buttonsStyles} from '../../../styles/button-styles';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {updateAppLocation} from '../../../../routing/routes';
import {Unsubscribe} from 'redux';
import {loadDataCollectionChecklistInfo} from '../../../../redux/effects/data-collection.effects';
import {dataCollectionChecklistData} from '../../../../redux/selectors/data-collection.selectors';
import {dataCollection} from '../../../../redux/reducers/data-collection.reducer';
import {activityDetails} from '../../../../redux/reducers/activity-details.reducer';
import {activityDetailsData} from '../../../../redux/selectors/activity-details.selectors';
import {requestActivityDetails} from '../../../../redux/effects/activity-details.effects';
import {MethodsMixin} from '../../../common/mixins/methods-mixin';
import {ROOT_PATH} from '../../../../config/config';
import {DETAILS_TAB} from '../activity-item/activities-tabs';

store.addReducers({dataCollection, activityDetails});

const PAGE: string = 'activities';
const SUB_ROUTE: string = 'data-collection';

@customElement('data-collection-checklist')
export class DataCollectionFinding extends MethodsMixin(LitElement) {
  @property() private checklist: DataCollectionChecklist | null = null;
  private activityDetails: IActivityDetails | null = null;

  private routeDetailsUnsubscribe!: Unsubscribe;
  private checklistUnsubscribe!: Unsubscribe;
  private activityDetailsUnsubscribe!: Unsubscribe;
  private activityId: string | null = null;
  private checklistId: string | null = null;

  render(): TemplateResult {
    return html`
      <page-content-header>
        <div slot="page-title">
          <div class="method-name">${this.checklist ? this.getMethodName(this.checklist.method) : ''}</div>
          <div class="title-description">
            <a href="${ROOT_PATH}${PAGE}/${this.activityId}/${DETAILS_TAB}"
              >${(this.activityDetails && this.activityDetails.reference_number) || ''}</a
            >
            | ${this.checklist && this.checklist.id} | ${this.checklist && this.checklist.author.name}
          </div>
        </div>
      </page-content-header>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // On Activity data changes
    this.activityDetailsUnsubscribe = store.subscribe(
      activityDetailsData((data: IActivityDetails | null) => {
        if (!data) {
          return;
        }
        this.activityDetails = data;
        this.loadChecklist();
      }, false)
    );

    // On Checklist data changes
    this.checklistUnsubscribe = store.subscribe(
      dataCollectionChecklistData((data: DataCollectionChecklist | null) => {
        if (!data) {
          return;
        }
        this.checklist = data;
      }, false)
    );

    // On Route changes
    this.routeDetailsUnsubscribe = store.subscribe(
      routeDetailsSelector(({routeName, subRouteName, params}: IRouteDetails) => {
        if (routeName !== PAGE || subRouteName !== SUB_ROUTE) {
          return;
        }
        const activityId: string | null = params && (params.id as string);
        const checklistId: string | null = params && (params.checklist as string);

        if (!activityId || !checklistId) {
          updateAppLocation('page-not-found');
        }

        this.activityId = activityId;
        this.checklistId = checklistId;

        this.loadActivityDetails();
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.routeDetailsUnsubscribe();
    this.checklistUnsubscribe();
    this.activityDetailsUnsubscribe();
  }

  private loadActivityDetails(): void {
    if (this.activityId === null) {
      return;
    }

    const activityDetailsState: IActivityDetailsState = store.getState().activityDetails;
    const loadedActivityId: number | null =
      activityDetailsState && activityDetailsState.data && activityDetailsState.data.id;
    const isNotLoaded: boolean = !loadedActivityId || `${loadedActivityId}` !== `${this.activityId}`;
    if (isNotLoaded) {
      store.dispatch<AsyncEffect>(requestActivityDetails(this.activityId));
    } else {
      this.activityDetails = activityDetailsState.data;
      this.loadChecklist();
    }
  }

  private loadChecklist(): void {
    if (this.activityId === null || this.checklistId === null || this.activityDetails === null) {
      return;
    }

    if (!this.activityDetails.permissions.view.started_checklist_set) {
      updateAppLocation('page-not-found');
      return;
    }

    const dataCollectionState: IDataCollectionState = store.getState().dataCollection;
    const loadedChecklistId: number | null =
      dataCollectionState.checklist.data && dataCollectionState.checklist.data.id;
    const isNotLoaded: boolean = !loadedChecklistId || `${loadedChecklistId}` !== `${this.checklistId}`;

    if (isNotLoaded) {
      store.dispatch<AsyncEffect>(loadDataCollectionChecklistInfo(this.activityId, this.checklistId));
    } else {
      this.checklist = dataCollectionState.checklist.data;
    }
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      SharedStyles,
      pageContentHeaderSlottedStyles,
      pageLayoutStyles,
      buttonsStyles,
      css`
        page-content-header {
          --table-row-height: auto;
          --table-row-margin: 0;
          --title-margin: 18px 0 13px;
        }
        .method-name {
          color: var(--primary-text-color);
          font-weight: normal;
        }
        .title-description {
          font-size: 12px;
          font-weight: normal;
          line-height: 30px;
        }

        .title-description a {
          text-decoration: none;
        }
      `
    ];
  }
}
