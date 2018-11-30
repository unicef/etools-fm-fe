export const endpoints: Endpoints = {
    userProfile: {
        url: '/users/api/profile/'
    },

    methods: {
        url: '/api/v1/field-monitoring/settings/methods/',
        exp: 10 * 24 * 60 * 60 * 1000, // 10days
        cacheTableName: 'methods'
    },

    methodTypes: {
        url: '/api/v1/field-monitoring/settings/methods/types/'
    },

    methodTypeDetails: {
        template: '/api/v1/field-monitoring/settings/methods/types/<%=id%>/'
    },

    cpOutcomes: {
        template: '/api/v2/reports/results/?result_type=outcome',
        exp: 60 * 60 * 1000, // 1 hour
        cacheTableName: 'cpOutcomes'
    },

    cpOutputs: {
        url: '/api/v1/field-monitoring/settings/cp-outputs/'
    },

    cpOutputsConfigs: {
        url: '/api/v1/field-monitoring/settings/cp-outputs/configs/'
    },

    cpOutputDetails: {
        template: '/api/v1/field-monitoring/settings/cp-outputs/<%=id%>/'
    },

    siteLocations: {
        url: '/api/v1/field-monitoring/settings/sites/?page_size=all'
    },

    siteLocationsDetails: {
        template: '/api/v1/field-monitoring/settings/sites/<%=id%>/'
    },

    currentWorkspace: {
        url: '/api/v1/field-monitoring/settings/locations/country/'
    },

    yearPlan: {
        template: '/api/v1/field-monitoring/planning/year-plan/<%=year%>/'
    },

    logIssues: {
        url: '/api/v1/field-monitoring/settings/log-issues/'
    },

    logIssuesDetails: {
        template: '/api/v1/field-monitoring/settings/log-issues/<%=id%>/'
    },

    logIssuesAttachments: {
        template: '/api/v1/field-monitoring/settings/log-issues/<%=id%>/attachments/'
    },

    logIssuesAttachmentsDetails: {
        template: '/api/v1/field-monitoring/settings/log-issues/<%=logIssueId%>/attachments/<%=attachmentId%>'
    },

    attachments: {
        url: '/api/v1/field-monitoring/settings/attachments/'
    },

    changeCountry: {
        url: '/users/api/changecountry/'
    },

    governmentPartners: {
        url: '/api/v2/partners/?partner_type=Government',
        exp: 2 * 60 * 60 * 1000, // 2h
        cacheTableName: 'governmentPartners'
    },

    monitoredPartners: {
        url: '/api/v1/field-monitoring/settings/cp-outputs/partners/',
        exp: 2 * 60 * 60 * 1000, // 2h
        cacheTableName: 'monitoredPartners'
    },

    monitoredCpOutputs: {
        url: '/api/v1/field-monitoring/settings/cp-outputs/?fm_config__is_monitored=true',
        exp: 2 * 60 * 60 * 1000, // 2h
        cacheTableName: 'monitoredCpOutputs'
    },

    locations: {
        url: '/api/locations-light/',
        exp: 25 * 60 * 60 * 1000, // 25h
        cacheTableName: 'locations'
    },

    planingTasks: {
        template: '/api/v1/field-monitoring/planning/year-plan/<%=year%>/tasks/'
    },

    planingTaskDetails: {
        template: '/api/v1/field-monitoring/planning/year-plan/<%=year%>/tasks/<%=id%>/'
    },

    // Old endpoints. TODO: remove latter if redundant

    interventionDetails: {
        template: '/api/v2/interventions/<%=id%>/'
    },

    interventionsList: {
        template: '/api/v2/interventions/'
    }
};
