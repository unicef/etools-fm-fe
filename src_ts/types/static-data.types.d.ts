type EtoolsCpOutput = {
  id: number;
  name: string;
  result_type: string;
  expired: boolean;
  special: boolean;
  code: string;
  from_date: string;
  to_date: string;
  humanitarian_tag: boolean;
  humanitarian_marker_code: null;
  humanitarian_marker_name: null;
  wbs: string;
  vision_id: string;
  gic_code: string;
  gic_name: string;
  sic_code: string;
  sic_name: string;
  activity_focus_code: string;
  activity_focus_name: string;
  hidden: boolean;
  ram: boolean;
  created: string;
  modified: string;
  lft: number;
  rght: number;
  tree_id: number;
  level: number;
  country_programme: number;
  sector: null;
  parent: number;
};

type EtoolsCpOutcome = {
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
  humanitarian_marker_code: null;
  humanitarian_marker_name: null;
  humanitarian_tag: boolean;
  id: number;
  level: number;
  lft: number;
  modified: string;
  name: string;
  parent: null;
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

type EtoolsPartner = {
  street_address: string;
  last_assessment_date: null;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  id: number;
  vendor_number: string;
  deleted_flag: boolean;
  blocked: boolean;
  name: string;
  short_name: string;
  partner_type: string;
  cso_type: null;
  rating: string;
  shared_with: null;
  email: string;
  phone_number: string;
  total_ct_cp: null;
  total_ct_cy: null;
  net_ct_cy: null;
  reported_cy: null;
  total_ct_ytd: null;
  hidden: boolean;
  basis_for_risk_rating: string;
};

type EtoolsTPMPartner = {
  blocked: boolean;
  vision_synced: boolean;
  street_address: string;
  email: string;
  city: string;
  country: string;
  hidden: boolean;
  name: string;
  vendor_number: string;
  postal_code: string;
  phone_number: string;
  deleted_flag: boolean;
  id: number;
};

type EtoolsIntervention = {
  id: number;
  number: string;
  document_type: string;
  partner_name: string;
  status: string;
  title: string;
  start: string;
  end: string;
  frs_total_frs_amt: null;
  unicef_cash: string;
  cso_contribution: string;
  country_programme: number;
  frs_earliest_start_date: null;
  frs_latest_end_date: null;
  sections: [];
  section_names: [];
  cp_outputs: number[];
  unicef_focal_points: [];
  frs_total_intervention_amt: null;
  frs_total_outstanding_amt: null;
  offices: [];
  actual_amount: null;
  offices_names: [];
  total_unicef_budget: string;
  total_budget: string;
  metadata: {
    migrated: boolean;
    old_status: string;
  };
  flagged_sections: [];
  budget_currency: string;
  fr_currencies_are_consistent: null;
  all_currencies_are_consistent: null;
  fr_currency: string;
  multi_curr_flag: boolean;
  location_p_codes: string[];
  donors: [];
  donor_codes: [];
  grants: [];
};

type User = {
  id: number;
  name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  user_type: string;
  tpm_partner: null | number;
};

type EtoolsLightLocation = {
  id: string;
  name: string;
  p_code: string;
  gateway: {
    id: number;
    created: string;
    modified: string;
    name: string;
    admin_level: null;
  };
};

type EtoolsCpOutputShort = {
  id: number;
  name: string;
};

type EtoolsInterventionShort = {
  id: number;
  title: string;
  partner: number;
  cp_outputs: number[];
};
