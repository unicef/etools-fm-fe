type LogIssue = {
    id?: number;
    related_to_type?: string;
    partner?: Partner;
    cp_output?: CpOutput;
    location?: ISiteParrentLocation;
    location_site?: Site;
    status: string;
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
