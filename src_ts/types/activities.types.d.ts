interface IListActivity {
  id: number;
  reference_number: string;
  activity_type: UserType;
  tpm_partner: null | IActivityTpmPartner;
  person_responsible: null | ActivityTeamMember;
  location: ISiteParrentLocation;
  location_site: null | Site;
  partners: IActivityPartner[];
  interventions: IActivityIntervention[];
  cp_outputs: IActivityCPOutput[];
  start_date: null | string;
  end_date: null | string;
  checklists_count: number;
  status: ActivityStatus;
  team_members: ActivityTeamMember[];
}

interface IActivityDetails extends IListActivity {
  sections: Section[];
  permissions: ActivityPermissions;
  transitions: ActivityTransition[];
  reject_reason: string;
  cancel_reason: string;
}

type ActivityStatus =
  | 'draft'
  | 'checklist'
  | 'review'
  | 'assigned'
  | 'data_collection'
  | 'report_finalization'
  | 'submitted'
  | 'completed'
  | 'cancelled';

type ActivityTeamMember = {
  id: number;
  name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
};

interface IActivityTpmPartner {
  email: string;
  id: number;
  name: string;
  phone_number: string;
  vendor_number: string;
}

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
  options: QuestionOption[];
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

type ActivityTransition = {
  transition: string;
  target: ActivityStatus;
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
  cancel_reason: boolean;
  reject_reason: boolean;
};

type ReasonPopupData = {
  popupTitle: string;
  label: string;
};

type ReasonPopupResponse = {
  comment: string;
};

type NoteInfo = {
  titleKey: string;
  text: string;
};
