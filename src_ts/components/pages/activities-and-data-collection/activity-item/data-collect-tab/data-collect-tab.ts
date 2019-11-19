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
  loadDataCollectionChecklist,
  updateCollectionChecklist
} from '../../../../../redux/effects/data-collection.effects';
import {dataCollection} from '../../../../../redux/reducers/data-collection.reducer';
import {dataCollectionList} from '../../../../../redux/selectors/data-collection.selectors';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {hasActivityPermission, Permissions} from '../../../../../config/permissions';
import {activityDetailsData} from '../../../../../redux/selectors/activity-details.selectors';

addTranslates(ENGLISH, [ACTIVITY_COLLECT_TRANSLATES]);
store.addReducers({dataCollection});

type DataCollectByMethods = {[key: number]: DataCollectionChecklist[]};

@customElement('data-collect-tab')
export class DataCollectTab extends MethodsMixin(LitElement) {
  @property({type: Number}) activityId!: number;
  @property({type: Object}) checklistByMethods!: DataCollectByMethods;
  @property({type: Boolean}) hasEditCollect: boolean = false;

  checklistUnsubscribe!: Callback;

  connectedCallback(): void {
    super.connectedCallback();
    store.subscribe(
      activityDetailsData((activityDetails: IActivityDetails | null) => {
        this.hasEditCollect = activityDetails
          ? hasActivityPermission(Permissions.EDIT_COLLECT_TAB, activityDetails)
          : false;
      })
    );
    this.checklistUnsubscribe = store.subscribe(
      dataCollectionList((checklist: DataCollectionChecklist[] | null) => {
        const collect: DataCollectionChecklist[] = checklist || [];
        this.checklistByMethods = collect.reduce(
          (byMethods: DataCollectByMethods, item: DataCollectionChecklist) => {
            const items: DataCollectionChecklist[] = byMethods[item.method] || [];
            byMethods[item.method] = [...items, item];
            return byMethods;
          },
          {} as DataCollectByMethods
        );
      })
    );
    store.dispatch<AsyncEffect>(loadDataCollectionChecklist(this.activityId));
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
                  @tap="${() => this.createChecklist(method)}"
                  icon="icons:add-box"
                  class="panel-button"
                ></paper-icon-button>
              </div>
              <div slot="content" class="layout vertical">
                ${this.renderTable(this.checklistByMethods[method.id])}
              </div>
            </etools-card>
          `
      )}
    `;
  }

  renderTable(collect: DataCollectionChecklist[] = []): TemplateResult {
    return html`
      <etools-data-table-header no-title no-collapse>
        <etools-data-table-column class="flex-1" field="text">
          ${translate('ACTIVITY_COLLECT.COLUMNS.TEAM_MEMBER')}
        </etools-data-table-column>
        <etools-data-table-column class="flex-1" field="text">
          ${translate('ACTIVITY_COLLECT.COLUMNS.METHOD_TYPE')}
        </etools-data-table-column>
        <etools-data-table-column class="flex-1" field="text">
          ${translate('ACTIVITY_COLLECT.COLUMNS.INFO_SOURCE')}
        </etools-data-table-column>
      </etools-data-table-header>
      ${repeat(
        collect,
        (item: DataCollectionChecklist) => html`
          <etools-data-table-row no-collapse secondary-bg-on-hover>
            <div slot="row-data" class="layout horizontal editable-row flex">
              <div class="col-data flex-1 truncate">${item.author.name}</div>
              <div class="col-data flex-1 truncate">${this.getMethodType(item.method)}</div>
              <div class="col-data flex-1 truncate">${item.information_source}</div>
              ${this.hasEditCollect
                ? html`
                    <div class="hover-block">
                      <iron-icon icon="icons:create" @click="${() => this.openUpdateDialog(item)}"></iron-icon>
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

  createChecklist(method: EtoolsMethod): void {
    if (method.use_information_source) {
      this.openCreateDialog(method);
    } else {
      store.dispatch<AsyncEffect>(
        createCollectionChecklist(this.activityId, {
          method: method.id
        })
      );
    }
  }

  openCreateDialog(method: EtoolsMethod): void {
    openDialog<DataCollectionChecklist>({
      dialog: 'data-collect-popup'
    }).then(({response, confirmed}: IDialogResponse<Partial<DataCollectionChecklist>>) => {
      if (confirmed && response) {
        store.dispatch<AsyncEffect>(
          createCollectionChecklist(this.activityId, {
            method: method.id,
            information_source: response.information_source
          })
        );
      }
    });
  }

  openUpdateDialog(checklistItem: DataCollectionChecklist): void {
    openDialog<DataCollectionChecklist>({
      dialog: 'data-collect-popup',
      dialogData: checklistItem
    }).then(({response, confirmed}: IDialogResponse<Partial<DataCollectionChecklist>>) => {
      if (confirmed && response && Object.keys(response).length) {
        store.dispatch<AsyncEffect>(updateCollectionChecklist(this.activityId, checklistItem.id, response));
      }
    });
  }

  static get styles(): CSSResultArray {
    return [pageLayoutStyles, CardStyles, FlexLayoutClasses];
  }
}
