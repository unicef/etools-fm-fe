import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import '../../../common/layout/page-content-header/page-content-header';
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {buttonsStyles} from '../../../styles/button-styles';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {updateAppLocation} from '../../../../routing/routes';
import {Unsubscribe} from 'redux';
import {
  loadBlueprint,
  loadDataCollectionChecklistInfo,
  updateBlueprintValue
} from '../../../../redux/effects/data-collection.effects';
import {
  dataCollectionChecklistBlueprint,
  dataCollectionChecklistData
} from '../../../../redux/selectors/data-collection.selectors';
import {dataCollection} from '../../../../redux/reducers/data-collection.reducer';
import {activityDetails} from '../../../../redux/reducers/activity-details.reducer';
import {activityDetailsData} from '../../../../redux/selectors/activity-details.selectors';
import {requestActivityDetails} from '../../../../redux/effects/activity-details.effects';
import {MethodsMixin} from '../../../common/mixins/methods-mixin';
import {ROOT_PATH} from '../../../../config/config';
import {COLLECT_TAB, DETAILS_TAB} from '../activity-item/activities-tabs';
import {ACTIVITIES_PAGE} from '../activities-page';
import {arrowLeftIcon} from '../../../styles/app-icons';
import {FlexLayoutClasses} from '../../../styles/flex-layout-classes';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-button';
import {findingsComponents} from '../../../../redux/reducers/findings-components.reducer';
import {InputStyles} from '../../../styles/input-styles';
import {SharedStyles} from '../../../styles/shared-styles';

store.addReducers({findingsComponents, dataCollection, activityDetails});

const PAGE: string = 'activities';
const SUB_ROUTE: string = 'data-collection';

@customElement('data-collection-checklist')
export class DataCollectionChecklistComponent extends MethodsMixin(LitElement) {
  @property() private checklist: DataCollectionChecklist | null = null;
  @property() private checklistFormJson: ChecklistFormJson | null = null;
  @property() private formErrors: GenericObject = {};
  private activityDetails: IActivityDetails | null = null;
  private tabIsReadonly: boolean = true;

  private routeDetailsUnsubscribe!: Unsubscribe;
  private checklistUnsubscribe!: Unsubscribe;
  private activityDetailsUnsubscribe!: Unsubscribe;
  private blueprintUnsubscribe!: Unsubscribe;
  private activityId: string | null = null;
  private checklistId: string | null = null;

  render(): TemplateResult {
    return html`
      ${InputStyles}
      <page-content-header>
        <div slot="page-title">
          <div class="method-name">${this.checklistFormJson?.blueprint.title}</div>

          <div class="title-description">
            <a href="${ROOT_PATH}${PAGE}/${this.activityId}/${DETAILS_TAB}">
              ${(this.activityDetails && this.activityDetails.reference_number) || ''}
            </a>
            | ${this.checklist && this.checklist.id} | ${this.checklist && this.checklist.author.name}
          </div>
        </div>

        <div slot="title-row-actions">
          <paper-button class="back-button">
            <a href="${ROOT_PATH}${ACTIVITIES_PAGE}/${this.activityId}/${COLLECT_TAB}" class="layout horizontal">
              ${arrowLeftIcon} <span>BACK</span>
            </a>
          </paper-button>
        </div>
      </page-content-header>

      ${this.checklistFormJson
        ? html`
            <form-builder-group
              .groupStructure="${this.checklistFormJson.blueprint.structure}"
              .value="${this.checklistFormJson.value}"
              .metadata="${this.checklistFormJson.blueprint.metadata}"
              .readonly="${this.tabIsReadonly}"
              .errors="${this.formErrors}"
              @value-changed="${(event: CustomEvent) => this.save(event)}"
            ></form-builder-group>
          `
        : ''}
    `;
  }

  save(event: CustomEvent): void {
    if (this.activityId && this.checklistId) {
      store
        .dispatch<AsyncEffect>(updateBlueprintValue(this.activityId, this.checklistId, event.detail.value))
        .catch((error: GenericObject) => (this.formErrors = error.data));
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    /**
     * On Activity data changes.
     * Load checklist data if activity loaded successfully
     */
    this.activityDetailsUnsubscribe = store.subscribe(
      activityDetailsData((data: IActivityDetails | null) => {
        if (data) {
          this.activityDetails = data;
          this.loadChecklist();
        }
      }, false)
    );

    /**
     * Sets checklist data on store.dataCollection.checklist.data changes
     */
    this.checklistUnsubscribe = store.subscribe(
      dataCollectionChecklistData((data: DataCollectionChecklist | null) => {
        if (data) {
          this.checklist = data;
        }
      }, false)
    );

    this.blueprintUnsubscribe = store.subscribe(
      dataCollectionChecklistBlueprint((dataCollectionJson: ChecklistFormJson | null) => {
        console.log('value updated')
        this.checklistFormJson = dataCollectionJson;
      }, false)
    );

    /**
     * On Route changes
     * Load Activity Details if all params are correct
     */
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
        if (this.activityId && this.checklistId) {
          store.dispatch<AsyncEffect>(loadBlueprint(this.activityId, this.checklistId));
        }

        this.loadActivityDetails();
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.routeDetailsUnsubscribe();
    this.checklistUnsubscribe();
    this.activityDetailsUnsubscribe();
    this.blueprintUnsubscribe();
  }

  /**
   * Checks if activity details are loaded already.
   * Loads checklist data if activity data exists or runs ActivityDetails data request
   */
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

  /**
   * Checks permissions, loads Findings And Overall finding data
   * Gets checklist data from store or runs Checklist data request
   */
  private loadChecklist(): void {
    if (this.activityId === null || this.checklistId === null || this.activityDetails === null) {
      return;
    }

    if (!this.activityDetails.permissions.view.started_checklist_set) {
      updateAppLocation('page-not-found');
      return;
    }

    this.tabIsReadonly = !this.activityDetails.permissions.edit.started_checklist_set;

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
      buttonsStyles,
      FlexLayoutClasses,
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

        .back-button {
          height: 36px;
          padding: 0 18px;
          color: white;
          background: var(--green-color);
          font-weight: 500;
        }

        .back-button a {
          color: var(--primary-background-color);
          text-decoration: none;
          line-height: 21px;
        }

        .back-button a span {
          margin-left: 10px;
        }

        .back-button a svg {
          height: 21px;
        }
      `
    ];
  }
}
