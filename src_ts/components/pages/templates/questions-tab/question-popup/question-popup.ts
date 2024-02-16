import {css, LitElement, TemplateResult, CSSResultArray, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {template} from './question-popup.tpl';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {store} from '../../../../../redux/store';
import {getDifference} from '../../../../utils/objects-diff';
import {addQuestion, updateQuestion} from '../../../../../redux/effects/questions.effects';
import {Unsubscribe} from 'redux';
import {questionUpdate} from '../../../../../redux/selectors/questions.selectors';
import {ANSWER_TYPES, BOOL_TYPE, LEVELS, SCALE_TYPE} from '../../../../common/dropdown-options';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {QuestionPopupStyles} from './question-popup.styles';
import {DataMixin} from '../../../../common/mixins/data-mixin';
import {applyDropdownTranslation} from '../../../../utils/translation-helper';
import {activeLanguageSelector} from '../../../../../redux/selectors/active-language.selectors';
import {getErrorsArray} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-error-parser';
import {validateRequiredFields} from '../../../../utils/validations.helper';
import {get as getTranslation} from 'lit-translate';

@customElement('question-popup')
export class QuestionPopupComponent extends DataMixin()<IQuestion>(LitElement) {
  @property() dialogOpened = true;
  @property() levels: DefaultDropdownOption<string>[] = applyDropdownTranslation(LEVELS);
  @property() answerTypes: AnswerTypeOption[] = applyDropdownTranslation(ANSWER_TYPES);

  @property() editedData: IEditedQuestion = {
    options: [],
    answer_type: ANSWER_TYPES[0].value,
    level: LEVELS[0].value,
    is_active: true
  };
  @property({type: Boolean})
  autovlidateCateg = false;

  @property({type: Boolean})
  autoValidateQuestion = false;

  savingInProcess = false;
  readonly sections: EtoolsSection[] = store.getState().staticData.sections || [];
  readonly methods: EtoolsMethod[] = store.getState().staticData.methods || [];
  readonly categories: EtoolsCategory[] = store.getState().staticData.categories || [];
  readonly scaleSizes: DefaultDropdownOption[] = [
    {value: 3, display_name: '3'},
    {value: 5, display_name: '5'},
    {value: 7, display_name: '7'}
  ];

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
          fireEvent(this, 'toast', {text: getErrorsArray(this.errors).join('\n')});
          return;
        }

        // close popup if update(create) was successful
        this.dialogOpened = false;
        fireEvent(this, 'dialog-closed', {confirmed: true});
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
    return [
      SharedStyles,
      pageLayoutStyles,
      layoutStyles,
      CardStyles,
      QuestionPopupStyles,
      css`
        .question-textarea {
          padding-bottom: 1%;
        }
      `
    ];
  }

  set dialogData(data: IQuestion) {
    if (!data) {
      this.data = {
        methods: [],
        options: [],
        sections: []
      } as any;
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
    this.requestUpdate();
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

    this.requestUpdate();
  }

  changeOptionLabel(optionIndex: number, value: string): void {
    const option: EditedQuestionOption = this.editedData.options![optionIndex];
    option.label = value;

    if (this.errors && this.errors.scale) {
      this.requestUpdate();
    }
  }

  processRequest(): void {
    if (!validateRequiredFields(this)) {
      return;
    }
    const scaleErrors: GenericObject[] | null = this.validateScales();
    if (scaleErrors) {
      const currentErrors: GenericObject = this.errors || {};
      this.errors = {...currentErrors, options: scaleErrors};
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
    const isEmpty = !Object.keys(question).length;

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
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
  }

  private changeOptionsOnTypeChange(type: string): void {
    if (this.errors && this.errors.scale) {
      delete this.errors.scale;
    }

    if (type === BOOL_TYPE) {
      this.editedData.options = [
        {label: '', value: true, translation: getTranslation('TRUE')},
        {label: '', value: false, translation: getTranslation('FALSE')}
      ];
    } else if (type === SCALE_TYPE) {
      this.editedData.options = new Array(3)
        .fill(null)
        .map((_null: null, index: number) => ({label: '', value: `${index + 1}`}));
    } else {
      this.editedData.options = [];
    }
  }

  private validateScales(): GenericObject[] | null {
    const currentOptions: EditedQuestionOption[] = this.editedData.options || [];
    let isValid = true;
    const errors: GenericObject[] = new Array(currentOptions.length);
    currentOptions.forEach((option: EditedQuestionOption, index: number) => {
      if (!option.label) {
        errors[index] = {label: 'Option label is required'};
        isValid = false;
      }
    });
    return isValid ? null : errors;
  }
}
