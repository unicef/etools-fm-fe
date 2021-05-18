// each key from this object is computed from routeName_routeSubPage (if subRoute exists)
export const componentsLazyLoadConfig: IRoutesLazyLoadComponentsPath = {
  'page-not-found': ['components/pages/page-not-found.js'],

  // Plan pages
  plan_sites: ['components/pages/plan/plan-page.js', 'components/pages/plan/sites-tab/sites-tab.js'],
  plan_rationale: ['components/pages/plan/plan-page.js', 'components/pages/plan/rationale-tab/rationale-tab.js'],

  // Planing pages
  settings_questions: [
    'components/pages/settings/settings-page.js',
    'components/pages/settings/questions-tab/questions-tab.js'
  ],

  'settings_issue-tracker': [
    'components/pages/settings/settings-page.js',
    'components/pages/settings/issue-tracker-tab/issue-tracker-tab.js'
  ],
  settings_templates: [
    'components/pages/settings/settings-page.js',
    'components/pages/settings/templates-tab/templates-tab.js'
  ],

  // Activities List
  activities_list: [
    'components/pages/activities-and-data-collection/activities-page.js',
    'components/pages/activities-and-data-collection/activities-list/activities-list.js'
  ],

  // Activity Item Pages
  activities_item: [
    'components/pages/activities-and-data-collection/activities-page.js',
    'components/pages/activities-and-data-collection/activity-item/activity-item.js',
    'components/pages/activities-and-data-collection/activity-item/details-tab/activity-details-tab.js',
    'components/pages/activities-and-data-collection/activity-item/review-tab/activity-review-tab.js',
    'components/pages/activities-and-data-collection/activity-item/checklist-tab/activity-checklist-tab.js',
    'components/pages/activities-and-data-collection/activity-item/data-collect-tab/data-collect-tab.js',
    'components/pages/activities-and-data-collection/activity-item/additional-info-tab/additional-info-tab.js',
    'components/pages/activities-and-data-collection/activity-item/activity-summary-tab/activity-summary-tab.js',
    'components/pages/activities-and-data-collection/activity-item/activity-attachments-tab/activity-attachments-tab.js',
    'components/pages/activities-and-data-collection/activity-item/action-points-tab/action-points-tab.js'
  ],

  // Activity Data Collection
  'activities_data-collection': [
    'components/pages/activities-and-data-collection/activities-page.js',
    'components/pages/activities-and-data-collection/data-collection/data-collection.js'
  ],

  // Analyze pages
  'analyze_monitoring-activity': [
    'components/pages/analyze/analyze-page.js',
    'components/pages/analyze/monitoring-tab/monitoring-tab.js',
    'components/pages/analyze/monitoring-tab/coverage/partnership-tab/partnership-tab.js',
    'components/pages/analyze/monitoring-tab/coverage/pd-ssfa-tab/pd-ssfa-tab.js',
    'components/pages/analyze/monitoring-tab/coverage/cp-output-tab/cp-output-tab.js',
    'components/pages/analyze/monitoring-tab/open-issues-action-points/open-issues-partnership-tab/open-issues-partnership-tab.js',
    'components/pages/analyze/monitoring-tab/open-issues-action-points/open-issues-cp-output-tab/open-issues-cp-output-tab.js',
    'components/pages/analyze/monitoring-tab/open-issues-action-points/open-issues-location-tab/open-issues-location-tab.js'
  ],
  'analyze_country-overview': [
    'components/pages/analyze/analyze-page.js',
    'components/pages/analyze/co-overview-tab/co-overview-tab.js',
    'components/pages/analyze/co-overview-tab/cp-details-item/cp-details-item.js'
  ]
};

export function getFilePathsToImport(routeDetails: IRouteDetails): string[] {
  let routeImportsPathsKey: string = routeDetails.routeName;
  if (routeDetails.subRouteName) {
    routeImportsPathsKey += `_${routeDetails.subRouteName}`;
  }

  const filesToImport: string[] = componentsLazyLoadConfig[routeImportsPathsKey];
  if (!filesToImport || filesToImport.length === 0) {
    throw new Error('No file imports configuration found (componentsLazyLoadConfig)!');
  }
  return filesToImport;
}
