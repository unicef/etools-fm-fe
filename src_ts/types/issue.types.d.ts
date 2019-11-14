type LogIssue = {
  id?: number;
  related_to_type?: RelatedType;
  partner?: Partner | null;
  cp_output?: CpOutput | null;
  location?: ISiteParrentLocation | null;
  location_site?: Site | null;
  status: IssueStatus;
  issue: string;
  attachments: [];
  author: Author;
  history: LogIssueHistory[];
  closed_by: Author;
};

type LogIssueHistory = {
  by_user_display: string;
  created: number;
};

type UserType = 'staff' | 'tpm';
type RelatedType = 'cp_output' | 'partner' | 'location';
type IssueStatus = 'new' | 'past';
