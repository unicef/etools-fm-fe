import {CSSResultArray, customElement, css, html, LitElement, property, TemplateResult} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {CardStyles} from '../../../../styles/card-styles';
import './data-collect-popup';
import {openDialog} from '../../../../utils/dialog';
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
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {activityDetailsData} from '../../../../../redux/selectors/activity-details.selectors';
import {updateAppLocation} from '../../../../../routing/routes';
import {IAsyncAction} from '../../../../../redux/middleware';
import {Unsubscribe} from 'redux';
import {ACTIVITIES_PAGE, DATA_COLLECTION_PAGE} from '../../activities-page';
import {ROOT_PATH} from '../../../../../config/config';
import {COLLECT_TAB, TABS_PROPERTIES} from '../activities-tabs';
import '@unicef-polymer/etools-data-table/etools-data-table.js';
import {classMap} from 'lit-html/directives/class-map';
import {translate} from 'lit-translate';
import {SaveRoute} from '../../../../../redux/actions/app.actions';
import './remove-data-collect-popup';

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
      <!--   Spinner for loading methods   -->
      <etools-loading
        ?active="${this.methodsLoading}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>

      ${repeat(
        this.dataCollectionMethods,
        (method: EtoolsMethod) =>
          html`
            <etools-card class="page-content" card-title="${method.name}" is-collapsible>
              <div slot="actions">
                <paper-icon-button
                  @tap="${() => this.onCreateChecklist(method)}"
                  ?hidden="${this.isReadonly}"
                  icon="icons:add-box"
                  class="panel-button"
                ></paper-icon-button>
              </div>
              <div slot="content" class="layout vertical">
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
      <etools-data-table-header no-title no-collapse>
        <etools-data-table-column class="flex-1" field="text">
          ${translate('ACTIVITY_COLLECT.COLUMNS.TEAM_MEMBER')}
        </etools-data-table-column>

        <etools-data-table-column
          class="${classMap({'flex-1': method.use_information_source, 'flex-2': !method.use_information_source})}"
          field="text"
        >
          ${translate('ACTIVITY_COLLECT.COLUMNS.METHOD_TYPE')}
        </etools-data-table-column>

        ${method.use_information_source
          ? html`
              <etools-data-table-column class="flex-1" field="text">
                ${translate('ACTIVITY_COLLECT.COLUMNS.INFO_SOURCE')}
              </etools-data-table-column>
            `
          : ''}
      </etools-data-table-header>

      ${repeat(
        collect,
        (item: DataCollectionChecklist) => html`
          <etools-data-table-row no-collapse secondary-bg-on-hover>
            <div slot="row-data" class="layout horizontal editable-row flex">
              <!--  Author  -->
              <div class="col-data flex-1 truncate">${item.author.name}</div>

              <!--  Method Name  -->
              <div
                class="col-data truncate ${classMap({
                  'flex-1': method.use_information_source,
                  'flex-2': !method.use_information_source
                })}"
              >
                ${this.getMethodType(item.method)}
              </div>

              <!--  Information Source  -->
              ${method.use_information_source
                ? html` <div class="col-data flex-1 truncate">${item.information_source}</div> `
                : ''}

              <div class="hover-block">
                <a href="${ROOT_PATH}${ACTIVITIES_PAGE}/${this.activityId}/${DATA_COLLECTION_PAGE}/${item.id}/">
                  <iron-icon icon="${this.isReadonly ? 'icons:visibility' : 'icons:create'}"></iron-icon>
                </a>
                <paper-icon-button
                  ?hidden="${this.isReadonly}"
                  icon="icons:delete"
                  @tap="${() => this.openDeletePopup(item.id)}"
                ></paper-icon-button>
              </div>
            </div>
          </etools-data-table-row>
        `
      )}

      <!--  Empty row  -->
      ${!collect.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="layout horizontal editable-row flex">
                <div class="col-data flex-1 truncate">-</div>
                <div class="col-data flex-1 truncate">-</div>
                ${method.use_information_source ? html` <div class="col-data flex-1 truncate">-</div> ` : ''}
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
    this.processCreate(method).then(({payload}: IAsyncAction) => {
      if (payload && payload.id) {
        updateAppLocation(`${ACTIVITIES_PAGE}/${this.activityId}/${DATA_COLLECTION_PAGE}/${payload.id}`);
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
      FlexLayoutClasses,
      css`
        .hover-block a {
          color: var(--secondary-text-color);
        }
      `
    ];
  }
}
