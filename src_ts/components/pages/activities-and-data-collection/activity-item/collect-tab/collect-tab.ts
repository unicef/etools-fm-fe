import {css, LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {CardStyles} from '../../../../styles/card-styles';
import './collect-popup';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import {store} from '../../../../../redux/store';
import {
  createCollectionChecklist,
  loadDataCollectionChecklist,
  loadDataCollectionMethods
} from '../../../../../redux/effects/data-collection.effects';
import {dataCollection} from '../../../../../redux/reducers/data-collection.reducer';
import {
  dataCollectionList,
  dataCollectionLoading,
  dataCollectionMethods
} from '../../../../../redux/selectors/data-collection.selectors';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {activityDetailsData} from '../../../../../redux/selectors/activity-details.selectors';
import {updateAppLocation} from '../../../../../routing/routes';
import {IAsyncAction} from '../../../../../redux/middleware';
import {Unsubscribe} from 'redux';
import {COLLECT_TAB, TABS_PROPERTIES} from '../activities-tabs';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {SaveRoute} from '../../../../../redux/actions/app.actions';
import './remove-collect-popup';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query.js';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';
import {FormBuilderCardStyles} from '@unicef-polymer/etools-form-builder/dist/lib/styles/form-builder-card.styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';

store.addReducers({dataCollection});

type DataCollectByMethods = {[key: number]: DataCollectionChecklist[]};
@customElement('data-collect-tab')
export class DataCollectTab extends LitElement {
  @property({type: Number, attribute: 'activity-id', reflect: true}) activityId!: number;

  @property({type: Object}) protected checklistByMethods: DataCollectByMethods = {};
  @property({type: Boolean}) protected isReadonly = false;
  @property() protected dataCollectionMethods: EtoolsMethod[] = [];
  @property() protected methodsLoading = false;
  @property() protected dataLoading = true;
  @property() protected createInProgress = false;
  @property({type: Boolean})
  lowResolutionLayout = false;

  private checklistUnsubscribe!: Unsubscribe;
  private activityUnsubscribe!: Unsubscribe;
  private methodsUnsubscribe!: Unsubscribe;
  private methodsLoadingUnsubscribe!: Unsubscribe;

  connectedCallback(): void {
    super.connectedCallback();
    store.dispatch(new SaveRoute(null));
    // Check permissions
    this.activityUnsubscribe = store.subscribe(
      activityDetailsData((activityDetails: IActivityDetails | null) => {
        const property: keyof ActivityPermissionsObject = TABS_PROPERTIES[
          COLLECT_TAB
        ] as keyof ActivityPermissionsObject;
        this.isReadonly = activityDetails ? !activityDetails.permissions.edit[property] : true;
      })
    );

    // Subscribe on data collection data
    this.checklistUnsubscribe = store.subscribe(
      dataCollectionList((checklist: DataCollectionChecklist[] | null) => {
        this.dataLoading = false;
        const collect: DataCollectionChecklist[] = checklist || [];
        this.checklistByMethods = collect.reduce((byMethods: DataCollectByMethods, item: DataCollectionChecklist) => {
          const items: DataCollectionChecklist[] = byMethods[item.method] || [];
          byMethods[item.method] = [...items, item];
          return byMethods;
        }, {} as DataCollectByMethods);
      }, false)
    );
    store.dispatch<AsyncEffect>(loadDataCollectionChecklist(this.activityId));

    // Load data collection methods or get them from store
    const dataCollectionMethodsState: null | IDataCollectionMethods =
      store.getState().dataCollection.dataCollectionMethods;
    if (dataCollectionMethodsState && dataCollectionMethodsState.forActivity === this.activityId) {
      this.dataCollectionMethods = dataCollectionMethodsState.methods;
    } else {
      store.dispatch<AsyncEffect>(loadDataCollectionMethods(this.activityId));
    }

    this.methodsUnsubscribe = store.subscribe(
      dataCollectionMethods((methodsState: null | IDataCollectionMethods) => {
        if (methodsState) {
          this.dataCollectionMethods = methodsState.methods;
        }
      })
    );

    // Subscribe on loading
    this.methodsLoadingUnsubscribe = store.subscribe(
      dataCollectionLoading(
        (methodsLoading: boolean | undefined) => {
          this.methodsLoading = Boolean(methodsLoading);
        },
        ['dataCollectionMethods']
      )
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.activityUnsubscribe();
    this.checklistUnsubscribe();
    this.methodsUnsubscribe();
    this.methodsLoadingUnsubscribe();
  }

  render(): TemplateResult {
    return html`
      <style>
        ${FormBuilderCardStyles}
        ${dataTableStylesLit}
      </style>
      <!--   Spinner for loading methods   -->
      <etools-loading
        ?active="${this.methodsLoading}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <etools-media-query
        query="(max-width: 767px)"
        @query-matches-changed="${(e: CustomEvent) => {
          this.lowResolutionLayout = e.detail.value;
        }}"
      ></etools-media-query>

      ${repeat(
        this.dataCollectionMethods,
        (method: EtoolsMethod) => html`
          <etools-card class="page-content" card-title="${method.name}" is-collapsible>
            <div slot="actions">
              <etools-icon-button
                @click="${() => this.onCreateChecklist(method)}"
                ?disabled="${this.createInProgress}"
                ?hidden="${this.isReadonly}"
                name="add-box"
                class="panel-button"
              ></etools-icon-button>
            </div>
            <div slot="content" class="layout-vertical">
              <!--   Spinner for loading data   -->
              <etools-loading
                ?active="${this.dataLoading}"
                loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
              ></etools-loading>

              ${this.renderTable(this.checklistByMethods[method.id], method)}
            </div>
          </etools-card>
        `
      )}
    `;
  }

  renderTable(collect: DataCollectionChecklist[] = [], method: EtoolsMethod): TemplateResult {
    return html`
      <etools-data-table-header no-title no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
        <etools-data-table-column class="col-data col-md-4" field="text">
          ${translate('ACTIVITY_COLLECT.COLUMNS.TEAM_MEMBER')}
        </etools-data-table-column>

        <etools-data-table-column class="col-data col-md-4" field="text">
          ${translate('ACTIVITY_COLLECT.COLUMNS.METHOD_TYPE')}
        </etools-data-table-column>

        <etools-data-table-column class="col-data col-md-4" field="text">
          ${method.use_information_source ? translate('ACTIVITY_COLLECT.COLUMNS.INFO_SOURCE') : ''}
        </etools-data-table-column>
      </etools-data-table-header>

      ${repeat(
        collect,
        (item: DataCollectionChecklist) => html`
          <etools-data-table-row no-collapse secondary-bg-on-hover .lowResolutionLayout="${this.lowResolutionLayout}">
            <div slot="row-data" class="editable-row">
              <!--  Author  -->
              <div
                class="col-data col-md-4 truncate"
                data-col-header-label="${translate('ACTIVITY_COLLECT.COLUMNS.METHOD_TYPE')}"
              >
                ${item.author.name}
              </div>

              <!--  Method Name  -->
              <div
                class="col-data truncate col-md-4"
                data-col-header-label="${translate('ACTIVITY_COLLECT.COLUMNS.TEAM_MEMBER')}"
              >
                ${this.getMethodType(item.method)}
              </div>

              <!--  Information Source  -->
              ${method.use_information_source
                ? html`
                    <div
                      class="col-data col-md-4 truncate"
                      data-col-header-label="${translate('ACTIVITY_COLLECT.COLUMNS.INFO_SOURCE')}"
                    >
                      ${item.information_source}
                    </div>
                  `
                : ''}

              <div class="hover-block">
                <a href="${Environment.basePath}activities/${this.activityId}/${DATA_COLLECTION_PAGE}/${item.id}/">
                  <etools-icon name="${this.isReadonly ? 'visibility' : 'create'}"></etools-icon>
                </a>
                <etools-icon-button
                  ?hidden="${this.isReadonly}"
                  name="delete"
                  @click="${() => this.openDeletePopup(item.id)}"
                ></etools-icon-button>
              </div>
            </div>
          </etools-data-table-row>
        `
      )}

      <!--  Empty row  -->
      ${!collect.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="editable-row">
                <div class="col-data col-12 no-data">No records found.</div>
              </div>
            </etools-data-table-row>
          `
        : ''}
    `;
  }

  getMethodType(id: number): string {
    const method: EtoolsMethod | undefined = this.dataCollectionMethods.find((item: EtoolsMethod) => item.id === id);
    return method ? method.name : '';
  }

  onCreateChecklist(method: EtoolsMethod): void {
    if (this.createInProgress) {
      return;
    }
    this.createInProgress = true;
    this.processCreate(method).then(({payload}: IAsyncAction) => {
      this.createInProgress = false;
      if (payload && payload.id) {
        updateAppLocation(`activities/${this.activityId}/${DATA_COLLECTION_PAGE}/${payload.id}`);
      }
    });
  }

  processCreate(method: EtoolsMethod): Promise<IAsyncAction> {
    if (method.use_information_source) {
      return this.openCreateDialog(method);
    } else {
      return store.dispatch<AsyncEffect>(
        createCollectionChecklist(this.activityId, {
          method: method.id
        })
      );
    }
  }

  openCreateDialog(method: EtoolsMethod): Promise<IAsyncAction> {
    return openDialog<DataCollectionChecklist>({
      dialog: 'data-collect-popup'
    }).then(({response, confirmed}: IDialogResponse<Partial<DataCollectionChecklist>>) => {
      if (!confirmed) {
        return false;
      }
      if (confirmed && response) {
        return store.dispatch<AsyncEffect>(
          createCollectionChecklist(this.activityId, {
            method: method.id,
            information_source: response.information_source
          })
        );
      }
    });
  }

  openDeletePopup(id: number): void {
    openDialog<DataCollectionItemRemoval>({
      dialog: 'remove-data-collect-popup',
      dialogData: {activityId: this.activityId, checklistId: id, dialogOpened: true}
    }).then(({confirmed}: IDialogResponse<any>) => {
      if (!confirmed) {
        return;
      }
    });
  }

  static get styles(): CSSResultArray {
    return [
      pageLayoutStyles,
      CardStyles,
      layoutStyles,
      SharedStyles,
      css`
        .hover-block a {
          color: var(--secondary-text-color);
          text-decoration: none;
        }
      `
    ];
  }
}
