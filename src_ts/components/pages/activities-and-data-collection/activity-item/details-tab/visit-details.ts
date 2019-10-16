import {
    css,
    CSSResult,
    customElement,
    html,
    LitElement,
    property,
    query,
    TemplateResult
} from 'lit-element';
import { translate } from '../../../../../localization/localisation';
import { LocationWidgetComponent } from '../../../../common/location-widget/location-widget';
import { DataMixin } from '../../../../common/mixins/data-mixin';
import { SectionsMixin } from '../../../../common/mixins/sections-mixin';
import { store } from '../../../../../redux/store';
import { sitesSelector } from '../../../../../redux/selectors/site-specific-locations.selectors';
import { staticDataDynamic } from '../../../../../redux/selectors/static-data.selectors';
import { LOCATIONS_ENDPOINT } from '../../../../../endpoints/endpoints-list';
import { Unsubscribe } from 'redux';
import { elevationStyles } from '../../../../styles/elevation-styles';
import { SharedStyles } from '../../../../styles/shared-styles';
import { FlexLayoutClasses } from '../../../../styles/flex-layout-classes';
import { CardStyles } from '../../../../styles/card-styles';
import { InputStyles } from '../../../../styles/input-styles';

@customElement('visit-details')
export class VisitDetails extends SectionsMixin(DataMixin<IActivityDetails, typeof LitElement>(LitElement)) {
    @property() public isReadonly: boolean = true;
    @property() public widgetOpened: boolean = false;
    @property() public location: string = '692';
    @property() public sites: number[] = [3];
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
            if (!sites) { return; }
            this.sitesList = sites;
        }));

        store.subscribe(staticDataDynamic((locations: EtoolsLightLocation[] | undefined) => {
            if (!locations) { return; }
            this.locations = locations;
        }, [LOCATIONS_ENDPOINT]));
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.sitesUnsubscribe();
    }

    public render(): TemplateResult {
        return html`
            ${InputStyles}
            <etools-card
                card-title="${ translate('ACTIVITY_ITEM.VISIT_DETAILS')}"
                is-editable
                ?edit="${!this.isReadonly}"
                @start-edit="${() => this.isReadonly = false}"
                @save="${() => this.isReadonly = true}"
                @cancel="${() => this.isReadonly = true}">
                <div slot="content" class="card-content">
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
                                .selectedLocation="${ this.location || null }"
                                .selectedSites="${ this.sites }"
                                @sites-changed="${ ({ detail }: CustomEvent) => { console.log('', detail.sites); this.sites = detail.sites; } }"
                                @location-changed="${ ({ detail }: CustomEvent) => { console.log('location', detail.location); this.location = detail.location; } }"></location-widget>
                        </iron-collapse>
                    </div>` : ''}

                    <div class="layout horizontal location-inputs">
                        <etools-dropdown
                            class="without-border readonly-required"
                            .selected="${ this.location }"
                            label="Location To Be Visited"
                            .options="${ this.locations }"
                            option-label="name"
                            option-value="id"
                            readonly disabled required
                            min-width="470px">
                        </etools-dropdown>

                        <etools-dropdown
                            class="without-border readonly-required"
                            .selected="${ this.sites[0] }"
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
                                month-input="07"
                                day-input="13"
                                year-input="1992"
                                label="${ translate('ACTIVITY_DETAILS.START_DATE')}"
                                ?disabled="${ this.isReadonly }"
                                ?readonly="${ this.isReadonly }"></datepicker-lite>
                            <datepicker-lite
                                class="without-border"
                                label="${ translate('ACTIVITY_DETAILS.END_DATE')}"
                                ?disabled="${ this.isReadonly }"
                                ?readonly="${ this.isReadonly }"></datepicker-lite>
                        </div>
                        <div class="layout horizontal flex">
                            <etools-dropdown-multi
                                class="without-border"
                                .selectedValues="${ this.editedData.sections }"
                                @etools-selected-items-changed="${({ detail }: CustomEvent) => this.updateModelValue('sections', detail.selectedItems)}"
                                trigger-value-change-event
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
                margin: 0 12px;
                color: var(--module-primary);
                background-color: var(--gray-06);
                text-transform: uppercase;
                font-weight: 500;
                font-size: 16px;
            }

            .widget-dropdown span,
            .widget-dropdown iron-icon.toggle-btn { cursor: pointer; }
        `];
    }
}
