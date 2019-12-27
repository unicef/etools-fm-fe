import {html, TemplateResult} from 'lit-element';
import {ActivityDetailsCard, CARD_NAME} from './activity-details-card';
import {InputStyles} from '../../../../../../styles/input-styles';
import {translate} from '../../../../../../../localization/localisation';
import {simplifyValue} from '../../../../../../utils/objects-diff';
import {formatDate} from '../../../../../../utils/date-utility';
import '@unicef-polymer/etools-date-time/datepicker-lite';

const ELEMENT_FIELDS: (keyof IActivityDetails)[] = ['sections', 'end_date', 'start_date', 'location_site', 'location'];

export function template(this: ActivityDetailsCard): TemplateResult {
  return html`
    ${InputStyles}
    <etools-card
      card-title="${translate('ACTIVITY_DETAILS.ACTIVITY_DETAILS')}"
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
              <div class="widget-dropdown">
                <!--      Title        -->
                <div class="flex-auto">
                  <span class=" layout horizontal center" @tap="${() => this.widgetToggle()}">
                    <iron-icon icon="maps:map"></iron-icon>Select Location/Site with Widget
                  </span>
                </div>

                <!--      Icon        -->
                <iron-icon
                  icon="${this.widgetOpened ? 'expand-less' : 'expand-more'}"
                  class="flex-none toggle-btn"
                  ?hidden="${!this.widgetOpened}"
                  @tap="${() => this.widgetToggle()}"
                ></iron-icon>
              </div>

              <!--    Widget     -->
              <div class="widget-container">
                <iron-collapse ?opened="${this.widgetOpened}">
                  <location-widget
                    id="locationWidget"
                    .selectedLocation="${simplifyValue(this.editedData.location)}"
                    .selectedSites="${this.editedData.location_site
                      ? [simplifyValue(this.editedData.location_site)]
                      : []}"
                    @sites-changed="${({detail}: CustomEvent) => {
                      this.updateModelValue('location_site', detail.sites[0] || null);
                    }}"
                    @location-changed="${({detail}: CustomEvent) => {
                      this.updateModelValue('location', detail.location);
                    }}"
                  ></location-widget>
                </iron-collapse>
              </div>
            `
          : ''}

        <!--    Inputs for displaying Location and Site fields    -->
        <div class="layout horizontal location-inputs">
          <etools-dropdown
            class="without-border readonly-required"
            .selected="${simplifyValue(this.editedData.location)}"
            label="Location To Be Visited"
            .options="${this.locations}"
            option-label="name"
            option-value="id"
            readonly
            disabled
            required
            min-width="470px"
          >
          </etools-dropdown>

          <etools-dropdown
            class="without-border readonly-required"
            .selected="${simplifyValue(this.editedData.location_site)}"
            label="Site To Be Visited"
            .options="${this.sitesList}"
            option-label="name"
            option-value="id"
            readonly
            disabled
            min-width="470px"
          >
          </etools-dropdown>
        </div>

        <!--     Start Date and End Date inputs     -->
        <div class="layout horizontal">
          <div class="layout horizontal flex">
            <datepicker-lite
              class="without-border"
              value="${this.editedData.start_date || ''}"
              label="${translate('ACTIVITY_DETAILS.START_DATE')}"
              ?fire-date-has-changed="${this.isEditMode}"
              @date-has-changed="${({detail}: CustomEvent) =>
                this.updateModelValue('start_date', formatDate(detail.date))}"
              ?disabled="${!this.isEditMode || this.isFieldReadonly('start_date')}"
              ?readonly="${!this.isEditMode || this.isFieldReadonly('start_date')}"
              .invalid="${this.validateDatepicker()}"
            ></datepicker-lite>
            <datepicker-lite
              class="without-border"
              value="${this.editedData.end_date || ''}"
              ?fire-date-has-changed="${this.isEditMode}"
              @date-has-changed="${({detail}: CustomEvent) =>
                this.updateModelValue('end_date', formatDate(detail.date))}}"
              label="${translate('ACTIVITY_DETAILS.END_DATE')}"
              ?disabled="${!this.isEditMode || this.isFieldReadonly('end_date')}"
              ?readonly="${!this.isEditMode || this.isFieldReadonly('end_date')}"
              .invalid="${this.validateDatepicker()}"
            ></datepicker-lite>
          </div>

          <!--     Sections dropdown     -->
          <div class="layout horizontal flex">
            <etools-dropdown-multi
              class="without-border"
              .selectedValues="${simplifyValue(this.activitySections)}"
              @etools-selected-items-changed="${({detail}: CustomEvent) => this.selectSections(detail.selectedItems)}"
              ?trigger-value-change-event="${this.isEditMode}"
              label="${translate('ACTIVITY_DETAILS.SECTIONS')}"
              .options="${this.sections.length ? this.sections : this.activitySections}"
              option-label="name"
              option-value="id"
              ?disabled="${!this.isEditMode || this.isFieldReadonly('sections')}"
              ?readonly="${!this.isEditMode || this.isFieldReadonly('sections')}"
              ?invalid="${this.errors && this.errors.sections}"
              .errorMessage="${this.errors && this.errors.sections}"
              @focus="${() => this.resetFieldError('sections')}"
              @tap="${() => this.resetFieldError('sections')}"
              allow-outside-scroll
              dynamic-align
            ></etools-dropdown-multi>
          </div>
        </div>
      </div>
    </etools-card>
  `;
}
