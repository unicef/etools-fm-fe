import {css, LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../../../common/layout/page-content-header/page-content-header';
// eslint-disable-next-line
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';

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
import {COLLECT_TAB, DETAILS_TAB, TABS_PROPERTIES} from '../activity-item/activities-tabs';
import {ACTIVITIES_PAGE} from '../activities-page';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import {findingsComponents} from '../../../../redux/reducers/findings-components.reducer';
import {InputStyles} from '../../../styles/input-styles';
import {SharedStyles} from '../../../styles/shared-styles';
import '@unicef-polymer/etools-form-builder';
import {AttachmentsHelper} from '@unicef-polymer/etools-form-builder/dist/form-attachments-popup';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {ATTACHMENTS_STORE} from '../../../../endpoints/endpoints-list';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';
import {FormAbstractGroup} from '@unicef-polymer/etools-form-builder';

store.addReducers({findingsComponents, dataCollection, activityDetails});

const PAGE = 'activities';
const SUB_ROUTE = 'data-collection';

@customElement('data-collection-checklist')
export class DataCollectionChecklistComponent extends MethodsMixin(LitElement) {
  @property() private checklist: DataCollectionChecklist | null = null;
  @property() private checklistFormJson: ChecklistFormJson | null = null;
  @property() private formErrors: GenericObject = {};
  private activityDetails: IActivityDetails | null = null;
  private tabIsReadonly = true;

  private routeDetailsUnsubscribe!: Unsubscribe;
  private checklistUnsubscribe!: Unsubscribe;
  private activityDetailsUnsubscribe!: Unsubscribe;
  private blueprintUnsubscribe!: Unsubscribe;
  private activityId: string | null = null;
  private checklistId: string | null = null;
  private isLoad = true;
  private readonly previousRoute: string | null = store.getState().app.previousRoute;

  render(): TemplateResult {
    return html`
      ${InputStyles}
      <style>
        page-content-header {
          padding: 12px 24px 0 24px;
          min-height: 72px;
        }
      </style>
      <etools-loading
        ?active="${this.isLoad}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <page-content-header>
        <div slot="page-title">
          <div class="method-name">${this.checklistFormJson?.blueprint.title}</div>

          <div class="title-description">
            <a href="${Environment.basePath}${PAGE}/${this.activityId}/${DETAILS_TAB}">
              ${(this.activityDetails && this.activityDetails.reference_number) || ''}
            </a>
            | ${this.checklist && this.checklist.id} | ${this.checklist && this.checklist.author.name}
          </div>
        </div>

        <div slot="title-row-actions">
          <etools-button
            variant="success"
            class="back-button"
            target="_self"
            href="${this.previousRoute ||
            `${Environment.basePath}${ACTIVITIES_PAGE}/${this.activityId}/${COLLECT_TAB}`}"
          >
            <etools-icon name="arrowLeftIcon" slot="prefix"></etools-icon>
            ${translate('MAIN.BACK')}
          </etools-button>
          <etools-button class="neutral" variant="text" @click="${this.browserPrint}">
            <etools-icon name="file-download" slot="prefix"></etools-icon>
            ${translate('MANAGEMENT.EXPORT')}
          </etools-button>
        </div>
      </page-content-header>

      ${this.checklistFormJson
        ? html`
            <form-abstract-group
              .groupStructure="${this.checklistFormJson.blueprint.structure}"
              .value="${this.checklistFormJson.value}"
              .metadata="${this.checklistFormJson.blueprint.metadata}"
              .readonly="${this.tabIsReadonly}"
              .errors="${this.formErrors}"
              @value-changed="${(event: CustomEvent) => this.save(event)}"
            ></form-abstract-group>
          `
        : ''}
    `;
  }

  save(event: CustomEvent): void {
    if (this.activityId && this.checklistId) {
      this.formErrors = {};
      this.checklistFormJson!.value = {...event.detail.value};
      store
        .dispatch<AsyncEffect>(updateBlueprintValue(this.activityId, this.checklistId, event.detail.value))
        .catch((error: GenericObject) => {
          this.formErrors = Object.values(error.data);
        });
    }
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    document.addEventListener('language-changed', this.handleLanguageChange as any);
    const attachmentsEndpoint: string = getEndpoint(ATTACHMENTS_STORE).url;
    AttachmentsHelper.initialize(attachmentsEndpoint);
    window.addEventListener('beforeprint', () => {
      this.tabIsReadonly = true;
      this.requestUpdate();
    });

    window.addEventListener('afterprint', () => {
      this.tabIsReadonly = false;
      this.requestUpdate();
    });
    /**
     * On Activity data changes.
     * Load checklist data if activity loaded successfully
     */
    this.activityDetailsUnsubscribe = store.subscribe(
      activityDetailsData((data: IActivityDetails | null) => {
        if (data) {
          this.activityDetails = data;
          this.loadChecklist();
        } else {
          this.isLoad = false;
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
        this.checklistFormJson = dataCollectionJson;
        this.isLoad = false;
      }, false)
    );

    /**
     * On Route changes
     * Load Activity Details if all params are correct
     */
    this.routeDetailsUnsubscribe = store.subscribe(
      routeDetailsSelector(({routeName, subRouteName, params}: EtoolsRouteDetails) => {
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
    document.removeEventListener('language-changed', this.handleLanguageChange as any);
  }

  handleLanguageChange(_e: CustomEvent) {
    if (this.activityId && this.checklistId) {
      store.dispatch<AsyncEffect>(loadBlueprint(this.activityId, this.checklistId));
    }
  }

  browserPrint(): void {
    this.shadowRoot
      ?.querySelector('form-abstract-group')
      ?.shadowRoot?.querySelectorAll('form-abstract-group')
      .forEach((group) => {
        (group as FormAbstractGroup).collapsed = false;
        this.requestUpdate();
      });

    // this.performUpdate();
    this.updateComplete.then(() => {
      setTimeout(() => {
        print();
      }, 500);
    });
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
    const key: keyof ActivityPermissionsObject = (TABS_PROPERTIES[COLLECT_TAB] ||
      '') as keyof ActivityPermissionsObject;
    if (!this.activityDetails.permissions.view[key]) {
      updateAppLocation('page-not-found');
      return;
    }

    this.tabIsReadonly = !this.activityDetails.permissions.edit[key];

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
      layoutStyles,
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
          font-size: var(--etools-font-size-12, 12px);
          font-weight: normal;
          line-height: 30px;
        }

        .title-description a {
          text-decoration: none;
        }

        @media print {
          .title-description {
            display: none;
          }
        }

        .back-button {
          --dark-secondary-text-color: #ffffff;
        }
        .back-button::part(prefix),
        .back-button::part(suffix) {
          width: 18px;
        }
      `
    ];
  }
}
