import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import '../../../common/layout/page-content-header/page-content-header';
import './data-collection-card/data-collection-card';
import {SharedStyles} from '../../../styles/shared-styles';
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {buttonsStyles} from '../../../styles/button-styles';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {updateAppLocation} from '../../../../routing/routes';
import {Unsubscribe} from 'redux';
import {
  loadDataCollectionChecklistInfo,
  loadFindingsAndOverall,
  updateDataCollectionChecklistInformationSource,
  updateFindingsAndOverall
} from '../../../../redux/effects/data-collection.effects';
import {
  dataCollectionChecklistData,
  findingsAndOverallData
} from '../../../../redux/selectors/data-collection.selectors';
import {dataCollection} from '../../../../redux/reducers/data-collection.reducer';
import {activityDetails} from '../../../../redux/reducers/activity-details.reducer';
import {activityDetailsData} from '../../../../redux/selectors/activity-details.selectors';
import {requestActivityDetails} from '../../../../redux/effects/activity-details.effects';
import {MethodsMixin} from '../../../common/mixins/methods-mixin';
import {ROOT_PATH} from '../../../../config/config';
import {COLLECT_TAB, DETAILS_TAB} from '../activity-item/activities-tabs';
import {addTranslates, ENGLISH, translate} from '../../../../localization/localisation';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {DATA_COLLECTION_OVERALL_FINDING} from '../../../../endpoints/endpoints-list';
import {ACTIVITIES_PAGE} from '../activities-page';
import {arrowLeftIcon} from '../../../styles/app-icons';
import {FlexLayoutClasses} from '../../../styles/flex-layout-classes';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-button';
import {elevationStyles} from '../../../styles/elevation-styles';
import {CardStyles} from '../../../styles/card-styles';
import {DATA_COLLECTION_TRANSLATES} from '../../../../localization/en/activities-and-data-collection/data-collection.translates';

addTranslates(ENGLISH, DATA_COLLECTION_TRANSLATES);
store.addReducers({dataCollection, activityDetails});

const PAGE: string = 'activities';
const SUB_ROUTE: string = 'data-collection';

@customElement('data-collection-checklist')
export class DataCollectionChecklistComponent extends MethodsMixin(LitElement) {
  @property() private checklist: DataCollectionChecklist | null = null;
  @property() private findingsAndOverall: GenericObject<SortedFindingsAndOverall> = {};
  @property() private editedData: string = '';
  private originalData: string = '';
  private activityDetails: IActivityDetails | null = null;
  private tabIsReadonly: boolean = true;

  private routeDetailsUnsubscribe!: Unsubscribe;
  private checklistUnsubscribe!: Unsubscribe;
  private activityDetailsUnsubscribe!: Unsubscribe;
  private findingsAndOverallUnsubscribe!: Unsubscribe;
  private activityId: string | null = null;
  private checklistId: string | null = null;

  render(): TemplateResult {
    return html`
      <page-content-header>
        <div slot="page-title">
          <div class="method-name">${this.checklist ? this.getMethodName(this.checklist.method) : ''}</div>

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

      <!--  Information source  -->
      ${this.checkInformationSource()
        ? html`
            <section class="elevation page-content card-container" elevation="1">
              <div class="information-source">
                <paper-input
                  .value="${this.editedData}"
                  @value-changed="${({detail}: CustomEvent) => (this.editedData = detail.value)}"
                  label="${translate('SOURCE_OF_INFORMATION.INPUT_LABEL')}"
                  required
                >
                </paper-input>
                <iron-collapse ?opened="${this.originalData != this.editedData}">
                  <div class="layout horizontal end-justified card-buttons">
                    <paper-button class="save-button" @tap="${() => this.save()}"
                      >${translate('MAIN.BUTTONS.SAVE')}</paper-button
                    >
                  </div>
                </iron-collapse>
              </div>
            </section>
          `
        : ''}
      ${Object.values(this.findingsAndOverall)
        .filter(({findings}: SortedFindingsAndOverall) => Boolean(findings.length))
        .map(({name, findings, overall}: SortedFindingsAndOverall) => {
          return html`
            <data-collection-card
              .tabName="${name}"
              .overallInfo="${overall}"
              .findings="${findings}"
              .attachmentsEndpoint="${this.getAttachmentsEndpoint(overall)}"
              ?readonly="${this.tabIsReadonly}"
              @attachments-updated="${() => this.getOverallInfo()}"
              @update-data="${({detail}: CustomEvent) => this.updateOverallAndFindings(detail)}"
            ></data-collection-card>
          `;
        })}
    `;
  }

  save(): void {
    if (this.activityId === null || this.checklistId === null) {
      return;
    }
    store.dispatch<AsyncEffect>(
      updateDataCollectionChecklistInformationSource(this.activityId, this.checklistId, {
        information_source: this.editedData
      })
    );
    this.originalData = this.editedData;
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
          this.originalData = this.checklist.information_source;
          this.editedData = this.originalData;
        }
      }, false)
    );

    /**
     * Sorts and sets findings and overall data on store.dataCollection.checklist.findingsAndOverall changes
     */
    this.findingsAndOverallUnsubscribe = store.subscribe(
      findingsAndOverallData(({overall, findings}: FindingsAndOverall) => {
        this.findingsAndOverall = this.sortFindingsAndOverall(overall, findings);
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

        this.loadActivityDetails();
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.routeDetailsUnsubscribe();
    this.checklistUnsubscribe();
    this.activityDetailsUnsubscribe();
    this.findingsAndOverallUnsubscribe();
  }

  checkInformationSource(): boolean {
    if (!this.methods) {
      return false;
    }
    const methodData: EtoolsMethod | undefined = this.methods.find((method: EtoolsMethod) =>
      this.checklist ? method.id === this.checklist.method : false
    );
    return methodData ? methodData.use_information_source : false;
  }

  /**
   * Updates Findings on @update-data event from data-collection-card component
   */
  updateOverallAndFindings(requestData: DataCollectionRequestData): void {
    if (this.activityId === null || this.checklistId === null) {
      return;
    }
    store.dispatch<AsyncEffect>(updateFindingsAndOverall(this.activityId, this.checklistId, requestData));
  }

  /**
   * Requests Overall Findings info
   */
  getOverallInfo(): void {
    if (this.activityId === null || this.checklistId === null) {
      return;
    }
    store.dispatch<AsyncEffect>(loadFindingsAndOverall(this.activityId, this.checklistId, 'findings'));
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
    store.dispatch<AsyncEffect>(loadFindingsAndOverall(this.activityId, this.checklistId));

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

  /**
   * combines findings and overall finding in one object by Partner/Cp Output/PD SSFA
   */
  private sortFindingsAndOverall(
    overallData: DataCollectionOverall[] | null,
    findings: DataCollectionFinding[] | null
  ): GenericObject<SortedFindingsAndOverall> {
    if (overallData === null || findings === null) {
      return {};
    }

    const findingsAndOverall: GenericObject<SortedFindingsAndOverall> = overallData.reduce(
      (result: GenericObject<SortedFindingsAndOverall>, overall: DataCollectionOverall) => {
        // generate unique id
        const id: string = this.getDataKey(overall);
        // name exists in findings data, findings will be populated if findings iteration
        result[id] = {name: '', findings: [], overall};
        return result;
      },
      {}
    );

    findings.forEach((finding: DataCollectionFinding) => {
      const id: string = this.getDataKey(finding.activity_question);
      findingsAndOverall[id].name = this.getTargetName(finding.activity_question);
      findingsAndOverall[id].findings.push(finding);
    });

    return findingsAndOverall;
  }

  private getDataKey(dataObject: DataCollectionOverall | IChecklistItem): string {
    if (dataObject.partner) {
      const id: number = typeof dataObject.partner === 'object' ? dataObject.partner.id : dataObject.partner;
      return `partner_${id}`;
    } else if (dataObject.cp_output) {
      const id: number = typeof dataObject.cp_output === 'object' ? dataObject.cp_output.id : dataObject.cp_output;
      return `cp_output_${id}`;
    } else if (dataObject.intervention) {
      const id: number =
        typeof dataObject.intervention === 'object' ? dataObject.intervention.id : dataObject.intervention;
      return `intervention_${id}`;
    } else {
      return '';
    }
  }

  private getTargetName(checklist: IChecklistItem): string {
    if (checklist.partner) {
      return `${translate('LEVELS_OPTIONS.PARTNER')}: ${checklist.partner.name}`;
    } else if (checklist.cp_output) {
      return `${translate('LEVELS_OPTIONS.OUTPUT')}: ${checklist.cp_output.name}`;
    } else if (checklist.intervention) {
      return `${translate('LEVELS_OPTIONS.INTERVENTION')}: ${checklist.intervention.title}`;
    } else {
      return '';
    }
  }

  private getAttachmentsEndpoint(overall: DataCollectionOverall): string | undefined {
    if (!this.activityId || !this.checklistId || !overall) {
      return;
    }
    const url: string = getEndpoint(DATA_COLLECTION_OVERALL_FINDING, {
      activityId: this.activityId,
      checklistId: this.checklistId,
      overallId: overall.id
    }).url;
    return `${url}attachments/`;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      SharedStyles,
      pageContentHeaderSlottedStyles,
      pageLayoutStyles,
      buttonsStyles,
      elevationStyles,
      CardStyles,
      FlexLayoutClasses,
      css`
        .save-button {
          color: var(--primary-background-color);
          background-color: var(--primary-color);
        }
        .information-source {
          padding-left: 2%;
          padding-bottom: 0.5%;
          padding-right: 2%;
        }
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

        data-collection-card {
          display: block;
          margin: 25px 25px 0;
        }

        data-collection-card:last-child {
          margin-bottom: 25px;
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
