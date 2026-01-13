/* eslint-disable max-len */
export const PROFILE_ENDPOINT = 'userProfile';
export const CP_OUTCOMES = 'cpOutcomes';
export const LOCATIONS_ENDPOINT = 'locations';
export const CHANGE_COUNTRY = 'changeCountry';
export const CHANGE_ORGANIZATION = 'changeOrganization';
export const SITES_EXPORT = 'unicefUsers';
export const ACTIVITIES_EXPORT = 'activitiesExport';
export const SITES_LIST = 'siteLocations';
export const SITE_DETAILS = 'siteLocationsDetails';
export const CURRENT_WORKSPACE = 'currentWorkspace';
export const QUESTIONS_LIST = 'questionsList';
export const QUESTIONS_LIST_EXPORT = 'questionsListExport';
export const QUESTIONS_DETAILS = 'questionsDetails';
export const CATEGORIES = 'categories';
export const SECTIONS = 'sections';
export const METHODS = 'methods';
export const PARTNERS = 'partners';
export const VISIT_GOALS = 'visitGoals';
export const FACILITY_TYPES = 'facilityTypes';
export const TPM_PARTNERS = 'tpmPartners';
export const TPM_PARTNERS_EXPORT = 'tpmPartnersExport';
export const TPM_DETAILS = 'tpmDetails';
export const TPM_PARTNER_EXPORT = 'tpmPartnerExport';
export const TPM_PARTNER_ATTACHMENTS = 'tpmPartnerAttachments';
export const TPM_PARTNER_STAFF = 'tpmPartnerStaff';
export const INTERVENTIONS = 'interventions';
export const INTERVENTIONS_ACTIVE = 'interventionsActive';
export const CP_OUTPUTS = 'outputs';
export const CP_OUTPUTS_ACTIVE = 'outputsActive';
export const LOG_ISSUES = 'logIssues';
export const LOG_ISSUES_DETAILS = 'logIssuesDetails';
export const LOG_ISSUES_ATTACHMENTS = 'logIssuesAttachments';
export const QUESTION_TEMPLATES = 'questionTemplates';
export const QUESTION_TEMPLATES_WITH_TARGET = 'questionTemplatesWithTarget';
export const RATIONALE = 'rationale';
export const ACTIVITIES_LIST = 'activities_list';
export const RATIONALE_ATTACHMENTS = 'rationale_attachments';
export const USERS = 'users';
export const REVIEWERS = 'reviewers';
export const TEAM_MEMBERS = 'teamMembers';
export const WIDGET_LOCATIONS_CHUNK = 'widgetLocationsChunk';
export const WIDGET_LOCATION_PATH = 'widgetLocationPath';
export const ACTIVITY_RELATED_DOCUMENTS = 'activityRelatedDocuments';
export const ACTIVITY_REPORT_ATTACHMENTS = 'activityReportAttachments';
export const ACTIVITY_CHECKLIST = 'activityChecklist';
export const ACTIVITY_CHECKLIST_ATTACHMENTS = 'activityChecklistAttachments';
export const DATA_COLLECTION_ACTIVITY = 'dataCollectionActivities';
export const ACTIVITY_OVERALL_FINDING = 'activityOverallFinding';
export const ACTIVITY_DETAILS = 'activityDetails';
export const ACTIVITY_DUPLICATE = 'activityDuplicate';
export const DATA_COLLECTION_CHECKLIST = 'dataCollectionChecklist';
export const DATA_COLLECTION_METHODS = 'dataCollectionMethods';
export const DATA_COLLECTION_CHECKLIST_ITEM = 'dataCollectionChecklistItem';
export const DATA_COLLECTION_SPECIFIC_CHECKLIST = 'dataCollectionSpecificChecklist';
export const DATA_COLLECTION_OVERALL_FINDING = 'dataCollectionOverallFinding';
export const DATA_COLLECTION_BLUEPRINT = 'dataCollectionBlueprint';
export const ATTACHMENTS_STORE = 'attachmentsStore';
export const FULL_REPORT = 'fullReport';
export const ACTION_POINTS_LIST = 'actionPointsList';
export const ACTION_POINTS_DETAILS = 'actionPointsDetails';
export const TPM_ACTION_POINTS_LIST = 'tpmActionPointsList';
export const TPM_ACTION_POINTS_DETAILS = 'tpmActionPointsDetails';
export const ACTION_POINTS_CATEGORIES = 'actionPointsCategories';
export const ACTION_POINTS_OFFICES = 'offices';
export const FEATURES_FLAGS = 'flags';
export const SYNC_VENDOR_DATA = 'syncVendorData';
export const ACTIVATE_VENDOR = 'activateVendor';
export const QUESTIONS_ORDER = 'questionsOrder';

export const etoolsEndpoints: IEtoolsEndpoints = {
  [PROFILE_ENDPOINT]: {
    url: '/api/v3/users/profile/'
  },

  [USERS]: {
    url: '/api/v1/field-monitoring/planning/users/?page_size=all&with_name=true',
    exp: 60 * 60 * 1000, // 1 hour
    cachingKey: 'id',
    cacheTableName: USERS
  },

  [REVIEWERS]: {
    url: '/api/v1/field-monitoring/planning/users/?user_type=report_reviewer&page_size=all&with_name=true',
    exp: 60 * 60 * 1000, // 1 hour
    cachingKey: 'id',
    cacheTableName: REVIEWERS
  },

  [TEAM_MEMBERS]: {
    template: '/api/v1/field-monitoring/planning/users/<%=params%>&page_size=all&with_name=true'
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

  [CHANGE_ORGANIZATION]: {
    url: '/api/v3/users/changeorganization/'
  },

  [PARTNERS]: {
    url: '/api/v1/field-monitoring/planning/partners/?page_size=all',
    exp: 60 * 60 * 1000, // 1h
    cachingKey: 'id',
    cacheTableName: PARTNERS
  },

  [VISIT_GOALS]: {
    url: '/api/v1/field-monitoring/planning/visit-goals/?page_size=all',
    exp: 60 * 60 * 1000, // 1h
    cachingKey: 'id',
    cacheTableName: VISIT_GOALS
  },

  [FACILITY_TYPES]: {
    url: '/api/v1/field-monitoring/planning/facility-types/?page_size=all',
    exp: 60 * 60 * 1000, // 1h
    cachingKey: 'id',
    cacheTableName: FACILITY_TYPES
  },

  [TPM_PARTNERS]: {
    url: '/api/tpm/partners/?page_size=all'
  },

  [TPM_PARTNERS_EXPORT]: {
    url: '/api/tpm/partners/export/'
  },

  [TPM_DETAILS]: {
    template: '/api/tpm/partners/<%=id%>/'
  },

  [TPM_PARTNER_EXPORT]: {
    template: '/api/tpm/partners/<%=id%>/staff-members/export/'
  },

  [TPM_PARTNER_ATTACHMENTS]: {
    template: '/api/tpm/partners/<%=id%>/attachments/'
  },

  [TPM_PARTNER_STAFF]: {
    template: '/api/tpm/partners/<%=id%>/staff-members/?page_size=all&ordering=-id'
  },

  [CP_OUTPUTS]: {
    url: '/api/v1/field-monitoring/planning/cp-outputs/?page_size=all',
    exp: 60 * 60 * 1000, // 1h
    cachingKey: 'id',
    cacheTableName: CP_OUTPUTS
  },

  [CP_OUTPUTS_ACTIVE]: {
    url: '/api/v1/field-monitoring/planning/cp-outputs/?page_size=all&active=True',
    exp: 60 * 60 * 1000, // 1h
    cachingKey: 'id',
    cacheTableName: CP_OUTPUTS_ACTIVE
  },

  [INTERVENTIONS]: {
    url: '/api/v1/field-monitoring/planning/interventions/?page_size=all',
    exp: 60 * 60 * 1000, // 1h
    cachingKey: 'id',
    cacheTableName: INTERVENTIONS
  },

  [INTERVENTIONS_ACTIVE]: {
    url: '/api/v1/field-monitoring/planning/interventions/?page_size=all&status__in=active',
    exp: 60 * 60 * 1000, // 1h
    cachingKey: 'id',
    cacheTableName: INTERVENTIONS_ACTIVE
  },

  [SITES_EXPORT]: {
    url: '/api/v1/field-monitoring/settings/sites/export/'
  },

  [ACTIVITIES_EXPORT]: {
    url: '/api/v1/field-monitoring/planning/activities/export/'
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

  [QUESTIONS_LIST_EXPORT]: {
    url: '/api/v1/field-monitoring/settings/questions/export'
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

  [ACTIVITY_DUPLICATE]: {
    template: '/api/v1/field-monitoring/planning/activities/<%=id%>/duplicate/'
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

  [ACTION_POINTS_LIST]: {
    template: '/api/v1/field-monitoring/planning/activities/<%=activityId%>/action-points/'
  },

  [ACTION_POINTS_DETAILS]: {
    template: '/api/v1/field-monitoring/planning/activities/<%=activityId%>/action-points/<%=id%>'
  },

  [TPM_ACTION_POINTS_LIST]: {
    template: '/api/v1/field-monitoring/planning/activities/<%=activityId%>/tpm-concerns/'
  },

  [TPM_ACTION_POINTS_DETAILS]: {
    template: '/api/v1/field-monitoring/planning/activities/<%=activityId%>/tpm-concerns/<%=id%>'
  },

  [ACTION_POINTS_CATEGORIES]: {
    template: '/api/action-points/categories/?module=fm'
  },

  [ACTION_POINTS_OFFICES]: {
    template: '/api/offices/'
  },

  [FEATURES_FLAGS]: {
    url: '/api/v2/environment/flags/'
  },

  [SYNC_VENDOR_DATA]: {
    template: '/api/tpm/partners/sync/<%=id%>/'
  },

  [ACTIVATE_VENDOR]: {
    template: '/api/tpm/partners/<%=id%>/activate/'
  },

  [QUESTIONS_ORDER]: {
    url: '/api/v1/field-monitoring/settings/questions/update-order/'
  },
  comments: {
    template: '/api/comments/v1/field_monitoring_planning/monitoringactivity/<%=collectionId%>/'
  },
  resolveComment: {
    template: '/api/comments/v1/field_monitoring_planning/monitoringactivity/<%=collectionId%>/<%=commentId%>/resolve/'
  },
  deleteComment: {
    template: '/api/comments/v1/field_monitoring_planning/monitoringactivity/<%=collectionId%>/<%=commentId%>/delete/'
  },
  downloadComment: {
    template: '/api/comments/v1/field_monitoring_planning/monitoringactivity/<%=collectionId%>/csv/'
  }
};
