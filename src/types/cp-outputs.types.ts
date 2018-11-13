type CpOutput = {
    id: number;
    name: string;
    fm_config: null | FmConfig;
    interventions: Intervention[];
};

type GovernmentPartner = {
    id: number,
    name: string
};

type CpOutcome = {
    id: number,
    name: string
};

type FmConfig = {
    cp_output: number,
    government_partners: GovernmentPartner[] | []
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
    }
};