interface IQuestion<O = QuestionOption> {
    id: number;
    answer_type: QuestionAnswerType;
    choices_size: number | null;
    level: string;
    options: O[];
    methods: number[];
    category: number;
    sections: number[];
    text: string;
    is_hact: boolean;
    is_active: boolean;
    is_custom: boolean;
}

type IEditedQuestion = Partial<IQuestion<EditedQuestionOption>>;

type QuestionOption = {
    id: number;
    value: string;
    label: string;
    _delete?: true;
};

type EditedQuestionOption = Partial<QuestionOption>;

type QuestionAnswerType = 'likert_scale' | 'bool' | 'number' | 'text';

type AnswerTypeOption = {
    value: QuestionAnswerType;
    display_name: string;
};

type Serialized = {
    id: number | string;
    name: string;
    [key: string]: any;
};
