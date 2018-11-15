type YearPlan = {
    history: YearPlanHistory[];
    methodology_notes: string;
    modalities: string;
    other_aspects: YearPlanAspects[];
    partner_engagement: string;
    prioritization_criteria: string;
    target_visits: number;
    tasks_by_month: (number | null)[];
    total_planned: {
        cp_outputs: number;
        sites: number;
        tasks: number;
    }
};

type YearPlanHistory = {
    action: string;
    by_user_display: string;
    created: string;
    id: number;
};

type YearPlanAspects = {
    comment: string;
    id: number;
    submit_date: string;
    user: {
        email: string;
        first_name: string;
        id: number;
        last_name: string;
        middle_name: string;
        name: string;
        username: string;
    };
    _delete?: boolean;
};
