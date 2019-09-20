import {
  CSSResultArray,
  customElement, html, LitElement, property, query, TemplateResult
} from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { etoolsFiltersStyles } from './etools-filters-styles';

import '@polymer/iron-icons/iron-icons';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-toggle-button/paper-toggle-button';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-icon-item';
import '@polymer/paper-item/paper-item-body';

import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-date-time/datepicker-lite';
import { translate } from '../../../../localization/localisation';
import { PaperMenuButton } from '@polymer/paper-menu-button/paper-menu-button';

export enum EtoolsFilterTypes {
  Search,
  Dropdown,
  DropdownMulti,
  Toggle,
  Date
}

export interface IEtoolsFilter {
  filterName: string;
  filterKey: string;
  type: EtoolsFilterTypes;
  selected: boolean; // flag filter as selected from filters menu
  selectedValue: any;
  disabled?: boolean;
  defaultValue: any;
  selectionOptions?: any[]; // used only by dropdowns
  minWidth?: string; // used only by dropdowns
  hideSearch?: boolean; // used only by dropdowns
  optionValue?: string; // used only by dropdowns
  optionLabel?: string; // used only by dropdowns
  selectionOptionsEndpoint?: string;
}

@customElement('etools-filters')
export class EtoolsFilters extends LitElement {

  @property({ type: Object })
  public _filters: IEtoolsFilter[] = [];
  public set filters(filters: IEtoolsFilter[]) {
    if (this.paperButton && filters.length) {
      // close dropdown to recalculate dropdown height
      this.paperButton.close();
    }
    this._filters = filters;
  }
  public get filters(): IEtoolsFilter[] {
    return this._filters;
  }

  @property()
  public filterLoadingInProcess: boolean = false;

  @query('#filterMenu') public paperButton!: PaperMenuButton;

  private lastSelectedValues: any = null;

  public static get styles(): CSSResultArray {
    return [etoolsFiltersStyles];
  }

  public getSearchTmpl(f: IEtoolsFilter): TemplateResult {
    // language=HTML
    return html`
      <paper-input class="filter search"
               type="search"
               autocomplete="off"
               .value="${f.selectedValue}"
               placeholder="${f.filterName}"
               data-filter-key="${f.filterKey}"
               @value-changed="${this.textInputChange}">
        <iron-icon icon="search" slot="prefix"></iron-icon>
      </paper-input>
    `;
  }

  public getDropdownTmpl(f: IEtoolsFilter): TemplateResult {
    // language=HTML
    return html`
      <etools-dropdown
          class="filter"
          label="${f.filterName}"
          placeholder="Select"
          ?disabled="${f.disabled}"
          .options="${f.selectionOptions}"
          .optionValue="${f.optionValue ? f.optionValue : 'value'}"
          .optionLabel="${f.optionLabel ? f.optionLabel : 'label'}"
          .selected="${f.selectedValue}"
          trigger-value-change-event
          @etools-selected-item-changed="${this.filterSelectionChange}"
          data-filter-key="${f.filterKey}"
          ?hide-search="${f.hideSearch}"
          .minWidth="${f.minWidth}"
          horizontal-align="left"
          no-dynamic-align
          enable-none-option>
      </etools-dropdown>
    `;
  }

  public getDropdownMultiTmpl(f: IEtoolsFilter): TemplateResult {
    // language=HTML
    return html`
      <etools-dropdown-multi
          class="filter"
          label="${f.filterName}"
          placeholder="Select"
          ?disabled="${f.disabled}"
          .options="${f.selectionOptions}"
          .optionValue="${f.optionValue ? f.optionValue : 'value'}"
          .optionLabel="${f.optionLabel ? f.optionLabel : 'label'}"
          .selectedValues="${[...f.selectedValue]}"
          trigger-value-change-event
          @etools-selected-items-changed="${this.filterMultiSelectionChange}"
          data-filter-key="${f.filterKey}"
          ?hide-search="${f.hideSearch}"
          .minWidth="${f.minWidth}"
          horizontal-align="left"
          no-dynamic-align>
      </etools-dropdown-multi>
    `;
  }

  public getDateTmpl(f: IEtoolsFilter): TemplateResult {
    // language=HTML
    return html`
      <datepicker-lite class="filter date"
                       .label="${f.filterName}"
                       .value="${f.selectedValue}"
                       fire-date-has-changed
                       @date-has-changed="${this.filterDateChange}"
                       data-filter-key="${f.filterKey}"
                       .selectedDateDisplayFormat="D MMM YYYY">
      </datepicker-lite>
    `;
  }

  public getToggleTmpl(f: IEtoolsFilter): TemplateResult {
    // language=HTML
    return html`
      <div class="filter toggle" style="padding: 8px 0; box-sizing: border-box;">
        ${f.filterName}
        <paper-toggle-button id="toggleFilter"
                             ?checked="${f.selectedValue}"
                             data-filter-key="${f.filterKey}"
                             @iron-change="${this.filterToggleChange}"></paper-toggle-button>
      </div>
    `;
  }

  public get selectedFiltersTmpl(): TemplateResult {
    return html`${repeat(
        this.filters.filter((f: IEtoolsFilter) => f.selected),
        (filter: IEtoolsFilter) => filter.filterKey,
        (filter: IEtoolsFilter) => {
          switch (filter.type) {
            case EtoolsFilterTypes.Search:
              return this.getSearchTmpl(filter);
            case EtoolsFilterTypes.Dropdown:
              return this.getDropdownTmpl(filter);
            case EtoolsFilterTypes.DropdownMulti:
              return this.getDropdownMultiTmpl(filter);
            case EtoolsFilterTypes.Date:
              return this.getDateTmpl(filter);
            case EtoolsFilterTypes.Toggle:
              return this.getToggleTmpl(filter);
            default:
              return html``;
          }
        }
    )}`;
  }

  public get filterMenuOptions(): TemplateResult[] {
    const menuOptions: any[] = [];
    this.filters.forEach((f: IEtoolsFilter) => {
      // language=HTML
      menuOptions.push(html`
        <paper-icon-item @tap="${this.selectFilter}"
            ?disabled="${f.disabled}"
            ?selected="${f.selected}"
            data-filter-key="${f.filterKey}">
          <iron-icon icon="check" slot="item-icon" ?hidden="${!f.selected}"></iron-icon>
          <paper-item-body>${f.filterName}</paper-item-body>
        </paper-icon-item>
      `);
    });
    return menuOptions;
  }

  public render(): TemplateResult {
    // language=HTML
    return html`
        <style>
          /* Set datepicker prefix icon color using mixin (cannot be used in etools-filter-styles) */
          datepicker-lite {
            --paper-input-prefix: {
              color: var(--secondary-text-color, rgba(0, 0, 0, 0.54));
            }
          }

          .spinner-container {
            padding: 21px 14px 14px;
            white-space: nowrap;
          }
        </style>
        <div id="filters">
          ${this.selectedFiltersTmpl}
        </div>

        <div id="filters-selector">
          <paper-menu-button id="filterMenu" ignore-select horizontal-align="right">
            <paper-button class="button" slot="dropdown-trigger">
              <iron-icon icon="filter-list"></iron-icon>
              Filters
            </paper-button>
            ${ !this.filterLoadingInProcess ? html`
              <div slot="dropdown-content" class="clear-all-filters">
                <paper-button @tap="${this.clearAllFilterValues}"
                              class="secondary-btn">
                  CLEAR ALL
                </paper-button>
              </div>
              <paper-listbox slot="dropdown-content" multi>
                ${this.filterMenuOptions}
              </paper-listbox>
            ` : '' }
            <div slot="dropdown-content" ?hidden="${ !this.filterLoadingInProcess }" class="spinner-container">
                <etools-loading no-overlay active loading-text="${ translate('MAIN.LOADING_FILTERS_DATA') }"></etools-loading>
            </div>
          </paper-menu-button>
        </div>
    `;
  }

  public clearAllFilterValues(): void {
    if (this.filters.length === 0) {
      return;
    }
    this.filters.forEach((f: IEtoolsFilter) => {
      f.selectedValue = this.getFilterEmptyValue(f.type);
    });
    // repaint
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  public selectFilter(e: CustomEvent): void {
    const menuOption: HTMLElement = e.currentTarget as HTMLElement;
    const filterOption: IEtoolsFilter = this.getFilterOption(menuOption);
    const isSelected: boolean = menuOption.hasAttribute('selected');
    // toggle selected state
    filterOption.selected = !isSelected;
    // reset selected value if filter was unselected and had a value
    if (isSelected) {
      filterOption.selectedValue = this.getFilterEmptyValue(filterOption.type);
    }
    // repaint&fire change event
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  // get filter empty value by type
  public getFilterEmptyValue(filterType: EtoolsFilterTypes): '' | boolean | null | [] {
    switch (filterType) {
      case EtoolsFilterTypes.Search:
        return '';
      case EtoolsFilterTypes.Toggle:
        return false;
      case EtoolsFilterTypes.Date:
      case EtoolsFilterTypes.Dropdown:
        return null;
      case EtoolsFilterTypes.DropdownMulti:
        return [];
    }
  }

  public getFilterOption(filterElement: HTMLElement): IEtoolsFilter {
    const filterKey: string | null = filterElement.getAttribute('data-filter-key');
    if (!filterKey) {
      throw new Error('[EtoolsFilters.getFilterOption] No data-filter-key attr found on clicked option');
    }

    const filterOption: IEtoolsFilter | undefined = this.filters
      .find((f: IEtoolsFilter) => f.filterKey === filterKey);

    if (!filterOption) {
      // something went wrong... filter option not found
      throw new Error(`[EtoolsFilters.getFilterOption] Filter option not found by filterKey: "${filterKey}"`);
    }
    return filterOption;
  }

  public textInputChange(e: CustomEvent): void {
    if (!e.detail) {
      return;
    }
    const filterEl: HTMLElement = e.currentTarget as HTMLElement;
    const filterOption: IEtoolsFilter = this.getFilterOption(filterEl);
    if (filterOption.selectedValue === e.detail.value) {
      return;
    }
    filterOption.selectedValue = e.detail.value;
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  public filterSelectionChange(e: CustomEvent): void {
    const filterEl: HTMLElement = e.currentTarget as HTMLElement;
    const filterOption: IEtoolsFilter = this.getFilterOption(filterEl);
    filterOption.selectedValue = e.detail.selectedItem ? e.detail.selectedItem[(filterEl as any).optionValue] : null;
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  public filterMultiSelectionChange(e: CustomEvent): void {
    const filterEl: HTMLElement = e.currentTarget as HTMLElement;
    const filterOption: IEtoolsFilter = this.getFilterOption(filterEl);
    const currentSelectedVal: boolean = e.detail.selectedItems.length > 0
      ? e.detail.selectedItems.map((optionObj: any) => optionObj[(filterEl as any).optionValue])
      : [];
    if (JSON.stringify(currentSelectedVal) === JSON.stringify(filterOption.selectedValue)) {
      return;
    }
    filterOption.selectedValue = currentSelectedVal;
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  public filterDateChange(e: CustomEvent): void {
    const filterEl: HTMLElement = e.currentTarget as HTMLElement;
    const filterOption: IEtoolsFilter = this.getFilterOption(filterEl);
    filterOption.selectedValue = (filterEl as any).value; // get datepicker value
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  public filterToggleChange(e: CustomEvent): void {
    if (!e.detail) {
      return;
    }
    const filterEl: HTMLElement = e.currentTarget as HTMLElement;
    const filterOption: IEtoolsFilter = this.getFilterOption(filterEl);
    if (filterOption.selectedValue === (filterEl as any).checked) {
      return;
    }
    filterOption.selectedValue = (filterEl as any).checked; // get toggle btn value
    this.requestUpdate().then(() => this.fireFiltersChangeEvent());
  }

  // update filter values from parent element (! one way data flow)
  public updateFilters(filterValues: any): void {
    if (!filterValues || Object.keys(filterValues).length === 0) {
      return;
    }
    const keys: string[] = Object.keys(filterValues);
    this.filters.forEach((f: IEtoolsFilter) => {
      if (keys.indexOf(f.filterKey) > -1 ) {
        // filter found by key
        if (!f.selected) {
          // select filter is not already selected
          f.selected = true;
        }
        // update value
        f.selectedValue = filterValues[f.filterKey];
      }
    });
    this.requestUpdate();
    this.lastSelectedValues = { ...this.getSelectedFilterValues(), ...filterValues };
  }

  // fire change custom event to notify parent that filters were updated
  public fireFiltersChangeEvent(): void {
    const selectedValues: any = this.getSelectedFilterValues();
    if (JSON.stringify(this.lastSelectedValues) === JSON.stringify(selectedValues)) {
      return;
    }
    this.lastSelectedValues = { ...selectedValues };

    this.dispatchEvent(new CustomEvent('filter-change', {
      detail: selectedValues,
      bubbles: true,
      composed: true
    }));
  }

  // build and return and object based on filterKey and selectedValue
  public getSelectedFilterValues(): any {
    const selectedFilters: any = {};
    this.filters
      .forEach((f: IEtoolsFilter) => {
        selectedFilters[f.filterKey] = f.selectedValue;
      });
    return selectedFilters;
  }

}
