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
import {parseRequestErrorsAndShowAsToastMsgs} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-error-parser';
import {loadQuestionsAll, updateQuestionOrders} from '../../../../../redux/effects/questions.effects';
import {DialogStyles} from '../../../../styles/dialog-styles';
import {repeat} from 'lit/directives/repeat.js';
import Sortable from 'sortablejs';

@customElement('question-order-popup')
export class QuestionOrderComponent extends DataMixin()<IQuestion>(LitElement) {
  @property() items: IQuestion[] = [];
  @property() showSpinner = false;
  @property() spinnerText!: string;
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

    this.spinnerText = getTranslation('MAIN.LOADING_DATA_IN_PROCESS');
    this.showSpinner = true;

    store
      .dispatch<AsyncEffect>(loadQuestionsAll())
      .catch(() => fireEvent(this, 'toast', {text: getTranslation('ERROR_LOAD_QUESTIONS')}))
      .then(() => (this.showSpinner = false));

    this.questionsDataUnsubscribe = store.subscribe(
      questionsListDataAll((data: any[] | null) => {
        if (!data) {
          return;
        }
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
    return html`
      ${DialogStyles}
      <etools-dialog
        id="dialog"
        size="md"
        no-padding
        keep-dialog-open
        ?show-spinner="${this.showSpinner}"
        .okBtnText="${translate('MAIN.BUTTONS.SAVE')}"
        .cancelBtnText="${translate('CANCEL')}"
        dialog-title="${translate('EDIT_QUESTIONS_ORDER')}"
        @confirm-btn-clicked="${() => this.save()}"
        spinner-text="${this.spinnerText}"
        @close="${this.onClose}"
      >
        <div class="layout-vertical">
          <ul id="sortable-list">
            ${repeat(
              this.items || [],
              (item) => item.id,
              (item: IQuestion, _index) => html`
                <li class="sortable-item" draggable="true" data-id="${item.id}">${item.text}</li>
              `
            )}
          </ul>
        </div>
      </etools-dialog>
    `;
  }

  setSortable() {
    const el = this.shadowRoot?.querySelector('#sortable-list') as HTMLElement;
    this.sortableEl = Sortable.create(el, {
      sort: true,
      scroll: true,
      draggable: '.sortable-item',
      dataIdAttr: 'data-id',
      animation: 150,
      selectedClass: 'selected',
      ghostClass: 'blue-background-class',
      setData: function (dataTransfer: any, _dragEl: any) {
        dataTransfer.setData('Text', '');
      }
    });
  }

  onClose(confirmed = false): void {
    fireEvent(this, 'dialog-closed', {confirmed: confirmed});
  }

  save(): void {
    this.spinnerText = getTranslation('MAIN.SAVING_DATA_IN_PROCESS');
    this.showSpinner = true;
    const elList = this.shadowRoot?.querySelector('#sortable-list') as HTMLElement;
    const elItems = elList.querySelectorAll('.sortable-item') || [];
    let index = 0;
    const dataToSave: any[] = [];
    elItems.forEach((el: any) => {
      dataToSave.push({id: parseInt(el.dataset.id), order: index++});
    });

    store
      .dispatch<AsyncEffect>(updateQuestionOrders(dataToSave))
      .then((_response: any) => {
        this.showSpinner = false;
        this.onClose(true);
      })
      .catch((err: any) => {
        this.showSpinner = false;
        parseRequestErrorsAndShowAsToastMsgs(err, this);
      });
  }
}
