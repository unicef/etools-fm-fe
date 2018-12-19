type ChecklistCategory = {
    id: number,
    name: string
};

type ChecklistItem = {
    id: number,
    question_number: string,
    question_text: string,
    category: number
};

type PartnerInfo = {
    id?: number,
    partner?: Partner | number | null,
    specific_details: string,
    standard_url: string
};

type ChecklistPlanedItem = {
    id: number,
    checklist_item: number,
    methods: number[],
    partners_info: PartnerInfo[]
};
