import {css, html, CSSResult, customElement, property, TemplateResult} from 'lit-element';
import {template} from './activity-details-card.tpl';
import {SectionsMixin} from '../../../../../../common/mixins/sections-mixin';
import {store} from '../../../../../../../redux/store';
import {sitesSelector} from '../../../../../../../redux/selectors/site-specific-locations.selectors';
import {staticDataDynamic} from '../../../../../../../redux/selectors/static-data.selectors';
import {LOCATIONS_ENDPOINT} from '../../../../../../../endpoints/endpoints-list';
import {Unsubscribe} from 'redux';
import {elevationStyles} from '../../../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../../../styles/shared-styles';
import {FlexLayoutClasses} from '../../../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../../../styles/card-styles';
import {BaseDetailsCard} from '../base-details-card';
import {SetEditedDetailsCard} from '../../../../../../../redux/actions/activity-details.actions';
import {loadSiteLocations} from '../../../../../../../redux/effects/site-specific-locations.effects';
import clone from 'ramda/es/clone';
import {fireEvent} from '../../../../../../utils/fire-custom-event';
import {OfficesMixin} from '../../../../../../common/mixins/offices-mixin';
import {simplifyValue} from '../../../../../../utils/objects-diff';
import {translate} from 'lit-translate';

export const CARD_NAME = 'activity-details';
const SITE_TAB = 'SITE_TAB';
const AREA_TAB = 'AREA_TAB';

@customElement('activity-details-card')
export class ActivityDetailsCard extends OfficesMixin(SectionsMixin(BaseDetailsCard)) {
  @property() widgetOpened = false;
  @property() sitesList: Site[] = [];
  @property() locations: EtoolsLightLocation[] = [];

  @property() activitySections: Section[] = [];
  @property() activityOffice: Office | null = null;
  @property({type: String}) activeTab = SITE_TAB;

  private sitesUnsubscribe!: Unsubscribe;
  private locationsUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    return template.call(this);
  }

  set data(data: IActivityDetails) {
    super.data = data;
    this.activitySections = data ? clone(data.sections) : [];
    this.activityOffice = data ? clone(data.field_office) : null;
  }

  selectSections(sections: Section[]): void {
    if (JSON.stringify(sections) !== JSON.stringify(this.activitySections)) {
      this.activitySections = [...sections];
      this.updateModelValue('sections', sections);
    }
  }

  selectOffices(office: Office): void {
    if (JSON.stringify(office) !== JSON.stringify(this.activityOffice)) {
      this.activityOffice = office;
      this.updateModelValue('field_office', office);
    }
  }

  onChangeMapTab(selectedTab: HTMLElement): void {
    const tabName: string = selectedTab.getAttribute('name') || '';
    this.activeTab = tabName;
  }

  getTabList(): PageTab[] {
    return [
      {
        tab: SITE_TAB,
        tabLabel: translate('ACTIVITY_DETAILS.MAP_SELECT_LOCATION_BY_SITE'),
        hidden: false
      },
      {
        tab: AREA_TAB,
        tabLabel: translate('ACTIVITY_DETAILS.MAP_SELECT_LOCATION_BY_ADMIN_LEVEL'),
        hidden: false
      }
    ];
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

    const state: IRootState = store.getState();
    if (!state.specificLocations.data) {
      store.dispatch<AsyncEffect>(loadSiteLocations());
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.sitesUnsubscribe();
    this.locationsUnsubscribe();
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
    if (this.isStartDateAfterEndDate()) {
      super.save();
    } else {
      fireEvent(this, 'toast', {text: 'Start Date must be before End Date'});
    }
  }

  protected startEdit(): void {
    super.startEdit();
    store.dispatch(new SetEditedDetailsCard(CARD_NAME));
  }

  static get styles(): CSSResult[] {
    // language=CSS
    return [
      elevationStyles,
      SharedStyles,
      FlexLayoutClasses,
      CardStyles,
      css`
        .datepicker-width {
          flex-basis: 30%;
        }
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
          font-size: 16px;
        }

        .widget-dropdown span,
        .widget-dropdown iron-icon.toggle-btn {
          cursor: pointer;
        }

        etools-loading {
          z-index: 9999;
        }
        datepicker-lite {
          white-space: nowrap;
        }
        .field-office {
          width: 30%;
        }
      `
    ];
  }
}
