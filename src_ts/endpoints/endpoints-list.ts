export const PROFILE_ENDPOINT: 'userProfile' = 'userProfile';
export const CP_OUTCOMES_ENDPOINT: 'cpOutcomes' = 'cpOutcomes';
export const LOCATIONS_ENDPOINT: 'locations' = 'locations';
export const CHANGE_COUNTRY: 'changeCountry' = 'changeCountry';
export const UNICEF_USER: 'unicefUsers' = 'unicefUsers';
export const SITES_EXPORT: 'unicefUsers' = 'unicefUsers';
export const SITES_LIST: 'siteLocations' = 'siteLocations';
export const SITE_DETAILS: 'siteLocationsDetails' = 'siteLocationsDetails';
export const CURRENT_WORKSPACE: 'currentWorkspace' = 'currentWorkspace';
export const QUESTIONS_LIST: 'questionsList' = 'questionsList';
export const QUESTIONS_DETAILS: 'questionsDetails' = 'questionsDetails';
export const CATEGORIES: 'categories' = 'categories';
export const SECTIONS: 'sections' = 'sections';
export const METHODS: 'methods' = 'methods';
export const PARTNERS: 'partners' = 'partners';
export const TPM_PARTNERS: 'tpmPartners' = 'tpmPartners';
export const INTERVENTIONS: 'interventions' = 'interventions';
export const CP_OUTPUTS: 'outputs' = 'outputs';
export const LOG_ISSUES: 'logIssues' = 'logIssues';
export const LOG_ISSUES_DETAILS: 'logIssuesDetails' = 'logIssuesDetails';
export const LOG_ISSUES_ATTACHMENTS: 'logIssuesAttachments' = 'logIssuesAttachments';
export const LOG_ISSUES_ATTACHMENTS_DETAILS: 'logIssuesAttachmentsDetails' = 'logIssuesAttachmentsDetails';
export const QUESTION_TEMPLATES: 'questionTemplates' = 'questionTemplates';
export const QUESTION_TEMPLATES_WITH_TARGET: 'questionTemplatesWithTarget' = 'questionTemplatesWithTarget';
export const RATIONALE: 'rationale' = 'rationale';
export const ACTIVITIES_LIST: 'activities_list' = 'activities_list';
export const RATIONALE_ATTACHMENTS: 'rationale_attachments' = 'rationale_attachments';
export const USERS: 'users' = 'users';
export const TEAM_MEMBERS: 'teamMembers' = 'teamMembers';
export const WIDGET_LOCATIONS: 'widgetLocations' = 'widgetLocations';
export const WIDGET_LOCATION_PATH: 'widgetLocationPath' = 'widgetLocationPath';
export const ACTIVITY_RELATED_DOCUMENTS: 'activityRelatedDocuments' = 'activityRelatedDocuments';
export const ACTIVITY_REPORT_ATTACHMENTS: 'activityReportAttachments' = 'activityReportAttachments';
export const ACTIVITY_CHECKLIST: 'activityChecklist' = 'activityChecklist';
export const ACTIVITY_DETAILS: 'activityDetails' = 'activityDetails';
export const DATA_COLLECTION_CHECKLIST: 'dataCollectionChecklist' = 'dataCollectionChecklist';

export const etoolsEndpoints: IEtoolsEndpoints = {
    [PROFILE_ENDPOINT]: {
        url: '/api/v3/users/profile/'
    },

    [USERS]: {
        url: '/api/v1/field-monitoring/planning/users/?page_size=all',
        exp: 60 * 60 * 1000, // 1 hour
        cacheTableName: 'users'
    },

    [TEAM_MEMBERS]: {
        template: '/api/v1/field-monitoring/planning/users/<%=params%>&page_size=all'
    },

    [CP_OUTCOMES_ENDPOINT]: {
        template: '/api/v1/field-monitoring/settings/results/?result_type=outcome',
        exp: 60 * 60 * 1000, // 1 hour
        cacheTableName: 'cpOutcomes'
    },

    [LOCATIONS_ENDPOINT]: {
        url: '/api/locations-light/',
        exp: 25 * 60 * 60 * 1000, // 25h
        cacheTableName: 'locations'
    },

    [CHANGE_COUNTRY]: {
        url: '/api/v3/users/changecountry/'
    },

    [UNICEF_USER]: {
        url: '/api/v3/users/?verbosity=minimal',
        exp: 60 * 60 * 1000, // 1h
        cachingKey: 'unicefUsers'
    },

    [PARTNERS]: {
        url: '/api/v2/partners/',
        exp: 60 * 60 * 1000, // 1h
        cachingKey: 'partners'
    },

    [TPM_PARTNERS]: {
        url: '/api/tpm/partners/?page_size=all',
        exp: 60 * 60 * 1000, // 1h
        cachingKey: 'tpm_partners'
    },

    [CP_OUTPUTS]: {
        url: '/api/v2/reports/results/?result_type=output',
        exp: 60 * 60 * 1000, // 1h
        cachingKey: 'cpOutputs'
    },

    [INTERVENTIONS]: {
        url: '/api/v2/interventions/',
        exp: 60 * 60 * 1000, // 1h
        cachingKey: 'interventions'
    },

    [SITES_EXPORT]: {
        url: '/api/v1/field-monitoring/settings/sites/export/'
    },

    [SITES_LIST]: {
        url: '/api/v1/field-monitoring/settings/sites/?page_size=all'
    },

    [SITE_DETAILS]: {
        template: '/api/v1/field-monitoring/settings/sites/<%=id%>/'
    },

    [CURRENT_WORKSPACE]: {
        url: '/api/v1/field-monitoring/settings/locations/country/'
    },

    [QUESTIONS_LIST]: {
        url: '/api/v1/field-monitoring/settings/questions/'
    },

    [QUESTIONS_DETAILS]: {
        template: '/api/v1/field-monitoring/settings/questions/<%=id%>/'
    },

    [CATEGORIES]: {
        url: '/api/v1/field-monitoring/settings/categories/?page_size=all',
        exp: 24 * 60 * 60 * 1000, // 1 hour
        cacheTableName: 'cpOutcomes'
    },

    [SECTIONS]: {
        url: '/api/v2/reports/sections/',
        exp: 24 * 60 * 60 * 1000, // 1 hour
        cacheTableName: 'cpOutcomes'
    },

    [METHODS]: {
        url: '/api/v1/field-monitoring/settings/methods/?page_size=all',
        exp: 24 * 60 * 60 * 1000, // 1 hour
        cacheTableName: 'cpOutcomes'
    },

    [QUESTION_TEMPLATES]: {
        template: '/api/v1/field-monitoring/planning/questions/templates/<%=level%>/'
    },

    [QUESTION_TEMPLATES_WITH_TARGET]: {
        template: '/api/v1/field-monitoring/planning/questions/templates/<%=level%>/target/<%=target%>/'
    },

    [RATIONALE]: {
        template: '/api/v1/field-monitoring/planning/year-plan/<%=year%>/'
    },

    [RATIONALE_ATTACHMENTS]: {
        url: '/api/v1/field-monitoring/settings/attachments/'
    },

    [ACTIVITY_RELATED_DOCUMENTS]: {
        template: '/api/v1/field-monitoring/planning/activities/<%=id%>/attachments/'
    },

    [ACTIVITY_REPORT_ATTACHMENTS]: {
        template: '/api/v1/field-monitoring/data-collection/activities/<%=id%>/attachments/'
    },

    [LOG_ISSUES]: {
        url: '/api/v1/field-monitoring/settings/log-issues/'
    },

    [LOG_ISSUES_DETAILS]: {
        template: '/api/v1/field-monitoring/settings/log-issues/<%=id%>/'
    },

    [LOG_ISSUES_ATTACHMENTS]: {
        template: '/api/v1/field-monitoring/settings/log-issues/<%=id%>/attachments/'
    },

    [LOG_ISSUES_ATTACHMENTS_DETAILS]: {
        template: '/api/v1/field-monitoring/settings/log-issues/<%=logIssueId%>/attachments/<%=attachmentId%>/'
    },

    [ACTIVITIES_LIST]: {
        template: '/api/v1/field-monitoring/planning/activities/'
    },

    [WIDGET_LOCATIONS]: {
        url: '/api/v1/field-monitoring/settings/locations/?page_size=all&'
    },

    [WIDGET_LOCATION_PATH]: {
        template: '/api/v1/field-monitoring/settings/locations/<%=id%>/path'
    },

    [ACTIVITY_DETAILS]: {
        template: '/api/v1/field-monitoring/planning/activities/<%=id%>/'
    },

    [ACTIVITY_CHECKLIST]: {
        template: '/api/v1/field-monitoring/data-collection/activities/<%=id%>/questions/'
    },

    [DATA_COLLECTION_CHECKLIST]: {
        template: '/api/v1/field-monitoring/data-collection/activities/<%=activityId%>/checklists/'
    }
    // agreements: {
    //   template: '/api/v2/agreements/',
    //   exp: 30 * 60 * 1000, // 30min
    //   cacheTableName: 'agreements'
    // },
};
