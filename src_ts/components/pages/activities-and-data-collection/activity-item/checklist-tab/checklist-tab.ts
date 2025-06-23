import {CSSResult, LitElement, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {store} from '../../../../../redux/store';
import {activityChecklist} from '../../../../../redux/reducers/activity-checklist.reducer';
import {Unsubscribe} from 'redux';
import {loadActivityChecklist} from '../../../../../redux/effects/activity-checklist.effects';
import {activityChecklistData} from '../../../../../redux/selectors/activity-checklist.selectors';
import './checklist-selection-table/checklist-selection-table';
import {get, translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {activeLanguageSelector} from '../../../../../redux/selectors/active-language.selectors';

store.addReducers({activityChecklist});

@customElement('activity-checklist-tab')
export class ActivityChecklistTab extends LitElement {
  @property({type: Boolean, attribute: 'readonly'}) readonly = false;
  @property() protected sortedChecklist: GenericObject<{target_id: number; items: IChecklistItem[]}> | null = null;
  private activityChecklistUnsubscribe!: Unsubscribe;

  private _activityId: number | null = null;
  private activeLanguageUnsubscribe!: Unsubscribe;

  get activityId(): number | null {
    return this._activityId;
  }

  @property({type: Number}) set activityId(id: number | null) {
    if (!id) {
      return;
    }
    this._activityId = id;
    store.dispatch<AsyncEffect>(loadActivityChecklist(id));
  }

  // language=HTML
  render(): TemplateResult {
    return html`
      <!-- Spinner -->
      <etools-loading
        ?active="${!this.sortedChecklist}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>

      ${this.sortedChecklist
        ? html`
            ${Object.keys(this.sortedChecklist).length
              ? Object.entries(this.sortedChecklist).map(
                  ([title, checklist]: [string, {target_id: number; items: IChecklistItem[]}]) => html`
                    <checklist-selection-table
                      .tableTitle="${title}"
                      .targetId="${checklist.target_id}"
                      .questionsList="${checklist.items}"
                      .activityId="${this.activityId}"
                      ?editable="${this.readonly}"
                    >
                    </checklist-selection-table>
                  `
                )
              : html`
                  <section class="elevation page-content" elevation="1">
                    <div>${translate('ACTIVITY_CHECKLIST.NO_QUESTIONS_FOUND')}</div>
                  </section>
                `}
          `
        : ''}
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.activityChecklistUnsubscribe = store.subscribe(
      activityChecklistData((checklist: IChecklistItem[] | null) => {
        if (!checklist) {
          return;
        }
        this.sortedChecklist = checklist.reduce(
          (sorted: GenericObject<{target_id: number; items: IChecklistItem[]}>, item: IChecklistItem) => {
            let key: string;
            let target_id: number;
            if (item.partner) {
              key = `${get('LEVELS_OPTIONS.PARTNER')}: ${item.partner.name}`;
              target_id = item.partner.id;
            } else if (item.cp_output) {
              key = `${get('LEVELS_OPTIONS.OUTPUT')}: ${item.cp_output.name}`;
              target_id = item.cp_output.id;
            } else if (item.intervention) {
              key = `${get('LEVELS_OPTIONS.INTERVENTION')}: ${item.intervention.title}`;
              target_id = item.intervention.id;
            } else {
              return sorted;
            }

            if (!sorted[key]) {
              sorted[key] = {target_id, items: []};
            }
            sorted[key].items.push(item);
            return sorted;
          },
          {}
        );
      }, false)
    );

    this.activeLanguageUnsubscribe = store.subscribe(
      activeLanguageSelector(() => {
        if (this._activityId) {
          store.dispatch<AsyncEffect>(loadActivityChecklist(this._activityId));
        }
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.activityChecklistUnsubscribe();
    this.activeLanguageUnsubscribe();
  }

  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles];
  }
}
