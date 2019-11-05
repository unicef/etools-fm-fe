interface IListActivity {
  id: number;
  reference_number: string;
  activity_type: UserType;
  tpm_partner: null | number;
  person_responsible: null | {
    id: number;
    name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
  };
  location: ISiteParrentLocation;
  location_site: null | number;
  partners: number[];
  interventions: number[];
  cp_outputs: number[];
  start_date: null | string;
  end_date: null | string;
  checklists_count: number;
  status: string;
  team_members: ActivityTeamMember[];
}

interface IActivityDetails extends IListActivity {
  sections: Section[];
  permissions: ActivityPermissions;
}

type ActivityTeamMember = {
  id: number;
  name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
};

interface IActivityPartner {
  id: number;
  name: string;
}

interface IActivityCPOutput {
  id: number;
  name: string;
}

interface IActivityIntervention {
  id: number;
  title: string;
}

interface IChecklistItem {
  id: number;
  partner: null | IActivityPartner;
  cp_output: null | IActivityCPOutput;
  intervention: null | IActivityIntervention;
  question: IChecklistQuestion;
  specific_details: string;
  is_enabled: boolean;
}

interface IChecklistQuestion {
  id: number;
  answer_type: string;
  choices_size: null | number;
  level: string;
  methods: number[];
  category: number;
  sections: number[];
  text: string;
  is_hact: boolean;
  is_active: boolean;
  is_custom: boolean;
}

interface IChecklistByMethods {
  method: number;
  checklist: GenericObject<IChecklistItem[]>;
}

type ActivityPermissions = {
  edit: ActivityPermissionsObject;
  view: ActivityPermissionsObject;
  required: ActivityPermissionsObject;
};

type ActivityPermissionsObject = {
  location: boolean;
  cp_outputs: boolean;
  field_office: boolean;
  id: boolean;
  activity_type: boolean;
  attachments: boolean;
  end_date: boolean;
  created: boolean;
  status: boolean;
  start_date: boolean;
  person_responsible: boolean;
  tpm_partner: boolean;
  location_site_id: boolean;
  tpm_partner_id: boolean;
  location_site: boolean;
  modified: boolean;
  team_members: boolean;
  location_id: boolean;
  deleted_at: boolean;
  partners: boolean;
  person_responsible_id: boolean;
  checklists: boolean;
  interventions: boolean;
  report_attachments: boolean;
  questions: boolean;
  overall_findings: boolean;
  field_office_id: boolean;
  sections: boolean;
  activity_question_set: boolean;
  started_checklist_set: boolean;
  activity_overall_finding: boolean;
  activity_question_overall_finding: boolean;
  action_points: boolean;
};
