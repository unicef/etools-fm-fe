type CpOutput =  {
    id: number,
    name: string
};

type CpOutcome = {
    id: number,
    name: string
};

type SettingsCpOutput = {
    id: number;
    name: string;
    fm_config: null;
    interventions: Intervention[];
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
