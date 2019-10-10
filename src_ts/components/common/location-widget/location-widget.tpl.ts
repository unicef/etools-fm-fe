import { LocationWidgetComponent } from './location-widget';
import { html, TemplateResult } from 'lit-element';

export function template(this: LocationWidgetComponent): TemplateResult {
    return html`

        <div class="widget-container">

            <div class="history" ?hidden="${ !this.history.length }">
                ${ this.history.map((location: WidgetLocation, index: number) => html`
                    <paper-input
                            label="${ this.getHistoryInputLabel(location.gateway) }"
                            value="${ this.getLocationPart(location.name, 'name') }"
                            readonly
                            inline>
                        <div ?hidden="${ this.loadingInProcess }" slot="suffix" @tap="${ () => this.removeFromHistory(index) }" class="close-btn"><span>&#10008;</span></div>
                    </paper-input>
                `) }
            </div>

            <div class="map-and-list">
                <div id="map"></div>
                <div class="list">
                    <paper-input
                            class="search-input"
                            type="search"
                            value="${ this.locationSearch }"
                            @value-changed="${ ({ detail }: CustomEvent) => this.locationSearch = detail.value }"
                            placeholder="Search"
                            ?readonly="${ this.loadingInProcess }"
                            inline>
                        <iron-icon icon="search" slot="prefix"></iron-icon>
                    </paper-input>

                    <div class="locations-list">
                        ${ this.getListItems(this.currentList, this.loadingInProcess)
                                    .filter((item: Site | WidgetLocation) => this.locationsFilter(item))
                                    .map((location: Site | WidgetLocation) => location.hasOwnProperty('geom') ?
                                        html`
                                            <div class="location-line" @tap="${() => this.onLocationLineClick(location as WidgetLocation) }">
                                                <div class="location-name">
                                                    <b>${ this.getLocationPart(location.name, 'name') }</b>
                                                    <span class="location-code">${ this.getLocationPart(location.name, 'code') }</span>
                                                </div>
                                                <div class="gateway-name">${ (location as WidgetLocation).gateway.name }</div>
                                                <div class="deselect-btn"><span>&#10008;</span></div>
                                            </div>
                                        ` : html`
                                            <div class="site-line ${ this.getSiteLineClass(location.id) }"
                                                     @tap="${ () => this.onSiteLineClick(location as Site) }" @mouseenter="${ () => this.onSiteHoverStart(location as Site) }" @mouseleave="${ () => this.onSiteHoverEnd() }">
                                                <div class="location-name">
                                                    <b>${ location.name }</b>
                                                </div>
                                                <div class="gateway-name">Site</div>
                                                <div class="deselect-btn"><span>&#10008;</span></div>
                                            </div>
                                    `)
                        }

                        <div ?hidden="${ this.hideEmptySitesMessage(this.currentList, this.loadingInProcess) }" class="missing-sites">
                            There are no sites for this location.. <br> You can add missing sites in <a class="link" on-click="goToSettings">Settings</a>
                        </div>

                        <div class="no-search-results" ?hidden="${ this.loadingInProcess }">
                            No locations or sites found. <br> Please, change your search request
                        </div>

                        <etools-loading ?active="${ this.loadingInProcess }"></etools-loading>
                    </div>
                </div>
            </div>

        </div>
    `;
}
