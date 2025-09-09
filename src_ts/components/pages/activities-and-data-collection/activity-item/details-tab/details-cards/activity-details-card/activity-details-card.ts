import {html, css, TemplateResult, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {SectionsMixin} from '../../../../../../common/mixins/sections-mixin';
import {store} from '../../../../../../../redux/store';
import {sitesSelector} from '../../../../../../../redux/selectors/site-specific-locations.selectors';
import {staticDataDynamic, visitGoalsSelector} from '../../../../../../../redux/selectors/static-data.selectors';
import {LOCATIONS_ENDPOINT} from '../../../../../../../endpoints/endpoints-list';
import {Unsubscribe} from 'redux';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {SharedStyles} from '../../../../../../styles/shared-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../../../../styles/card-styles';
import {BaseDetailsCard} from '../base-details-card';
import {SetEditedDetailsCard} from '../../../../../../../redux/actions/activity-details.actions';
import {loadSiteLocations} from '../../../../../../../redux/effects/site-specific-locations.effects';
import clone from 'ramda/es/clone';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {OfficesMixin} from '../../../../../../common/mixins/offices-mixin';
import {simplifyValue} from '@unicef-polymer/etools-utils/dist/equality-comparisons.util';
import {get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {InputStyles} from '../../../../../../styles/input-styles';
import {formatDate} from '@unicef-polymer/etools-utils/dist/date.util';
import '@unicef-polymer/etools-modules-common/dist/layout/etools-tabs';
import '@unicef-polymer/etools-unicef/src/etools-date-time/datepicker-lite';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown-multi';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {FormBuilderCardStyles} from '@unicef-polymer/etools-form-builder/dist/lib/styles/form-builder-card.styles';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import {activeLanguageSelector} from '../../../../../../../redux/selectors/active-language.selectors';
import {applyPageTabsTranslation} from '../../../../../../utils/translation-helper';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import SlSwitch from '@shoelace-style/shoelace/dist/components/switch/switch.js';
import {CommentElementMeta, CommentsMixin} from '../../../../../../common/comments/comments-mixin';
import '@unicef-polymer/etools-unicef/src/etools-info-tooltip/etools-info-tooltip';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

dayjs.extend(isSameOrBefore);

export const CARD_NAME = 'activity-details';
const SITE_TAB = 'SITE_TAB';
const AREA_TAB = 'AREA_TAB';

const ELEMENT_FIELDS: (keyof IActivityDetails)[] = [
  'sections',
  'end_date',
  'start_date',
  'location_site',
  'location',
  'offices',
  'visit_goals',
  'objective',
  'facility_types'
];

const ACTIVITY_DETAILS_TABS: PageTab[] = [
  {
    tab: SITE_TAB,
    tabLabel: 'ACTIVITY_DETAILS.MAP_SELECT_LOCATION_BY_SITE',
    hidden: false
  },
  {
    tab: AREA_TAB,
    tabLabel: 'ACTIVITY_DETAILS.MAP_SELECT_LOCATION_BY_ADMIN_LEVEL',
    hidden: false
  }
];

@customElement('activity-details-card')
export class ActivityDetailsCard extends CommentsMixin(OfficesMixin(SectionsMixin(BaseDetailsCard))) {
  @property() widgetOpened = false;
  @property() sitesList: Site[] = [];
  @property() visitGoals: VisitGoal[] = [];
  @property() locations: EtoolsLightLocation[] = [];

  @property() activitySections: Section[] = [];

  @property() activityOffices: Office[] | [] = [];
  @property() activityVisitGoals: any[] | [] = [];
  @property({type: String}) activeTab = SITE_TAB;
  @property() pageTabs: PageTab[] = applyPageTabsTranslation(ACTIVITY_DETAILS_TABS);

  private sitesUnsubscribe!: Unsubscribe;
  private visitGoalsUnsubscribe!: Unsubscribe;
  private locationsUnsubscribe!: Unsubscribe;
  private activeLanguageUnsubscribe!: Unsubscribe;

  static get styles(): CSSResult[] {
    // language=CSS
    return [
      elevationStyles,
      SharedStyles,
      layoutStyles,
      CardStyles,
      css`
        .card-content {
          padding-bottom: 10px;
        }
        .widget-container {
          position: relative;
          border: solid 1px var(--gray-06);
          margin: 0 12px;
        }

        .widget-dropdown {
          display: flex;
          align-items: center;
          padding: 14px 19px;
          margin: 18px 12px 0;
          color: var(--module-primary);
          background-color: var(--gray-06);
          text-transform: uppercase;
          font-weight: 500;
          font-size: var(--etools-font-size-16, 16px);
        }

        .widget-dropdown span,
        .widget-dropdown etools-icon.toggle-btn {
          cursor: pointer;
        }

        etools-loading {
          z-index: 9999;
        }
        datepicker-lite {
          white-space: nowrap;
          --etools-icon-fill-color: var(--secondary-text-color);
        }
        .pbs-30 {
          padding-block-start: 30px;
        }
      `
    ];
  }

  set data(data: IActivityDetails) {
    super.data = data;
    this.activitySections = data ? clone(data.sections) : [];
    this.activityOffices = data ? clone(data.offices) : [];
    this.activityVisitGoals = data && data.visit_goals ? clone(data.visit_goals) : [];
  }

  render(): TemplateResult {
    return html`
      ${InputStyles}
      <style>
        ${FormBuilderCardStyles}
      </style>
      <etools-card
        card-title="${translate('ACTIVITY_DETAILS.ACTIVITY_DETAILS')}"
        related-to="activity_details"
        comments-container
        ?is-editable="${this.havePossibilityToEditCard(CARD_NAME, ELEMENT_FIELDS)}"
        ?edit="${this.isEditMode}"
        @start-edit="${() => this.startEdit()}"
        @save="${() => this.save()}"
        @cancel="${() => this.cancel()}"
      >
        <div slot="content" class="card-content">
          <!--   Spinner for loading data   -->
          <etools-loading
            ?active="${this.isLoad}"
            loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
          ></etools-loading>

          <!--   Spinner for updating data   -->
          <etools-loading
            ?active="${this.isUpdate}"
            loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
          ></etools-loading>

          <!--    Collapsed location Widget    -->
          ${this.isEditMode && !this.isFieldReadonly('location')
            ? html`
                <etools-tabs-lit
                  id="tabs"
                  slot="tabs"
                  .tabs="${this.pageTabs}"
                  @sl-tab-show="${({detail}: any) => this.onChangeMapTab(detail.name)}"
                  .activeTab="${this.activeTab}"
                ></etools-tabs-lit>
                ${this.getTabElement()}
              `
            : ''}

          <!--    Inputs for displaying Location and Site fields    -->
          <div class="row">
            <etools-dropdown
              class="readonly-required col-md-6 col-12"
              .selected="${simplifyValue(this.editedData.location)}"
              label="${translate('LOCATION_TO_BE_VISITED')}"
              .options="${this.locations}"
              option-label="name"
              option-value="id"
              readonly
              required
              min-width="470px"
            >
            </etools-dropdown>

            <etools-dropdown
              class="readonly-required col-md-6 col-12"
              .selected="${simplifyValue(this.editedData.location_site)}"
              label="${translate('SITE_TO_BE_VISITED')}"
              .options="${this.sitesList}"
              option-label="name"
              option-value="id"
              readonly
              min-width="470px"
            >
            </etools-dropdown>

            <etools-dropdown-multi
              .selectedValues="${simplifyValue(this.editedData.facility_types)}"
              @etools-selected-items-changed="${({detail}: CustomEvent) =>
                this.selectFacilityTypes(detail.selectedItems)}"
              class="col-md-3 col-12"
              ?trigger-value-change-event="${this.isEditMode}"
              label="${translate('ACTIVITY_DETAILS.TYPE_OF_FACILITY')}"
              .options="${this.facilityTypes}"
              option-label="name"
              option-value="id"
              ?readonly="${!this.isEditMode}"
              ?invalid="${this.errors && this.errors.typeOfFacility}"
              .errorMessage="${this.errors && this.errors.typeOfFacility}"
              @focus="${() => this.resetFieldError('type_of_facility')}"
              @click="${() => this.resetFieldError('type_of_facility')}"
              allow-outside-scroll
              dynamic-align
            ></etools-dropdown-multi>

            <!--     Start Date and End Date inputs     -->
            <div class="col-md-3 col-12">
              <datepicker-lite
                class="validate-input datepicker-width"
                .value="${this.editedData.start_date || ''}"
                label="${translate('ACTIVITY_DETAILS.START_DATE')}"
                .autoValidate="${true}"
                ?fire-date-has-changed="${this.isEditMode}"
                @date-has-changed="${({detail}: CustomEvent) =>
                  this.updateModelValue('start_date', detail.date ? formatDate(detail.date, 'YYYY-MM-DD') : '')}"
                ?readonly="${!this.isEditMode || this.isFieldReadonly('start_date')}"
                selected-date-display-format="D MMM YYYY"
              ></datepicker-lite>
            </div>
            <div class="col-md-3 col-12">
              <datepicker-lite
                class="validate-input datepicker-width"
                .value="${this.editedData.end_date || ''}"
                .autoValidate="${true}"
                ?fire-date-has-changed="${this.isEditMode}"
                @date-has-changed="${({detail}: CustomEvent) =>
                  this.updateModelValue('end_date', detail.date ? formatDate(detail.date, 'YYYY-MM-DD') : '')}"
                label="${translate('ACTIVITY_DETAILS.END_DATE')}"
                ?readonly="${!this.isEditMode || this.isFieldReadonly('end_date')}"
                selected-date-display-format="D MMM YYYY"
              ></datepicker-lite>
            </div>

            <!--     Sections dropdown     -->
            <div class="col-md-6 col-12">
              <etools-dropdown-multi
                .selectedValues="${simplifyValue(this.activitySections)}"
                @etools-selected-items-changed="${({detail}: CustomEvent) => this.selectSections(detail.selectedItems)}"
                ?trigger-value-change-event="${this.isEditMode}"
                label="${translate('ACTIVITY_DETAILS.SECTIONS')}"
                .options="${this.sections.length ? this.sections : this.activitySections}"
                option-label="name"
                option-value="id"
                ?readonly="${!this.isEditMode || this.isFieldReadonly('sections')}"
                ?invalid="${this.errors && this.errors.sections}"
                .errorMessage="${this.errors && this.errors.sections}"
                @focus="${() => this.resetFieldError('sections')}"
                @click="${() => this.resetFieldError('sections')}"
                allow-outside-scroll
                dynamic-align
              ></etools-dropdown-multi>
            </div>

            <!--     Offices dropdown     -->
            <div class="col-md-6 col-12">
              <etools-dropdown-multi
                class="field-office"
                .selectedValues="${simplifyValue(this.activityOffices)}"
                @etools-selected-items-changed="${({detail}: CustomEvent) => this.selectOffices(detail.selectedItems)}"
                ?trigger-value-change-event="${this.isEditMode}"
                label="${translate('ACTIVITY_DETAILS.OFFICE')}"
                .options="${this.allOffices.length
                  ? this.allOffices
                  : this.activityOffices.filter((office: Office | null) => Boolean(office))}"
                option-label="name"
                option-value="id"
                ?readonly="${!this.isEditMode || this.isFieldReadonly('offices')}"
                ?invalid="${this.errors && this.errors.offices}"
                .errorMessage="${this.errors && this.errors.offices}"
                @focus="${() => this.resetFieldError('offices')}"
                @click="${() => this.resetFieldError('offices')}"
                allow-outside-scroll
                dynamic-align
              ></etools-dropdown-multi>
            </div>
            <div class="col-md-6 col-12 pbs-30">
              <sl-switch
                .checked="${this.editedData.remote_monitoring}"
                ?disabled="${!this.isEditMode || this.isFieldReadonly('remote_monitoring')}"
                @sl-change="${(e: CustomEvent) => (this.editedData.remote_monitoring = (e.target as SlSwitch).checked)}"
              >
                ${translate('ACTIVITY_DETAILS.INVOLVES_REMOTE_MONITORING')}
              </sl-switch>
            </div>
            <div class="col-md-6 col-12">
              <etools-dropdown-multi
                class="visit-goals"
                .selectedValues="${simplifyValue(this.activityVisitGoals)}"
                @etools-selected-items-changed="${({detail}: CustomEvent) =>
                  this.selectVisitGoal(detail.selectedItems)}"
                ?trigger-value-change-event="${this.isEditMode}"
                label="${translate('ACTIVITY_DETAILS.VISIT_GOALS')}"
                .options="${this.visitGoals.map((x: any) => ({
                  ...x,
                  itemTemplate: html` <style>
                      .tag .etools-info-tooltip {
                        display: none;
                      }
                    </style>
                    <div style="display: flex; align-items: center">
                      ${x.name}
                      <etools-info-tooltip hoist position="right" style="pointer-events: all">
                        <span slot="message"
                          ><ul>
                            ${x.info.map((text: string) => html`<li>${unsafeHTML(text)}</li>`)}
                          </ul></span
                        >
                      </etools-info-tooltip>
                    </div>`
                }))}"
                option-label="name"
                option-value="id"
                ?readonly="${!this.isEditMode}"
                ?invalid="${this.errors && this.errors.visitGoals}"
                .errorMessage="${this.errors && this.errors.visitGoals}"
                @focus="${() => this.resetFieldError('visit_goals')}"
                @click="${() => this.resetFieldError('visit_goals')}"
                allow-outside-scroll
                dynamic-align
              ></etools-dropdown-multi>
            </div>
            <div class="col-md-6 col-12">
              <etools-textarea
                label="${translate('ACTIVITY_DETAILS.OBJECTIVE')}"
                .value="${this.editedData.objective}"
                placeholder="&#8212;"
                ?readonly="${!this.isEditMode}"
                ?invalid="${this.errors && this.errors.visitGoals}"
                .errorMessage="${this.errors && this.errors.visitGoals}"
                @focus="${() => this.resetFieldError('visit_goals')}"
                @click="${() => this.resetFieldError('visit_goals')}"
                @value-changed="${({detail}: CustomEvent) => this.updateModelValue('objective', detail.value)}"
              >
              </etools-textarea>
            </div>
          </div>
        </div>
      </etools-card>
    `;
  }
  // || this.isFieldReadonly('goal_of_visit')
  getSpecialElements(container: HTMLElement): CommentElementMeta[] {
    const element: HTMLElement = container.shadowRoot!.querySelector('.card-container') as HTMLElement;
    const relatedTo: string = container.getAttribute('related-to') as string;
    const relatedToDescription = container.getAttribute('related-to-description') as string;
    return [{element, relatedTo, relatedToDescription}];
  }

  selectSections(sections: Section[]): void {
    if (JSON.stringify(sections) !== JSON.stringify(this.activitySections)) {
      this.activitySections = [...sections];
      this.updateModelValue('sections', sections);
    }
  }

  selectFacilityTypes(sections: Section[]): void {
    if (JSON.stringify(sections) !== JSON.stringify(this.activitySections)) {
      this.activitySections = [...sections];
      this.updateModelValue('facility_types', sections);
    }
  }

  selectOffices(offices: Office[]): void {
    if (JSON.stringify(offices) !== JSON.stringify(this.activityOffices)) {
      this.activityOffices = offices;
      this.updateModelValue('offices', offices);
    }
  }

  selectVisitGoal(visitGoals: Office[]): void {
    console.log(visitGoals, this.activityVisitGoals);
    if (JSON.stringify(visitGoals) !== JSON.stringify(this.activityVisitGoals)) {
      this.activityVisitGoals = visitGoals;
      this.updateModelValue('visit_goals', visitGoals);
    }
  }

  onChangeMapTab(tabName: string): void {
    this.activeTab = tabName;
  }

  getTabElement(): TemplateResult {
    switch (this.activeTab) {
      case SITE_TAB:
        return this.getMapBySite();
      case AREA_TAB:
        return this.getMapByArea();
      default:
        return html``;
    }
  }

  getMapBySite(): TemplateResult {
    return html`
      <location-sites-widget
        .selectedLocation="${simplifyValue(this.editedData.location)}"
        .selectedSites="${this.editedData.location_site ? [simplifyValue(this.editedData.location_site)] : []}"
        @sites-changed="${({detail}: CustomEvent) => {
          this.updateModelValue('location_site', detail.sites[0] || null);
        }}"
        @location-changed="${({detail}: CustomEvent) => {
          this.updateModelValue('location', detail.location);
        }}"
      ></location-sites-widget>
    `;
  }

  getMapByArea(): TemplateResult {
    return html`
      <location-widget
        .selectedLocation="${simplifyValue(this.editedData.location)}"
        .selectedSites="${this.editedData.location_site ? [simplifyValue(this.editedData.location_site)] : []}"
        @sites-changed="${({detail}: CustomEvent) => {
          this.updateModelValue('location_site', detail.sites[0] || null);
        }}"
        @location-changed="${({detail}: CustomEvent) => {
          this.updateModelValue('location', detail.location);
        }}"
      ></location-widget>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.locationsUnsubscribe = store.subscribe(
      staticDataDynamic(
        (locations: EtoolsLightLocation[] | undefined) => {
          if (!locations) {
            return;
          }
          this.locations = locations;
        },
        [LOCATIONS_ENDPOINT]
      )
    );

    this.sitesUnsubscribe = store.subscribe(
      sitesSelector((sites: Site[] | null) => {
        if (!sites) {
          return;
        }
        this.sitesList = sites;
      })
    );

    this.visitGoalsUnsubscribe = store.subscribe(
      visitGoalsSelector((visitGoals: VisitGoal[] | undefined) => {
        if (!visitGoals) {
          return;
        }
        this.visitGoals = visitGoals;
      })
    );

    const state: IRootState = store.getState();
    if (!state.specificLocations.data) {
      store.dispatch<AsyncEffect>(loadSiteLocations());
    }

    this.activeLanguageUnsubscribe = store.subscribe(
      activeLanguageSelector(() => (this.pageTabs = applyPageTabsTranslation(ACTIVITY_DETAILS_TABS)))
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.sitesUnsubscribe();
    this.visitGoalsUnsubscribe();
    this.locationsUnsubscribe();
    this.activeLanguageUnsubscribe();
  }

  isStartDateAfterEndDate(): boolean {
    const startDate: string = this.editedData.start_date || '';
    const endDate: string = this.editedData.end_date || '';
    if (startDate && endDate) {
      return dayjs(startDate).isSameOrBefore(endDate);
    } else {
      return !endDate || !startDate;
    }
  }

  protected save(): void {
    if (!this.editedData.location) {
      fireEvent(this, 'toast', {
        text: `${getTranslation('THIS_FIELD_IS_REQUIRED')}: ${getTranslation('LOCATION_TO_BE_VISITED')}`
      });
      return;
    }
    if (this.isStartDateAfterEndDate()) {
      super.save();
    } else {
      fireEvent(this, 'toast', {text: getTranslation('START_DATE_BEFORE_END_DATE')});
    }
  }

  protected startEdit(): void {
    super.startEdit();
    store.dispatch(new SetEditedDetailsCard(CARD_NAME));
  }
}
