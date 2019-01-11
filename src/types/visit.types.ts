type Visit = {
    end_date: string;
    id: number;
    location: ISiteParrentLocation
    location_site: Site
    primary_field_monitor: IPrimaryFieldMonitor;
    reference_number: string;
    start_date: string;
    status: string;
    tasks: IVisitTask[]
    team_members: {}
    visit_type: string;
};

interface IVisitTask extends PlaningTask {
    completed_by_month: number[];
}

interface IPrimaryFieldMonitor {
    id: number;
    name: string;
    last_name: string;
    first_name: string;
    middle_name: string;
}

type TeamMember = IPrimaryFieldMonitor;

type VisitsTotalPlanned = {
    outputs: number;
    sites: number;
    visits: number;
};

type PlannedTotal = {
    cp_outputs: number;
    sites: number;
    tasks: number;
};
