import {
  CSSResultArray,
  customElement,
  LitElement,
  property,
  PropertyValues,
  queryAll,
  TemplateResult
} from 'lit-element';
import {template} from './question-popup.tpl';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {store} from '../../../../../redux/store';
import {getDifference} from '../../../../utils/objects-diff';
import {addQuestion, updateQuestion} from '../../../../../redux/effects/questions.effects';
import {Unsubscribe} from 'redux';
import {questionUpdate} from '../../../../../redux/selectors/questions.selectors';
import {PaperTextareaElement} from '@polymer/paper-input/paper-textarea';
import {setTextareasMaxHeight} from '../../../../utils/textarea-max-rows-helper';
import {ANSWER_TYPES, BOOLEAN_TYPE, LEVELS, SCALE_TYPE} from '../../../../common/dropdown-options';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../styles/card-styles';
import {QuestionPopupStyles} from './question-popup.styles';
import {DataMixin} from '../../../../common/mixins/data-mixin';
import {applyDropdownTranslation} from '../../../../utils/translation-helper';
import {activeLanguageSelector} from '../../../../../redux/selectors/active-language.selectors';

@customElement('question-popup')
export class QuestionPopupComponent extends DataMixin()<IQuestion>(LitElement) {
  savingInProcess: boolean = false;
  @property() dialogOpened: boolean = true;
  @queryAll('paper-textarea') textareas!: PaperTextareaElement[];

  readonly sections: EtoolsSection[] = store.getState().staticData.sections || [];
  readonly methods: EtoolsMethod[] = store.getState().staticData.methods || [];
  readonly categories: EtoolsCategory[] = store.getState().staticData.categories || [];
  @property() levels: DefaultDropdownOption<string>[] = applyDropdownTranslation(LEVELS);
  @property() answerTypes: AnswerTypeOption[] = applyDropdownTranslation(ANSWER_TYPES);
  readonly scaleSizes: DefaultDropdownOption[] = [
    {value: 3, display_name: '3'},
    {value: 5, display_name: '5'},
    {value: 7, display_name: '7'}
  ];

  @property() editedData: IEditedQuestion = {
    options: [],
    answer_type: ANSWER_TYPES[0].value,
    level: LEVELS[0].value
  };

  private readonly updateQuestionUnsubscribe: Unsubscribe;
  private readonly activeLanguageUnsubscribe: Unsubscribe;

  constructor() {
    super();
    this.updateQuestionUnsubscribe = store.subscribe(
      questionUpdate((updateInProcess: boolean | null) => {
        // set updating state for spinner
        this.savingInProcess = Boolean(updateInProcess);
        if (updateInProcess) {
          return;
        }

        // check errors on update(create) complete
        this.errors = store.getState().questions.error;
        if (this.errors && Object.keys(this.errors).length) {
          return;
        }

        // close popup if update(create) was successful
        this.dialogOpened = false;
        fireEvent(this, 'response', {confirmed: true});
      }, false)
    );

    this.activeLanguageUnsubscribe = store.subscribe(
      activeLanguageSelector(() => {
        this.levels = applyDropdownTranslation(LEVELS);
        this.answerTypes = applyDropdownTranslation(ANSWER_TYPES);
      })
    );
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, QuestionPopupStyles];
  }

  set dialogData(data: IQuestion) {
    if (!data) {
      return;
    }
    this.data = data;
  }

  get currentOptionsLength(): number {
    if (!this.editedData.options) {
      return 0;
    }
    return this.editedData.options.filter((option: EditedQuestionOption) => !option._delete).length;
  }

  render(): TemplateResult {
    return template.call(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.updateQuestionUnsubscribe();
    this.activeLanguageUnsubscribe();
  }

  updateAnswerType(newType: QuestionAnswerType): void {
    const currentType: QuestionAnswerType = this.editedData.answer_type as QuestionAnswerType;
    if (currentType === newType) {
      return;
    }
    this.updateModelValue('answer_type', newType);

    // create initial scale for SCALE_TYPE or BOOLEAN_TYPE, or remove old scale for other types
    this.changeOptionsOnTypeChange(newType);
    this.performUpdate();
  }

  changeOptionsSize(newSize: number): void {
    if (!newSize) {
      return;
    }

    const currentSize: number = this.editedData.options!.length;
    if (newSize === currentSize) {
      return;
    }

    this.editedData.options = new Array(newSize).fill(null).map((_null: null, index: number) => {
      const existedOption: EditedQuestionOption | undefined = this.editedData.options![index];
      return existedOption || {label: '', value: `${index + 1}`};
    });

    this.performUpdate();
  }

  changeOptionLabel(optionIndex: number, value: string): void {
    const option: EditedQuestionOption = this.editedData.options![optionIndex];
    option.label = value;

    if (this.errors && this.errors.scale) {
      this.performUpdate();
    }
  }

  processRequest(): void {
    if (!this.validateScales()) {
      const currentErrors: GenericObject = this.errors || {};
      this.errors = {...currentErrors, scale: 'Option label is required'};
      return;
    }
    this.errors = {};
    const question: IEditedQuestion =
      this.originalData !== null
        ? getDifference<IEditedQuestion>(this.originalData, this.editedData, {
            toRequest: true,
            nestedFields: ['options']
          })
        : this.editedData;
    const isEmpty: boolean = !Object.keys(question).length;

    if (isEmpty) {
      this.dialogOpened = false;
      this.onClose();
    } else if (this.originalData && this.originalData.id) {
      store.dispatch<AsyncEffect>(updateQuestion(this.originalData.id, question));
    } else {
      store.dispatch<AsyncEffect>(addQuestion(question));
    }
  }

  onClose(): void {
    fireEvent(this, 'response', {confirmed: false});
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    setTextareasMaxHeight(this.textareas);
  }

  private changeOptionsOnTypeChange(type: string): void {
    if (this.errors && this.errors.scale) {
      delete this.errors.scale;
    }

    if (type === BOOLEAN_TYPE) {
      this.editedData.options = [
        {label: '', value: 'True'},
        {label: '', value: 'False'}
      ];
    } else if (type === SCALE_TYPE) {
      this.editedData.options = new Array(3)
        .fill(null)
        .map((_null: null, index: number) => ({label: '', value: `${index + 1}`}));
    } else {
      this.editedData.options = [];
    }
  }

  private validateScales(): boolean {
    const currentOptions: EditedQuestionOption[] = this.editedData.options || [];
    return !currentOptions.length || currentOptions.every((option: EditedQuestionOption) => Boolean(option.label));
  }
}
