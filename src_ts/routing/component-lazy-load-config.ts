// each key from this object is computed from routeName_routeSubPage (if subRoute exists)
export const componentsLazyLoadConfig: IRoutesLazyLoadComponentsPath = {
    'page-not-found': [
        'components/pages/page-not-found.js'
    ],

    // Settings pages
    'settings_sites': [
        'components/pages/settings/settings-pages.js',
        'components/pages/settings/sites-tab/sites-tab.js'
    ],
    'settings_questions': [
        'components/pages/settings/settings-pages.js',
        'components/pages/settings/questions-tab/questions-tab.js'
    ],

    // Planing pages
    'plan_rationale': [
        'components/pages/plan/plan-page.js'
    ],
    'plan_issue-tracker': [
        'components/pages/plan/plan-page.js'
    ],
    'plan_templates': [
        'components/pages/plan/plan-page.js',
        'components/pages/plan/templates-tab/templates-tab.js'
    ],

    // Activities and data collection pages
    'activities': [
        'components/pages/activities-and-data-collection/activities-page.js'
    ],

    // Analyze pages
    'analyze_monitoring-activity': [
        'components/pages/analyze/analyze-page.js'
    ],
    'analyze_country-overview': [
        'components/pages/analyze/analyze-page.js'
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
