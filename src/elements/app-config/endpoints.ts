export const endpoints: Endpoints = {
    userProfile: {
        url: '/users/api/profile/'
    },

    methods: {
        url: '/api/field-monitoring/settings/methods/',
        exp: 10 * 24 * 60 * 60 * 1000, // 10days
        cacheTableName: 'methods'
    },

    methodTypes: {
        url: '/api/field-monitoring/settings/methods/types/'
    },

    methodTypeDetails: {
        template: '/api/field-monitoring/settings/methods/types/<%=id%>/'
    },

    cpOutcomes: {
        template: '/api/v2/reports/results/?result_type=outcome',
        exp: 60 * 60 * 1000, // 1 hour
        cacheTableName: 'cpOutcomes'
    },

    cpOutputs: {
        url: '/api/field-monitoring/settings/cp-outputs/'
    },

    cpOutputsConfigs: {
        url: '/api/field-monitoring/settings/cp-outputs/configs/'
    },

    cpOutputDetails: {
        template: '/api/field-monitoring/settings/cp-outputs/<%=id%>/'
    },

    siteLocations: {
        url: '/api/field-monitoring/settings/sites/?page_size=all'
    },

    siteLocationsDetails: {
        template: '/api/field-monitoring/settings/sites/<%=id%>/'
    },

    currentWorkspace: {
        url: '/api/field-monitoring/settings/locations/country/'
    },

    changeCountry: {
        url: '/users/api/changecountry/'
    },

    governmentPartners: {
        url: '/api/v2/partners/?partner_type=Government',
        exp: 2 * 60 * 60 * 1000, // 2h
        cacheTableName: 'governmentPartners'
    },

    locations: {
        url: '/api/locations-light/',
        exp: 25 * 60 * 60 * 1000, // 25h
        cacheTableName: 'locations'
    },

    // Old endpoints. TODO: remove latter if redundant

    interventionDetails: {
        template: '/api/v2/interventions/<%=id%>/'
    },

    interventionsList: {
        template: '/api/v2/interventions/'
    }
};
