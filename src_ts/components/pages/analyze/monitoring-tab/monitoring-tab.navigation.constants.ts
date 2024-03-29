import {TemplateResult, html} from 'lit';

export const PARTNER_TAB = 'partner';
export const PD_SPD_TAB = 'pd-spd';
export const CP_OUTPUT_TAB = 'cp-output';
export const COVERAGE_TABS: string[] = [PARTNER_TAB, PD_SPD_TAB, CP_OUTPUT_TAB];

export const OPEN_ISSUES_PARTNER_TAB = 'open-issues-partner';
export const OPEN_ISSUES_CP_OUTPUT_TAB = 'open-issues-cp-output';
export const OPEN_ISSUES_LOCATION_TAB = 'open-issues-location';

export const COVERAGE_OF_ACTIVE_PARTNERSHIPS_CONTENT_MAP: Map<string, TemplateResult> = new Map([
  [PARTNER_TAB, html` <partnership-tab></partnership-tab> `],
  [PD_SPD_TAB, html` <pd-spd-tab></pd-spd-tab> `],
  [CP_OUTPUT_TAB, html` <cp-output-tab></cp-output-tab> `]
]);

export const OPEN_ISSUES_CONTENT_MAP: Map<string, TemplateResult> = new Map([
  [OPEN_ISSUES_PARTNER_TAB, html` <open-issues-partnership-tab></open-issues-partnership-tab> `],
  [OPEN_ISSUES_CP_OUTPUT_TAB, html` <open-issues-cp-output-tab></open-issues-cp-output-tab> `],
  [OPEN_ISSUES_LOCATION_TAB, html` <open-issues-location-tab></open-issues-location-tab> `]
]);
