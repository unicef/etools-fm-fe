import {TemplateResult, html} from 'lit-html';
import {translate} from 'lit-translate';

export const PARTNER_TAB: string = 'partner';
const PD_SSFA_TAB: string = 'pd-ssfa';
const CP_OUTPUT_TAB: string = 'cp-output';
export const COVERAGE_TABS: string[] = [PARTNER_TAB, PD_SSFA_TAB, CP_OUTPUT_TAB];

export const OPEN_ISSUES_PARTNER_TAB: string = 'open-issues-partner';
const OPEN_ISSUES_CP_OUTPUT_TAB: string = 'open-issues-cp-output';
const OPEN_ISSUES_LOCATION_TAB: string = 'open-issues-location';

export const COVERAGE_PAGE_TABS: PageTab[] = [
  {
    tab: PARTNER_TAB,
    tabLabel: translate('ANALYZE.MONITORING_TAB.NAVIGATION_TABS.BY_PARTNER'),
    hidden: false
  },
  {
    tab: PD_SSFA_TAB,
    tabLabel: translate('ANALYZE.MONITORING_TAB.NAVIGATION_TABS.BY_PD_SSFA'),
    hidden: false
  },
  {
    tab: CP_OUTPUT_TAB,
    tabLabel: translate('ANALYZE.MONITORING_TAB.NAVIGATION_TABS.BY_CP_OUTPUT'),
    hidden: false
  }
];

export const OPEN_ISSUES_PAGE_TABS: PageTab[] = [
  {
    tab: OPEN_ISSUES_PARTNER_TAB,
    tabLabel: translate('ANALYZE.MONITORING_TAB.NAVIGATION_TABS.BY_PARTNER'),
    hidden: false
  },
  {
    tab: OPEN_ISSUES_CP_OUTPUT_TAB,
    tabLabel: translate('ANALYZE.MONITORING_TAB.NAVIGATION_TABS.BY_CP_OUTPUT'),
    hidden: false
  },
  {
    tab: OPEN_ISSUES_LOCATION_TAB,
    tabLabel: translate('ANALYZE.MONITORING_TAB.NAVIGATION_TABS.BY_LOCATION'),
    hidden: false
  }
];

export const COVERAGE_OF_ACTIVE_PARTNERSHIPS_CONTENT_MAP: Map<string, TemplateResult> = new Map([
  [
    PARTNER_TAB,
    html`
      <partnership-tab></partnership-tab>
    `
  ],
  [
    PD_SSFA_TAB,
    html`
      <pd-ssfa-tab></pd-ssfa-tab>
    `
  ],
  [
    CP_OUTPUT_TAB,
    html`
      <cp-output-tab></cp-output-tab>
    `
  ]
]);

export const OPEN_ISSUES_CONTENT_MAP: Map<string, TemplateResult> = new Map([
  [
    OPEN_ISSUES_PARTNER_TAB,
    html`
      <open-issues-partnership-tab></open-issues-partnership-tab>
    `
  ],
  [
    OPEN_ISSUES_CP_OUTPUT_TAB,
    html`
      <open-issues-cp-output-tab></open-issues-cp-output-tab>
    `
  ],
  [
    OPEN_ISSUES_LOCATION_TAB,
    html`
      <open-issues-location-tab></open-issues-location-tab>
    `
  ]
]);
