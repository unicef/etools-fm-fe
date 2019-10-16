interface IListActivity {
    id: number;
    reference_number: string;
    activity_type: string;
    tpm_partner: null | number;
    person_responsible: null | number;
    location: ISiteParrentLocation;
    location_site: null | number;
    partners: number[];
    interventions: number[];
    cp_outputs: number[];
    start_date: null | string;
    end_date: null | string;
    checklists_count: number;
    status: string;
    team_members: ActivityTeamMember[];
}

type ActivityTeamMember = {
    id: number;
    name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
};

interface IActivityPartner {
    id: number;
    name: string;
}

interface IActivityCPOutput {
    id: number;
    name: string;
}

interface IActivityIntervention {
    id: number;
    title: string;
}

interface IChecklistItem {
    id: number;
    partner: null | IActivityPartner;
    cp_output: null | IActivityCPOutput;
    intervention: null | IActivityIntervention;
    question: IChecklistQuestion;
    specific_details: string;
    is_enabled: boolean;
}

interface IChecklistQuestion {
    id: number;
    answer_type: string;
    choices_size: null | number;
    level: string;
    methods: number[];
    category: number;
    sections: number[];
    text: string;
    is_hact: boolean;
    is_active: boolean;
    is_custom: boolean;
}

interface IChecklistItemByTarget {
    id: number;
    name: string;
    type: 'partner' | 'intervention' | 'output';
    items: IChecklistItem[];
}
