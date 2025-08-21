/* eslint-disable */
interface IQuestion<O = QuestionOption> {
  id: number;
  answer_type: QuestionAnswerType;
  choices_size: number | null;
  level: string;
  options: Partial<QuestionOption>[];
  methods: number[];
  category: number;
  sections: number[];
  text: string;
  is_hact: boolean;
  is_active: boolean;
  is_custom: boolean;
  order: number;
}

type IEditedQuestion = Partial<IQuestion<EditedQuestionOption>>;

type QuestionOption = {
  id: number;
  value: string | boolean;
  label: string;
  _delete?: true;
  translation: string;
};

type EditedQuestionOption = Partial<QuestionOption>;

type QuestionAnswerType =
  | 'multiple_choice'
  | 'likert_scale'
  | 'bool'
  | 'number'
  | 'number-integer'
  | 'number-float'
  | 'text';

type AnswerTypeOption = {
  value: QuestionAnswerType;
  display_name: string | Callback;
};

type Serialized = {
  [key: string]: any;
  id: number | string;
  name: string;
};
