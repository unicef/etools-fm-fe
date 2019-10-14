import { CSSResult, customElement, html, LitElement, property, query, TemplateResult } from 'lit-element';
import { elevationStyles } from '../../../styles/elevation-styles';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { translate } from '../../../../localization/localisation';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { CardStyles } from '../../../styles/card-styles';
import '../../../common/layout/etools-card/etools-card';
import '../../../common/location-widget/location-widget';
import { LocationWidgetComponent } from '../../../common/location-widget/location-widget';
import { store } from '../../../../redux/store';
import { sitesSelector } from '../../../../redux/selectors/site-specific-locations.selectors';
import { Unsubscribe } from 'redux';
import { staticDataDynamic } from '../../../../redux/selectors/static-data.selectors';
import { LOCATIONS_ENDPOINT } from '../../../../endpoints/endpoints-list';
import { InputStyles } from '../../../styles/input-styles';

@customElement('activity-details-tab')
export class ActivityDetailsTab extends LitElement {
    @property()
    public edit: GenericObject = {
        visitDetails: false
    };
    @property()
    public location: string = '692';
    @property() public sites: number[] = [3];
    @property() public widgetOpened: boolean = false;
    @property() public sitesList: Site[] = [];
    @property() public locations: EtoolsLightLocation[] = [];
    @query('#locationWidget') private locationWidget!: LocationWidgetComponent;

    private sitesUnsubscribe!: Unsubscribe;

    // language=HTML
    public render(): TemplateResult {
        return html`
            ${InputStyles}
            <style>
                .activity-details div.card-content {
                    padding: 23px 26px;
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
            </style>
            <etools-card
                class="page-content"
                title="${ translate('ACTIVITY_ITEM.VISIT_DETAILS')}"
                is-editable
                @save="${() => console.log('save')}"
                @cancel="${() => console.log('cancel')}">
                <div slot="content">
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

                    </div>

                     <div class="layout horizontal location-inputs">
                        <etools-dropdown
                                class="without-border readonly-required"
                                .selected="${ this.location }"
                                label="Location To Be Visited"
                                placeholder="Select Location in Widget"
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
                                placeholder="Select Site in Widget"
                                .options="${ this.sitesList }"
                                option-label="name"
                                option-value="id"
                                readonly disabled
                                min-width="470px">
                        </etools-dropdown>
                    </div>
                </div>
            </etools-card>
            <section class="elevation card-container page-content" elevation="1">
                <div class="card-title-box with-bottom-line">${ translate('ACTIVITY_ITEM.MONITOR_INFO')}</div>
                <div class="card-content layout vertical">
                </div>
            </section>
            <section class="elevation card-container page-content" elevation="1">
                <div class="card-title-box with-bottom-line">${ translate('ACTIVITY_ITEM.ENTRIES_TO_MONITOR')}</div>
                <div class="card-content layout vertical">
                </div>
            </section>
            `;
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

    public widgetToggle(): void {
        this.widgetOpened = !this.widgetOpened;
        if (!this.widgetOpened) { return; }
        this.locationWidget.updateMap();
    }

    public static get styles(): CSSResult[] {
        return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles];
    }
}
