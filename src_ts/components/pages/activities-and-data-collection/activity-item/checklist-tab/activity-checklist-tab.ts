import {CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {store} from '../../../../../redux/store';
import {activityChecklist} from '../../../../../redux/reducers/activity-checklist.reducer';
import {Unsubscribe} from 'redux';
import {loadActivityChecklist} from '../../../../../redux/effects/activity-checklist.effects';
import {activityChecklistData} from '../../../../../redux/selectors/activity-checklist.selectors';
import './checklist-selection-table/checklist-selection-table';
import {get, translate} from 'lit-translate';
import {activeLanguageSelector} from '../../../../../redux/selectors/active-language.selectors';

store.addReducers({activityChecklist});

@customElement('activity-checklist-tab')
export class ActivityChecklistTab extends LitElement {
  @property({type: Boolean, attribute: 'readonly'}) readonly: boolean = false;
  @property() protected sortedChecklist: GenericObject<IChecklistItem[]> | null = null;
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
                  ([title, checklist]: [string, IChecklistItem[]]) => html`
                    <checklist-selection-table
                      .tableTitle="${title}"
                      .questionsList="${checklist}"
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
        this.sortedChecklist = checklist.reduce((sorted: GenericObject<IChecklistItem[]>, item: IChecklistItem) => {
          let key: string;
          if (item.partner) {
            key = `${get('LEVELS_OPTIONS.PARTNER')}: ${item.partner.name}`;
          } else if (item.cp_output) {
            key = `${get('LEVELS_OPTIONS.OUTPUT')}: ${item.cp_output.name}`;
          } else if (item.intervention) {
            key = `${get('LEVELS_OPTIONS.INTERVENTION')}: ${item.intervention.title}`;
          } else {
            return sorted;
          }

          if (!sorted[key]) {
            sorted[key] = [];
          }
          sorted[key].push(item);
          return sorted;
        }, {});
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
