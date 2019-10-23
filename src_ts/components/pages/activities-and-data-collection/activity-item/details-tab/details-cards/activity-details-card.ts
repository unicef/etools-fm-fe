import {
    css,
    CSSResult,
    customElement,
    html,
    property,
    query,
    TemplateResult
} from 'lit-element';
import { translate } from '../../../../../../localization/localisation';
import { LocationWidgetComponent } from '../../../../../common/location-widget/location-widget';
import { SectionsMixin } from '../../../../../common/mixins/sections-mixin';
import { store } from '../../../../../../redux/store';
import { sitesSelector } from '../../../../../../redux/selectors/site-specific-locations.selectors';
import { staticDataDynamic } from '../../../../../../redux/selectors/static-data.selectors';
import { LOCATIONS_ENDPOINT } from '../../../../../../endpoints/endpoints-list';
import { Unsubscribe } from 'redux';
import { elevationStyles } from '../../../../../styles/elevation-styles';
import { SharedStyles } from '../../../../../styles/shared-styles';
import { FlexLayoutClasses } from '../../../../../styles/flex-layout-classes';
import { CardStyles } from '../../../../../styles/card-styles';
import { InputStyles } from '../../../../../styles/input-styles';
import { simplifyValue } from '../../../../../utils/objects-diff';
import { formatDate } from '../../../../../utils/date-utility';
import { BaseDetailsCard } from './base-details-card';
import { SetEditedDetailsCard } from '../../../../../../redux/actions/activity-details.actions';

export const CARD_NAME: string = 'activity-details';

@customElement('activity-details-card')
export class ActivityDetailsCard extends SectionsMixin(BaseDetailsCard) {
    @property() public isReadonly: boolean = true;
    @property() public widgetOpened: boolean = false;
    @property() public sitesList: Site[] = [];
    @property() public locations: EtoolsLightLocation[] = [];

    @query('#locationWidget') private locationWidget!: LocationWidgetComponent;

    private sitesUnsubscribe!: Unsubscribe;

    public widgetToggle(): void {
        this.widgetOpened = !this.widgetOpened;
        if (!this.widgetOpened) { return; }
        this.locationWidget.updateMap();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.sitesUnsubscribe = store.subscribe(sitesSelector((sites: Site[] | null) => {
            if (!sites) {
                return;
            }
            this.sitesList = sites;
        }));

        store.subscribe(staticDataDynamic((locations: EtoolsLightLocation[] | undefined) => {
            if (!locations) {
                return;
            }
            this.locations = locations;
        }, [LOCATIONS_ENDPOINT]));
    }

    public startEdit(): void {
        super.startEdit();
        store.dispatch(new SetEditedDetailsCard(CARD_NAME));
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.sitesUnsubscribe();
    }

    public render(): TemplateResult {
        return html`
            ${InputStyles}
            <etools-card
                card-title="${ translate('ACTIVITY_DETAILS.ACTIVITY_DETAILS')}"
                ?is-editable="${!this.editedCard || this.editedCard === CARD_NAME}"
                ?edit="${!this.isReadonly}"
                @start-edit="${() => this.startEdit()}"
                @save="${() => this.save()}"
                @cancel="${() => this.cancel()}">
                <div slot="content" class="card-content">
                    <etools-loading ?active="${ this.isLoad }" loading-text="${ translate('MAIN.LOADING_DATA_IN_PROCESS') }"></etools-loading>
                    <etools-loading ?active="${ this.isUpdate }" loading-text="${ translate('MAIN.SAVING_DATA_IN_PROCESS') }"></etools-loading>
                    ${!this.isReadonly ? html`
                        <div class="widget-dropdown">
                            <div class="flex-auto">
                                <span class=" layout horizontal center" @tap="${ () => this.widgetToggle() }">
                                    <iron-icon icon="maps:map"></iron-icon>Select Location/Site with Widget
                                </span>
                            </div>
                            <iron-icon icon="expand-less" class="flex-none toggle-btn" ?hidden="${ !this.widgetOpened }"
                                @tap="${ () => this.widgetToggle() }"></iron-icon>
                            <iron-icon icon="expand-more" class="flex-none toggle-btn" ?hidden="${ this.widgetOpened }"
                                @tap="${ () => this.widgetToggle() }"></iron-icon>
                        </div>

                        <div class="widget-container">
                            <iron-collapse ?opened="${ this.widgetOpened }">
                                <location-widget
                                    id="locationWidget"
                                    .selectedLocation="${ simplifyValue(this.editedData.location) }"
                                    .selectedSites="${ this.editedData.location_site ?
                                        [simplifyValue(this.editedData.location_site)] : [] }"
                                    @sites-changed="${ ({ detail }: CustomEvent) => { this.updateModelValue('location_site', detail.sites[0] || null); } }"
                                    @location-changed="${ ({ detail }: CustomEvent) => { this.updateModelValue('location', detail.location); } }"></location-widget>
                            </iron-collapse>
                        </div>` : ''}

                        <div class="layout horizontal location-inputs">
                            <etools-dropdown
                                class="without-border readonly-required"
                                .selected="${ simplifyValue(this.editedData.location) }"
                                label="Location To Be Visited"
                                .options="${ this.locations }"
                                option-label="name"
                                option-value="id"
                                readonly disabled required
                                min-width="470px">
                            </etools-dropdown>

                            <etools-dropdown
                                class="without-border readonly-required"
                                .selected="${ simplifyValue(this.editedData.location_site) }"
                                label="Site To Be Visited"
                                .options="${ this.sitesList }"
                                option-label="name"
                                option-value="id"
                                readonly disabled
                                min-width="470px">
                            </etools-dropdown>
                        </div>
                    <div class="layout horizontal">
                        <div class="layout horizontal flex">
                            <datepicker-lite
                                class="without-border"
                                value="${this.editedData.start_date || ''}"
                                label="${ translate('ACTIVITY_DETAILS.START_DATE')}"
                                ?fire-date-has-changed="${!this.isReadonly}"
                                @date-has-changed="${ ({ detail }: CustomEvent) => this.updateModelValue('start_date', formatDate(detail.date))}}"
                                ?disabled="${ this.isReadonly }"
                                ?readonly="${ this.isReadonly }"></datepicker-lite>
                            <datepicker-lite
                                class="without-border"
                                value="${this.editedData.end_date || ''}"
                                ?fire-date-has-changed="${!this.isReadonly}"
                                @date-has-changed="${ ({ detail }: CustomEvent) => this.updateModelValue('end_date', formatDate(detail.date))}}"
                                label="${ translate('ACTIVITY_DETAILS.END_DATE')}"
                                ?disabled="${ this.isReadonly }"
                                ?readonly="${ this.isReadonly }"></datepicker-lite>
                        </div>
                        <div class="layout horizontal flex">
                            <etools-dropdown-multi
                                class="without-border"
                                .selectedValues="${ simplifyValue(this.editedData.sections || []) }"
                                @etools-selected-items-changed="${({ detail }: CustomEvent) => this.updateModelValue('sections', detail.selectedItems)}"
                                ?trigger-value-change-event="${!this.isReadonly}"
                                label="${ translate('ACTIVITY_DETAILS.SECTIONS') }"
                                .options="${ this.sections }"
                                option-label="name"
                                option-value="id"
                                ?disabled="${ this.isReadonly }"
                                ?readonly="${ this.isReadonly }"
                                ?invalid="${ this.errors && this.errors.sections }"
                                .errorMessage="${ this.errors && this.errors.sections }"
                                @focus="${ () => this.resetFieldError('sections') }"
                                @tap="${ () => this.resetFieldError('sections') }"
                                allow-outside-scroll
                                dynamic-align></etools-dropdown-multi>
                        </div>
                    </div>
                </div>
            </etools-card>`;
    }

    public static get styles(): CSSResult[] {
        // language=CSS
        return [elevationStyles, SharedStyles, FlexLayoutClasses, CardStyles, css`
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
            .widget-dropdown iron-icon.toggle-btn { cursor: pointer; }

            etools-loading { z-index: 9999; }
            datepicker-lite { white-space: nowrap; }
        `];
    }
}
