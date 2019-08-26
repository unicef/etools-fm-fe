type Question = {
    id: number;
    answer_type: string;
    choices_size: number | null;
    level: string;
    options: [];
    methods: number[];
    category: number;
    sections: [];
    text: string;
    is_hact: boolean;
    is_active: boolean;
    is_custom: boolean;
};
