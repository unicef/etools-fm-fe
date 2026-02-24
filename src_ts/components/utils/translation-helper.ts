import {get} from '@unicef-polymer/etools-unicef/src/etools-translate';

export function applyDropdownTranslation(dropdown: DefaultDropdownOption<any>[]): DefaultDropdownOption<any>[] {
  return dropdown.map((item: DefaultDropdownOption<any>) => {
    return {
      ...item,
      display_name: get(item.display_name as string)
    };
  });
}

export function applyPageTabsTranslation(pageTabs: PageTab[]): PageTab[] {
  return pageTabs.map((item: PageTab) => {
    return {
      ...item,
      tabLabel: get(item.tabLabel as string)
    };
  });
}
