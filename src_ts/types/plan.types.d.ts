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

type Office = {
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
  budget_allocation: string;
  code: string;
  humanitarian_marker_code: null;
  humanitarian_marker_name: null;
  name: string;
  partners: FullReportPartner[];
  ram_indicators: RamIndicator[];
};

type FullReportPartner = {
  id: number;
  interventions: FullReportIntervention[];
  name: string;
  prog_visit_mr: string;
};

type FullReportIntervention = {
  days_from_last_pv: string;
  number: string;
  pd_output_names: any[];
  pk: number;
  status: string;
  title: string;
};

type RamIndicator = {
  name: string;
  target: string;
};
