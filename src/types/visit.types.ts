type Visit = {
    end_date: string;
    id: number;
    location: ISiteParrentLocation
    location_site: Site
    primary_field_monitor: PrimaryFieldMonitor;
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

type PrimaryFieldMonitor = {
    id: number;
    name: string;
    last_name: string;
    first_name: string;
    middle_name: string;
};
