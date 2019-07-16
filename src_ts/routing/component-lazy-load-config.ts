export type TRoutesLazyLoadComponentsPath = {
  [key: string]: string[]
};
// each key from this object is computed from routeName_routeSubPage (if subRoute exists)
export const componentsLazyLoadConfig: TRoutesLazyLoadComponentsPath = {

  engagements_list: [
    'components/pages/engagements/engagements-list.js'
  ],
  engagements_details: [
    'components/pages/engagements/engagement-tabs.js',
    'components/pages/engagements/engagement-tab-pages/engagement-details.js'
  ],
  engagements_questionnaires: [
    'components/pages/engagements/engagement-tabs.js',
    'components/pages/engagements/engagement-tab-pages/engagement-questionnaires.js'
  ],
  'page-not-found': [
    'components/pages/page-not-found.js'
  ],
  'page-two': [
    'components/pages/page-two.js'
  ]

};
