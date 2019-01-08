// tslint:disable-next-line
interface PlaningTask {
    cp_output_config: CpOutputConfig;
    id: number;
    intervention: Intervention;
    location: Location;
    location_site: Site;
    partner: Partner;
    plan_by_month: number[];
}
