type Question = {
    id: number;
    answer_type: QuestionAnswerType;
    choices_size: number | null;
    level: string;
    options: QuestionOption[];
    methods: number[];
    category: number;
    sections: number[];
    text: string;
    is_hact: boolean;
    is_active: boolean;
    is_custom: boolean;
};

type QuestionOption = {
    id: number;
    value: string;
    label: string;
};

type QuestionAnswerType = 'likert_scale' | 'bool' | 'number' | 'text';

type AnswerTypeOption = {
    value: QuestionAnswerType;
    display_name: string;
};
