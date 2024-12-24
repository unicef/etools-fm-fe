import {css, LitElement, TemplateResult, CSSResultArray, html, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {store} from '../../../../../redux/store';
import {Unsubscribe} from 'redux';
import {questionsListDataAll} from '../../../../../redux/selectors/questions.selectors';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {DataMixin} from '../../../../common/mixins/data-mixin';
import {translate, get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {loadQuestionsAll, updateQuestionOrders} from '../../../../../redux/effects/questions.effects';
import {DialogStyles} from '../../../../styles/dialog-styles';
import {repeat} from 'lit/directives/repeat.js';
import Sortable from 'sortablejs';
import {times} from 'ramda';

@customElement('question-order-popup')
export class QuestionOrderComponent extends DataMixin()<IQuestion>(LitElement) {
  @property() items: IQuestionOrder[] = [];
  @property() listLoadingInProcess = false;
  @property() draggedItem: HTMLElement | null = null;

  currentOrigIndex: number = 0;
  sortableEl: any;

  private readonly questionsDataUnsubscribe: Unsubscribe;

  static get styles(): CSSResultArray {
    return [
      SharedStyles,
      pageLayoutStyles,
      layoutStyles,
      css`
        .layout-vertical {
          padding-inline-start: 24px;
          padding-inline-end: 24px;
        }
        #sortable-list {
          list-style: none;
          width: 100%;
          padding-inline-end: 0;
          padding-inline-start: 0;
          webkit-user-select: none;
          user-select: none;
        }
        .sortable-item {
          background-color: #f0f0f0;
          margin: 5px 0;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: move;
        }
        .blue-background-class {
          background-color: #c8ebfb;
        }
        .sortable-chosen.sortable-ghost {
          opacity: 0;
        }
        .sortable-drag {
          opacity: 0;
        }
        .sortable-fallback {
          opacity: 1 !important;
        }
      `
    ];
  }

  constructor() {
    super();

    this.listLoadingInProcess = true;

    store
      .dispatch<AsyncEffect>(loadQuestionsAll())
      .catch(() => fireEvent(this, 'toast', {text: getTranslation('ERROR_LOAD_QUESTIONS')}))
      .then(() => (this.listLoadingInProcess = false));

    this.questionsDataUnsubscribe = store.subscribe(
      questionsListDataAll((data: any[] | null) => {
        if (!data) {
          return;
        }
        data.map((x, index) => (x.currentOrder = index));
        this.items = data;
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.questionsDataUnsubscribe();
  }

  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('items')) {
      if (this.items?.length) {
        this.setSortable();
      }
    }
  }

  render(): TemplateResult {
    console.log('render...', Date.now());
    return html`
      ${DialogStyles}
      <etools-dialog
        id="dialog"
        size="md"
        no-padding
        keep-dialog-open
        ?show-spinner="${this.listLoadingInProcess}"
        .okBtnText="${translate('MAIN.BUTTONS.SAVE')}"
        .cancelBtnText="${translate('CANCEL')}"
        dialog-title="${translate('EDIT_QUESTIONS_ORDER')}"
        @confirm-btn-clicked="${() => this.save()}"
        @close="${this.onClose}"
      >
        <div class="layout-vertical">
          <ul id="sortable-list">
            ${repeat(
              this.items || [],
              (item) => item.id,
              (item: IQuestion, _index) => html`
                <li class="sortable-item" draggable="true" data-order="${item.order}" data-id="${item.id}">
                  ${item.text}
                </li>
              `
            )}
          </ul>
        </div>
      </etools-dialog>
    `;
  }

  setSortable() {
    const el = this.shadowRoot?.querySelector('#sortable-list') as HTMLElement;
    const updateItemsOrder = this.updateItemsOrder.bind(this);
    this.sortableEl = Sortable.create(el, {
      sort: true,
      draggable: '.sortable-item',
      dataIdAttr: 'data-id',
      animation: 150,
      selectedClass: 'selected',
      ghostClass: 'blue-background-class',
      setData: function (dataTransfer: any, _dragEl: any) {
        dataTransfer.setData('Text', '');
      },
      onEnd: function (evt: any) {
        updateItemsOrder(evt.oldIndex, evt.newIndex);
      }
    });
  }

  updateItemsOrder(initialIndex: number, currentIndex: number) {
    // update currentOrder of items after drag and drop
    this.items[initialIndex].currentOrder = currentIndex;
    if (initialIndex < currentIndex) {
      for (let i = initialIndex + 1; i < currentIndex; i++) {
        this.items[i].currentOrder--;
      }
    } else if (initialIndex > currentIndex) {
      for (let i = 0; i < initialIndex; i++) {
        this.items[i].currentOrder++;
      }
    }
  }

  onClose(confirmed = false): void {
    fireEvent(this, 'dialog-closed', {confirmed: confirmed});
  }

  save(): void {
    const dataToSave = this.items.map((x) => {
      return {id: x.id, order: x.currentOrder};
    });
    // @dci TODO
    store.dispatch<AsyncEffect>(updateQuestionOrders(dataToSave));
    this.onClose(true);
  }
}
