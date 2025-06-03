import {LitElement, TemplateResult, html, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {store} from '../../../../../redux/store';
import {activityChecklist} from '../../../../../redux/reducers/activity-checklist.reducer';
import {Unsubscribe} from 'redux';
import {loadActivityChecklist} from '../../../../../redux/effects/activity-checklist.effects';
import {activityChecklistData} from '../../../../../redux/selectors/activity-checklist.selectors';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../../styles/card-styles';
import './review-checklist-item/review-checklist-item';
import {loadStaticData} from '../../../../../redux/effects/load-static-data.effect';
import {get} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {activeLanguageSelector} from '../../../../../redux/selectors/active-language.selectors';
import {CommentElementMeta, CommentsMixin} from '../../../../common/comments/comments-mixin';

store.addReducers({activityChecklist});

@customElement('activity-review-tab')
export class ActivityReviewTab extends CommentsMixin(LitElement) {
  @property() methods: GenericObject<string> = {};
  @property() protected sortedChecklists: IChecklistByMethods[] = [];
  private activityChecklistUnsubscribe!: Unsubscribe;
  private activeLanguageUnsubscribe!: Unsubscribe;

  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles, layoutStyles, CardStyles];
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
    store.dispatch<AsyncEffect>(loadActivityChecklist(id, true));
  }

  // language=HTML
  render(): TemplateResult {
    return html`
      ${this.sortedChecklists.map(
        (sortedChecklist: IChecklistByMethods) => html`
          <section class="elevation page-content card-container question-table-section" elevation="1">
            <div class="card-title-box with-bottom-line">
              <div class="card-title">${this.methods[sortedChecklist.method]}</div>
            </div>

            ${Object.entries(sortedChecklist.checklist).map(
              ([targetTitle, checklist]: [string, {targetId: number; items: IChecklistItem[]}]) => html`
                <review-checklist-item
                  related-to="review-${sortedChecklist.method}-${checklist.targetId}"
                  related-to-description="${this.methods[sortedChecklist.method]} - ${targetTitle}"
                  comments-container
                  .itemTitle="${targetTitle}"
                  .checklist="${checklist.items}"
                ></review-checklist-item>
              `
            )}
          </section>
        `
      )}
    `;
  }

  getSpecialElements(container: HTMLElement): CommentElementMeta[] {
    const element: HTMLElement = container.shadowRoot!.querySelector('.table-container') as HTMLElement;
    const relatedTo: string = container.getAttribute('related-to') as string;
    const relatedToDescription = container.getAttribute('related-to-description') as string;
    return [{element, relatedTo, relatedToDescription}];
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.activityChecklistUnsubscribe = store.subscribe(
      activityChecklistData((checklist: IChecklistItem[] | null) => {
        if (!checklist) {
          return;
        }

        const sortedByMethods: GenericObject<IChecklistItem[]> = this.sortByMethods(checklist);
        this.sortedChecklists = Object.entries(sortedByMethods).map(
          ([methodId, checklistItems]: [string, IChecklistItem[]]) => {
            return {
              method: Number(methodId),
              checklist: this.sortByTarget(checklistItems)
            };
          }
        );
      }, false)
    );

    const data: EtoolsMethod[] = store.getState().staticData.methods;
    if (data) {
      this.methods = this.createMethodsLib(data);
    } else {
      store
        .dispatch<AsyncEffect>(loadStaticData('methods'))
        .then((fetchedData: any) => (this.methods = this.createMethodsLib(fetchedData)));
    }

    this.activeLanguageUnsubscribe = store.subscribe(
      activeLanguageSelector(() => store.dispatch<AsyncEffect>(loadActivityChecklist(this._activityId as number, true)))
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.activityChecklistUnsubscribe();
    this.activeLanguageUnsubscribe();
  }

  private sortByMethods(checklist: IChecklistItem[]): GenericObject<IChecklistItem[]> {
    return checklist.reduce((sorted: GenericObject<IChecklistItem[]>, item: IChecklistItem) => {
      item.question.methods.forEach((method: number) => {
        if (!sorted[method]) {
          sorted[method] = [];
        }
        sorted[method].push(item);
      });

      return sorted;
    }, {});
  }

  private sortByTarget(checklist: IChecklistItem[]): GenericObject<{targetId: number; items: IChecklistItem[]}> {
    return checklist.reduce(
      (sorted: GenericObject<{targetId: number; items: IChecklistItem[]}>, item: IChecklistItem) => {
        let key: string;
        let targetId: number;
        if (item.partner) {
          key = `${get('LEVELS_OPTIONS.PARTNER')}: ${item.partner.name}`;
          targetId = item.partner.id;
        } else if (item.cp_output) {
          key = `${get('LEVELS_OPTIONS.OUTPUT')}: ${item.cp_output.name}`;
          targetId = item.cp_output.id;
        } else if (item.intervention) {
          key = `${get('LEVELS_OPTIONS.INTERVENTION')}: ${item.intervention.title}`;
          targetId = item.intervention.id;
        } else {
          return sorted;
        }

        if (!sorted[key]) {
          sorted[key] = {targetId, items: []};
        }
        sorted[key].items.push(item);
        return sorted;
      },
      {}
    );
  }

  private createMethodsLib(methods: EtoolsMethod[]): GenericObject<string> {
    return methods.reduce((lib: GenericObject<string>, method: EtoolsMethod) => {
      lib[method.id] = method.name;
      return lib;
    }, {});
  }
}
