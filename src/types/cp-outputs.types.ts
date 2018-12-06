type CpOutput = {
    id: number;
    name: string;
    fm_config: null | FmConfig;
    interventions: Intervention[];
};

type Partner = {
    id: number,
    name: string
};

type CpOutcome = {
    id: number,
    name: string
};

type FmConfig = {
    cp_output: number,
    government_partners: Partner[] | []
    id: number,
    is_monitored: boolean,
    is_priority: boolean
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
        interventions: Intervention[]
        level: number;
        lft: number;
        modified: string;
        name: string;
        parent: number;
        ram: boolean;
        result_type: string;
        rght: number;
        sector: null
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
    partners: Partner[]
};
