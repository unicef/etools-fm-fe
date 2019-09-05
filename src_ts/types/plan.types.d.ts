type Author = {
    name: string;
};

type CpOutput = {
    id: number;
    name: string;
    fm_config: null | FmConfig;
    interventions: Intervention[];
};

type Section = {
    id: number;
    name: string;
};

type Partner = {
    id: number;
    name: string;
};

type CpOutcome = {
    id: number;
    name: string;
};

type FmConfig = {
    cp_output: number;
    government_partners: Partner[] | [];
    sections: Section[] | [];
    id: number;
    is_monitored: boolean;
    is_priority: boolean;
};

type Intervention = {
    id: number;
    number: string;
    title: string;
    partner: {
        id: number;
        name: string;
        url: string;
    };
    url: string;
};

type CpOutputConfig = {
    cp_output: {
        activity_focus_code: string;
        activity_focus_name: string;
        code: string;
        country_programme: number;
        created: string;
        expired: boolean;
        from_date: string;
        gic_code: string;
        gic_name: string;
        hidden: boolean;
        humanitarian_tag: boolean;
        id: number;
        interventions: Intervention[];
        level: number;
        lft: number;
        modified: string;
        name: string;
        parent: number;
        ram: boolean;
        result_type: string;
        rght: number;
        sector: null;
        sic_code: string;
        sic_name: string;
        special: boolean;
        to_date: string;
        tree_id: number;
        vision_id: string;
        wbs: string;
    };
    government_partners: Partner[];
    id: number;
    is_monitored: boolean;
    is_priority: boolean;
    partners: Partner[];
    sections: Section[];
};

type FullReportData = {
    id: number;
    name: string;
    code: string;
    partners: FullReportPartner[];
    result_links: FullReportResultLink[];
    ram_indicators: RamIndicator[];
};

type FullReportPartner = {
    id: number;
    name: string;
    prog_visit_mr: string;
    interventions: FullReportIntervention[];
};

type FullReportIntervention = {
    pk: number;
    number: string;
    title: string;
    status: string;
    days_last_visit: string;
};

type FullReportResultLink = {
    id: number;
    intervention: number;
    cp_output: number;
    cp_output_name: string;
    ram_indicators: number[];
    ram_indicator_names: string[];
    ll_results: LowResult[];
};

type LowResult = {
    applied_indicators: [];
    code: string;
    created: string;
    id: number;
    modified: string;
    name: string;
    result_link: number;
};

type RamIndicator = {
    ram_indicators: NestedIndicator[];
    cp_output_name: string;
};

type NestedIndicator = { indicator_name: string };
