export const endpoints = {
    userProfile: {
        url: '/users/api/profile/'
    },

    // Old endpoints. TODO: remove latter if redundant
    changeCountry: {
        url: '/users/api/changecountry/'
    },
    partnerOrganisations: {
        url: '/api/v2/partners/?hidden=false',
        exp: 2 * 60 * 60 * 1000, // 2h
        cacheTableName: 'partners'
    },
    partnerOrganisationDetails: {
        template: '/api/v2/partners/<%=id%>/'
    },
    interventionDetails: {
        template: '/api/v2/interventions/<%=id%>/'
    },
    interventionsList: {
        template: '/api/v2/interventions/'
    },
    cpOutputsV2: {
        template: '/api/v2/reports/results/?values=<%=ids%>'
    },
    cpOutputsList: {
        template: '/api/v2/reports/results/?verbosity=minimal'
    },
    locations: {
        url: '/api/locations-light/',
        exp: 25 * 60 * 60 * 1000, // 25h
        cacheTableName: 'locations'
    },
    sectionsCovered: {
        url: '/api/reports/sectors/',
        exp: 24 * 60 * 60 * 1000, // 24h
        cacheTableName: 'sections'
    },
    offices: {
        url: '/api/offices/',
        exp: 23 * 60 * 60 * 1000, // 23h
        cacheTableName: 'offices'
    },
    unicefUsers: {
        url: '/api/users/',
        exp: 60 * 60 * 1000, // 1h
        cacheTableName: 'users'
    }
};
