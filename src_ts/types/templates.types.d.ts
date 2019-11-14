interface IQuestionTemplate {
  id: number;
  answer_type: QuestionAnswerType;
  choices_size: number | null;
  level: string;
  methods: number[];
  category: number;
  sections: number[];
  text: string;
  is_hact: boolean;
  is_active: boolean;
  is_custom: boolean;
  options: QuestionOption[];
  template: QuestionTemplateItem | null;
}

type QuestionTemplateItem = {
  is_active: boolean;
  specific_details: string;
};
