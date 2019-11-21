import {CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {MethodsMixin} from '../../../../common/mixins/methods-mixin';
import {repeat} from 'lit-html/directives/repeat';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {addTranslates, ENGLISH, translate} from '../../../../../localization/localisation';
import {ACTIVITY_COLLECT_TRANSLATES} from '../../../../../localization/en/activities-and-data-collection/activity-collect.translates';
import './data-collect-popup';
import {openDialog} from '../../../../utils/dialog';
import {store} from '../../../../../redux/store';
import {
  createCollectionChecklist,
  loadDataCollectionChecklist
} from '../../../../../redux/effects/data-collection.effects';
import {dataCollection} from '../../../../../redux/reducers/data-collection.reducer';
import {dataCollectionList} from '../../../../../redux/selectors/data-collection.selectors';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {activityDetailsData} from '../../../../../redux/selectors/activity-details.selectors';
import {updateAppLocation} from '../../../../../routing/routes';
import {IAsyncAction} from '../../../../../redux/middleware';
import {Unsubscribe} from 'redux';
import {ACTIVITIES_PAGE, DATA_COLLECTION_PAGE} from '../../activities-page';
import {ROOT_PATH} from '../../../../../config/config';

addTranslates(ENGLISH, [ACTIVITY_COLLECT_TRANSLATES]);
store.addReducers({dataCollection});

type DataCollectByMethods = {[key: number]: DataCollectionChecklist[]};

@customElement('data-collect-tab')
export class DataCollectTab extends MethodsMixin(LitElement) {
  @property({type: Number}) activityId!: number;
  @property({type: Object}) checklistByMethods!: DataCollectByMethods;
  @property({type: Boolean}) isReadonly: boolean = false;

  private checklistUnsubscribe!: Unsubscribe;
  private activityUnsubscribe!: Unsubscribe;

  connectedCallback(): void {
    super.connectedCallback();
    this.activityUnsubscribe = store.subscribe(
      activityDetailsData((activityDetails: IActivityDetails | null) => {
        this.isReadonly = activityDetails ? !activityDetails.permissions.edit.checklists : true;
      })
    );

    this.checklistUnsubscribe = store.subscribe(
      dataCollectionList((checklist: DataCollectionChecklist[] | null) => {
        const collect: DataCollectionChecklist[] = checklist || [];
        this.checklistByMethods = collect.reduce((byMethods: DataCollectByMethods, item: DataCollectionChecklist) => {
          const items: DataCollectionChecklist[] = byMethods[item.method] || [];
          byMethods[item.method] = [...items, item];
          return byMethods;
        }, {} as DataCollectByMethods);
      })
    );
    store.dispatch<AsyncEffect>(loadDataCollectionChecklist(this.activityId));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.activityUnsubscribe();
    this.checklistUnsubscribe();
  }

  render(): TemplateResult {
    return html`
      ${repeat(
        this.methods,
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

        <etools-data-table-column class="flex-1" field="text">
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
              <div class="col-data flex-1 truncate">${this.getMethodType(item.method)}</div>

              <!--  Information Source  -->
              ${method.use_information_source
                ? html`
                    <div class="col-data flex-1 truncate">${item.information_source}</div>
                  `
                : ''}

              <!--  Edit button  -->
              ${!this.isReadonly
                ? html`
                    <div class="hover-block">
                      <a href="${ROOT_PATH}${ACTIVITIES_PAGE}/${this.activityId}/${DATA_COLLECTION_PAGE}/${item.id}/">
                        <iron-icon icon="icons:create"></iron-icon>
                      </a>
                    </div>
                  `
                : ''}
            </div>
          </etools-data-table-row>
        `
      )}
    `;
  }

  getMethodType(id: number): string {
    const method: EtoolsMethod | undefined = this.methods.find((item: EtoolsMethod) => item.id === id);
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

  static get styles(): CSSResultArray {
    return [pageLayoutStyles, CardStyles, FlexLayoutClasses];
  }
}
