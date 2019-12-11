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

//TODO search existent type
type Person = {
  id: number;
  name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  username: string;
  email: string;
};

type ActionPointsOffice = {
  id: number;
  name: string;
};

type ActionPointsSection = {
  id: number;
  name: string;
};

type ActionPointsCategory = {
  id: number;
  module: string;
  description: string;
};

type ActionPointsHistory = {
  id: number;
  action: string;
  by_user_display: string;
  created: string;
};

type ActionPoint = {
  id: number;
  reference_number: string;
  category: number;
  author: Person;
  assigned_by: Person;
  assigned_to: Person;
  high_priority: boolean;
  due_date: string;
  description: string;
  office: ActionPointsOffice;
  section: ActionPointsSection;
  created: number;
  date_of_completion?: number;
  status: string;
  status_date: string;
  partner: IActivityPartner | null;
  intervention: IActivityIntervention | null;
  cp_output: IActivityCPOutput | null;
  history: ActionPointsHistory;
  url: string;
};

type EditableActionPoint = {
  id: number | null;
  category: number | null;
  assigned_to: number | null;
  high_priority: boolean;
  due_date: string | null;
  description: string;
  office: number | null;
  section: number | null;
  partner: number | null;
  intervention: number | null;
  cp_output: number | null;
};

type ActionPointPopupData = {
  action_point: ActionPoint | undefined;
  activity_id: number;
};

type LiteIntervention = {id: number; name: string};
type RelatedToFields = 'partner' | 'cp_output' | 'intervention';
