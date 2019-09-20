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
