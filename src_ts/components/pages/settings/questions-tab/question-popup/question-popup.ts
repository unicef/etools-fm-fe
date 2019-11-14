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
import {clone} from 'ramda';
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

@customElement('question-popup')
export class QuestionPopupComponent extends LitElement {
  savingInProcess: boolean = false;
  @property() dialogOpened: boolean = true;
  @property() errors: GenericObject = {};
  @queryAll('paper-textarea') textareas!: PaperTextareaElement[];

  readonly sections: EtoolsSection[] = store.getState().staticData.sections || [];
  readonly methods: EtoolsMethod[] = store.getState().staticData.methods || [];
  readonly categories: EtoolsCategory[] = store.getState().staticData.categories || [];
  readonly levels: DefaultDropdownOption<string>[] = LEVELS;
  readonly answerTypes: AnswerTypeOption[] = ANSWER_TYPES;
  readonly scaleSizes: DefaultDropdownOption[] = [
    {value: 3, display_name: '3'},
    {value: 5, display_name: '5'},
    {value: 7, display_name: '7'}
  ];

  @property() editedQuestion: IEditedQuestion = {
    options: [],
    answer_type: ANSWER_TYPES[0].value,
    level: LEVELS[0].value
  };

  private originalData: IQuestion | null = null;
  private readonly updateQuestionUnsubscribe: Unsubscribe;

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
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, QuestionPopupStyles];
  }

  set data(data: IQuestion) {
    if (!data) {
      return;
    }
    this.editedQuestion = {...this.editedQuestion, ...data};
    this.originalData = clone(data);
  }

  get currentOptionsLength(): number {
    if (!this.editedQuestion.options) {
      return 0;
    }
    return this.editedQuestion.options.filter((option: EditedQuestionOption) => !option._delete).length;
  }

  render(): TemplateResult {
    return template.call(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.updateQuestionUnsubscribe();
  }

  resetFieldError(fieldName: string): void {
    if (!this.errors) {
      return;
    }
    delete this.errors[fieldName];
    this.performUpdate();
  }

  updateModelValue(fieldName: keyof IQuestion, value: any): void {
    if (!this.editedQuestion) {
      return;
    }
    // sets values from inputs to model, refactor arrays with objects to ids arrays
    this.editedQuestion[fieldName] = !Array.isArray(value) ? value : value.map((item: any) => item.id);
  }

  updateAnswerType(newType: QuestionAnswerType): void {
    const currentType: QuestionAnswerType = this.editedQuestion.answer_type as QuestionAnswerType;
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

    // split options into 2 arrays: options for delete and current options
    const [optionsToRemove, currentOptions]: EditedQuestionOption[][] = this.editedQuestion.options!.reduce(
      ([toRemove, current]: EditedQuestionOption[][], option: EditedQuestionOption) => {
        if (option._delete) {
          return [[...toRemove, option], [...current]];
        } else {
          return [[...toRemove], [...current, option]];
        }
      },
      [[], []]
    );

    const currentSize: number = currentOptions.length;
    if (newSize === currentSize) {
      return;
    }

    const newOptionsSize: number = Math.max(newSize, currentOptions.length);
    this.editedQuestion.options = new Array(newOptionsSize)
      .fill(null)
      .map((_null: null, index: number) => {
        const existedOption: EditedQuestionOption | undefined = currentOptions[index];
        if (index < newSize) {
          // try to take existed option or create empty if newSize is bigger than currentOptions.length
          return existedOption || {label: '', value: `${index + 1}`};
        } else {
          // if new size is shorter than currentOptions.length we need to remove existed options with id
          return existedOption && existedOption.id ? ({...existedOption, _delete: true} as EditedQuestionOption) : null;
        }
      })
      .filter((option: EditedQuestionOption | null) => option !== null)
      .concat(optionsToRemove) as EditedQuestionOption[];

    this.performUpdate();
  }

  changeOptionLabel(optionIndex: number, value: string): void {
    const option: EditedQuestionOption = this.editedQuestion.options![optionIndex];
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
        ? getDifference<IEditedQuestion>(this.originalData, this.editedQuestion, {
            toRequest: true,
            nestedFields: ['options']
          })
        : this.editedQuestion;
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
    const oldOptions: Partial<QuestionOption>[] = (this.originalData && this.originalData.options) || [];
    const refactoredOptions: EditedQuestionOption[] = oldOptions
      .map((option: Partial<QuestionOption>) =>
        option.id ? ({...option, _delete: true} as EditedQuestionOption) : null
      )
      .filter((option: EditedQuestionOption | null) => option !== null) as EditedQuestionOption[];

    if (type === BOOLEAN_TYPE) {
      this.editedQuestion.options = [{label: '', value: 'True'}, {label: '', value: 'False'}, ...refactoredOptions];
    } else if (type === SCALE_TYPE) {
      const newOptions: EditedQuestionOption[] = new Array(3)
        .fill(null)
        .map((_null: null, index: number) => ({label: '', value: `${index + 1}`}));
      this.editedQuestion.options = [...newOptions, ...refactoredOptions];
    } else {
      this.editedQuestion.options = refactoredOptions;
    }
  }

  private validateScales(): boolean {
    const currentOptions: EditedQuestionOption[] = this.editedQuestion.options || [];
    return !currentOptions.length || currentOptions.every((option: EditedQuestionOption) => Boolean(option.label));
  }
}
