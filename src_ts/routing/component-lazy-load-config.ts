// each key from this object is computed from routeName_routeSubPage (if subRoute exists)
export const componentsLazyLoadConfig: IRoutesLazyLoadComponentsPath = {
  'page-not-found': ['components/pages/page-not-found.js'],

  // Settings pages
  settings_sites: ['components/pages/settings/settings-page.js', 'components/pages/settings/sites-tab/sites-tab.js'],
  settings_questions: [
    'components/pages/settings/settings-page.js',
    'components/pages/settings/questions-tab/questions-tab.js'
  ],

  // Planing pages
  plan_rationale: ['components/pages/plan/plan-page.js', 'components/pages/plan/rationale-tab/rationale-tab.js'],
  'plan_issue-tracker': [
    'components/pages/plan/plan-page.js',
    'components/pages/plan/issue-tracker-tab/issue-tracker-tab.js'
  ],
  plan_templates: ['components/pages/plan/plan-page.js', 'components/pages/plan/templates-tab/templates-tab.js'],

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
    'components/pages/activities-and-data-collection/activity-item/activity-attachments-tab.js'
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
    'components/pages/analyze/monitoring-tab/partnership-tab/partnership-tab.js',
    'components/pages/analyze/monitoring-tab/pd-ssfa-tab/pd-ssfa-tab.js',
    'components/pages/analyze/monitoring-tab/cp-output-tab/cp-output-tab.js',
    'components/pages/analyze/monitoring-tab/open-issues-action-points/open-issues-partnership-tab/open-issues-partnership-tab.js',
    'components/pages/analyze/monitoring-tab/open-issues-action-points/open-issues-cp-output-tab/open-issues-cp-output-tab.js',
    'components/pages/analyze/monitoring-tab/open-issues-action-points/open-issues-location-tab/open-issues-location-tab.js'
  ],
  'analyze_country-overview': ['components/pages/analyze/analyze-page.js']
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
