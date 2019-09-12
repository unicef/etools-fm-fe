type LogIssue = {
    id?: number;
    related_to_type?: RelatedType;
    partner?: Partner;
    cp_output?: CpOutput;
    location?: ISiteParrentLocation;
    location_site?: Site;
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

type RelatedType = 'cp_output' | 'partner' | 'location';
type IssueStatus = 'new' | 'past';
