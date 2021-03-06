export const PROFILE_ENDPOINT: 'userProfile' = 'userProfile';
export const CP_OUTCOMES: 'cpOutcomes' = 'cpOutcomes';
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
export const QUESTION_TEMPLATES: 'questionTemplates' = 'questionTemplates';
export const QUESTION_TEMPLATES_WITH_TARGET: 'questionTemplatesWithTarget' = 'questionTemplatesWithTarget';
export const RATIONALE: 'rationale' = 'rationale';
export const ACTIVITIES_LIST: 'activities_list' = 'activities_list';
export const RATIONALE_ATTACHMENTS: 'rationale_attachments' = 'rationale_attachments';
export const USERS: 'users' = 'users';
export const TEAM_MEMBERS: 'teamMembers' = 'teamMembers';
export const WIDGET_LOCATIONS_CHUNK: 'widgetLocationsChunk' = 'widgetLocationsChunk';
export const WIDGET_LOCATION_PATH: 'widgetLocationPath' = 'widgetLocationPath';
export const ACTIVITY_RELATED_DOCUMENTS: 'activityRelatedDocuments' = 'activityRelatedDocuments';
export const ACTIVITY_REPORT_ATTACHMENTS: 'activityReportAttachments' = 'activityReportAttachments';
export const ACTIVITY_CHECKLIST: 'activityChecklist' = 'activityChecklist';
export const ACTIVITY_CHECKLIST_ATTACHMENTS: 'activityChecklistAttachments' = 'activityChecklistAttachments';
export const DATA_COLLECTION_ACTIVITY: 'dataCollectionActivities' = 'dataCollectionActivities';
export const ACTIVITY_OVERALL_FINDING: 'activityOverallFinding' = 'activityOverallFinding';
export const ACTIVITY_DETAILS: 'activityDetails' = 'activityDetails';
export const DATA_COLLECTION_CHECKLIST: 'dataCollectionChecklist' = 'dataCollectionChecklist';
export const DATA_COLLECTION_METHODS: 'dataCollectionMethods' = 'dataCollectionMethods';
export const DATA_COLLECTION_CHECKLIST_ITEM: 'dataCollectionChecklistItem' = 'dataCollectionChecklistItem';
export const DATA_COLLECTION_SPECIFIC_CHECKLIST: 'dataCollectionSpecificChecklist' = 'dataCollectionSpecificChecklist';
export const DATA_COLLECTION_OVERALL_FINDING: 'dataCollectionOverallFinding' = 'dataCollectionOverallFinding';
export const DATA_COLLECTION_BLUEPRINT: 'dataCollectionBlueprint' = 'dataCollectionBlueprint';
export const ATTACHMENTS_STORE: 'attachmentsStore' = 'attachmentsStore';
export const MONITORING_ACTIVITY_OVERALL_STATISTICS: 'monitoringActivityOverallStatistics' =
  'monitoringActivityOverallStatistics';
export const MONITORING_ACTIVITY_PARTNERS_COVERAGE: 'monitoringActivityPartnersCoverage' =
  'monitoringActivityPartnersCoverage';
export const MONITORING_ACTIVITY_INTERVENTIONS_COVERAGE: 'monitoringActivityInterventionsCoverage' =
  'monitoringActivityInterventionsCoverage';
export const MONITORING_ACTIVITY_CP_OUTPUT_COVERAGE: 'monitoringActivityCpOutputCoverage' =
  'monitoringActivityCpOutputCoverage';
export const GEOGRAPHIC_COVERAGE: 'geographicCoverage' = 'geographicCoverage';
export const OPEN_ISSUES_PARTNERS: 'openIssuesPartners' = 'openIssuesPartners';
export const OPEN_ISSUES_CP_OUTPUT: 'openIssuesCpOutput' = 'openIssuesCpOutput';
export const OPEN_ISSUES_LOCATIONS: 'openIssuesLocations' = 'openIssuesLocations';
export const HACT_VISITS: 'hactVisits' = 'hactVisits';
export const FULL_REPORT: 'fullReport' = 'fullReport';
export const ACTION_POINTS_LIST: 'actionPointsList' = 'actionPointsList';
export const ACTION_POINTS_DETAILS: 'actionPointsDetails' = 'actionPointsDetails';
export const ACTION_POINTS_CATEGORIES: 'actionPointsCategories' = 'actionPointsCategories';
export const ACTION_POINTS_OFFICES: 'offices' = 'offices';
export const FEATURES_FLAGS: 'flags' = 'flags';

export const etoolsEndpoints: IEtoolsEndpoints = {
  [PROFILE_ENDPOINT]: {
    url: '/api/v3/users/profile/'
  },

  [USERS]: {
    url: '/api/v1/field-monitoring/planning/users/?page_size=all',
    exp: 60 * 60 * 1000, // 1 hour
    cachingKey: 'id',
    cacheTableName: USERS
  },

  [TEAM_MEMBERS]: {
    template: '/api/v1/field-monitoring/planning/users/<%=params%>&page_size=all'
  },

  [CP_OUTCOMES]: {
    template: '/api/v1/field-monitoring/settings/results/?result_type=outcome',
    exp: 60 * 60 * 1000, // 1 hour
    cachingKey: 'id',
    cacheTableName: CP_OUTCOMES
  },

  [FULL_REPORT]: {
    template: '/api/reports/results/<%=id%>/full/'
  },

  [LOCATIONS_ENDPOINT]: {
    url: '/api/locations-light/',
    exp: 25 * 60 * 60 * 1000, // 25h
    cachingKey: 'id',
    cacheTableName: LOCATIONS_ENDPOINT
  },

  [CHANGE_COUNTRY]: {
    url: '/api/v3/users/changecountry/'
  },
  //fixme unused endpoint?
  [UNICEF_USER]: {
    url: '/api/v3/users/?verbosity=minimal',
    exp: 60 * 60 * 1000, // 1h
    cachingKey: 'unicefUsers'
  },

  [PARTNERS]: {
    url: '/api/v1/field-monitoring/planning/partners/?page_size=all',
    exp: 60 * 60 * 1000, // 1h
    cachingKey: 'id',
    cacheTableName: PARTNERS
  },

  [TPM_PARTNERS]: {
    url: '/api/tpm/partners/?page_size=all',
    exp: 60 * 60 * 1000, // 1h
    cachingKey: 'id',
    cacheTableName: TPM_PARTNERS
  },

  [CP_OUTPUTS]: {
    url: '/api/v1/field-monitoring/planning/cp-outputs/?page_size=all',
    exp: 60 * 60 * 1000, // 1h
    cachingKey: 'id',
    cacheTableName: CP_OUTPUTS
  },

  [INTERVENTIONS]: {
    url: '/api/v1/field-monitoring/planning/interventions/?page_size=all',
    exp: 60 * 60 * 1000, // 1h
    cachingKey: 'id',
    cacheTableName: INTERVENTIONS
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
    cachingKey: 'id',
    cacheTableName: CATEGORIES
  },

  [SECTIONS]: {
    url: '/api/v2/reports/sections/',
    exp: 24 * 60 * 60 * 1000, // 1 hour
    cachingKey: 'id',
    cacheTableName: SECTIONS
  },

  [METHODS]: {
    url: '/api/v1/field-monitoring/settings/methods/?page_size=all',
    exp: 24 * 60 * 60 * 1000, // 1 hour
    cachingKey: 'id',
    cacheTableName: METHODS
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
    template: '/api/v1/field-monitoring/settings/log-issues/<%=id%>/attachments/bulk-update/'
  },

  [ACTIVITIES_LIST]: {
    template: '/api/v1/field-monitoring/planning/activities/'
  },

  [WIDGET_LOCATIONS_CHUNK]: {
    url: '/api/v1/field-monitoring/settings/locations/'
  },

  [WIDGET_LOCATION_PATH]: {
    template: '/api/v1/field-monitoring/settings/locations/<%=id%>/path'
  },

  [ACTIVITY_DETAILS]: {
    template: '/api/v1/field-monitoring/planning/activities/<%=id%>/'
  },

  [DATA_COLLECTION_ACTIVITY]: {
    template: '/api/v1/field-monitoring/data-collection/activities/<%=activityId%>/'
  },

  [ACTIVITY_OVERALL_FINDING]: {
    template: '/api/v1/field-monitoring/data-collection/activities/<%=activityId%>/overall-findings/<%=overallId%>/'
  },

  [ACTIVITY_CHECKLIST]: {
    template: '/api/v1/field-monitoring/data-collection/activities/<%=id%>/questions/'
  },

  [ACTIVITY_CHECKLIST_ATTACHMENTS]: {
    template: '/api/v1/field-monitoring/data-collection/activities/<%=activityId%>/checklists/attachments/'
  },

  [DATA_COLLECTION_CHECKLIST]: {
    template: '/api/v1/field-monitoring/data-collection/activities/<%=activityId%>/checklists/'
  },

  [DATA_COLLECTION_METHODS]: {
    template: '/api/v1/field-monitoring/data-collection/activities/<%=activityId%>/methods/?page_size=all'
  },

  [DATA_COLLECTION_CHECKLIST_ITEM]: {
    template: '/api/v1/field-monitoring/data-collection/activities/<%=activityId%>/checklists/<%=checklistId%>/'
  },

  [DATA_COLLECTION_SPECIFIC_CHECKLIST]: {
    template: '/api/v1/field-monitoring/data-collection/activities/<%=activityId%>/checklists/<%=checklistId%>/'
  },

  [DATA_COLLECTION_OVERALL_FINDING]: {
    template:
      '/api/v1/field-monitoring/data-collection/activities/<%=activityId%>/checklists/<%=checklistId%>/overall/<%=overallId%>/'
  },

  [DATA_COLLECTION_BLUEPRINT]: {
    template:
      '/api/v1/field-monitoring/data-collection/activities/<%=activityId%>/checklists/<%=checklistId%>/blueprint/'
  },

  [ATTACHMENTS_STORE]: {
    url: '/api/v2/attachments/upload/'
  },

  [MONITORING_ACTIVITY_OVERALL_STATISTICS]: {
    template: '/api/v1/field-monitoring/analyze/overall/'
  },

  [MONITORING_ACTIVITY_PARTNERS_COVERAGE]: {
    template: '/api/v1/field-monitoring/analyze/coverage/partners/'
  },

  [MONITORING_ACTIVITY_INTERVENTIONS_COVERAGE]: {
    template: '/api/v1/field-monitoring/analyze/coverage/interventions/'
  },

  [MONITORING_ACTIVITY_CP_OUTPUT_COVERAGE]: {
    template: '/api/v1/field-monitoring/analyze/coverage/cp-outputs/'
  },

  [GEOGRAPHIC_COVERAGE]: {
    template: '/api/v1/field-monitoring/analyze/coverage/geographic/'
  },

  [OPEN_ISSUES_PARTNERS]: {
    template: '/api/v1/field-monitoring/analyze/issues/partners/'
  },

  [OPEN_ISSUES_CP_OUTPUT]: {
    template: '/api/v1/field-monitoring/analyze/issues/cp-outputs/'
  },

  [OPEN_ISSUES_LOCATIONS]: {
    template: '/api/v1/field-monitoring/analyze/issues/locations/'
  },

  [HACT_VISITS]: {
    template: '/api/v1/field-monitoring/analyze/hact/'
  },

  [ACTION_POINTS_LIST]: {
    template: '/api/v1/field-monitoring/planning/activities/<%=activityId%>/action-points/'
  },

  [ACTION_POINTS_DETAILS]: {
    template: '/api/v1/field-monitoring/planning/activities/<%=activityId%>/action-points/<%=id%>'
  },

  [ACTION_POINTS_CATEGORIES]: {
    template: '/api/action-points/categories/?module=fm'
  },

  [ACTION_POINTS_OFFICES]: {
    template: '/api/offices/'
  },

  [FEATURES_FLAGS]: {
    url: '/api/v2/environment/flags/'
  }
};
