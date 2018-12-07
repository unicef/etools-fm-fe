type LogIssue = {
    id?: number,
    related_to_type?: string,
    partner?: Partner | null,
    cp_output?: CpOutput | null,
    location?: ISiteParrentLocation | null,
    location_site?: Site | null,
    status: string,
    attachments: []
};
