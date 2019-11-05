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
import {addTranslates, ENGLISH, translate} from '../../../../../localization/localisation';
import {ACTIVITY_CHECKLIST_TRANSLATES} from '../../../../../localization/en/activities-and-data-collection/activity-checklist.translates';

addTranslates(ENGLISH, ACTIVITY_CHECKLIST_TRANSLATES);
store.addReducers({activityChecklist});

@customElement('activity-checklist-tab')
export class ActivityChecklistTab extends LitElement {
  @property() protected sortedChecklist: GenericObject<IChecklistItem[]> = {};
  private activityChecklistUnsubscribe!: Unsubscribe;

  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles];
  }

  private _activityId: number | null = null;

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
      ${Object.entries(this.sortedChecklist).map(
        ([title, checklist]: [string, IChecklistItem[]]) => html`
          <checklist-selection-table
            .tableTitle="${title}"
            .questionsList="${checklist}"
            .activityId="${this.activityId}"
          >
          </checklist-selection-table>
        `
      )}
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
            key = `${translate('LEVELS_OPTIONS.PARTNER')}: ${item.partner.name}`;
          } else if (item.cp_output) {
            key = `${translate('LEVELS_OPTIONS.OUTPUT')}: ${item.cp_output.name}`;
          } else if (item.intervention) {
            key = `${translate('LEVELS_OPTIONS.INTERVENTION')}: ${item.intervention.title}`;
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
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.activityChecklistUnsubscribe();
  }
}
