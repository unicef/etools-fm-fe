type EtoolsCpOutput = {
  id: number;
  name: string;
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
  id: number;
  name: string;
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
  partner: number;
  title: string;
  cp_outputs: number[];
  name: string;
};

type User = {
  id: number;
  name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  user_type: string;
  tpm_partner: null | number;
  is_active?: boolean;
  has_active_realm?: boolean;
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
