import {LocationWidgetComponent} from './location-widget';
import {html, TemplateResult} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import './lazy-list';
import {updateAppLocation} from '../../../routing/routes';
import {translate} from 'lit-translate';

export function template(this: LocationWidgetComponent): TemplateResult {
  return html`
    <div class="widget-container">
      <div class="history" ?hidden="${!this.history.length}">
        ${this.history.map(
          (location: WidgetLocation, index: number) => html`
            <etools-input
              label="${this.getHistoryInputLabel(location.admin_level, location.admin_level_name)}"
              value="${this.getLocationPart(location.name, 'name')}"
              readonly
              inline
            >
              <div slot="suffix" @click="${() => this.removeFromHistory(index)}" class="close-btn">
                <span>&#10008;</span>
              </div>
            </etools-input>
          `
        )}
      </div>

      <div class="map-and-list">
        <div id="map"></div>
        <div class="list">
          <etools-input
            class="search-input"
            type="search"
            clearable
            always-float-label
            .value="${this.locationSearch}"
            @value-changed="${({detail}: CustomEvent<{value: string}>) => this.search(detail)}"
            placeholder="${translate('MAIN.SEARCH')}"
            inline
          >
            <etools-icon name="search" slot="prefix"></etools-icon>
          </etools-input>

          <div class="locations-list">
            ${!this.isSiteList
              ? html`
                  <lazy-list
                    .items="${this.items}"
                    .itemStyle="${this.itemStyle}"
                    .itemTemplate="${(location: WidgetLocation) => html`
                      <div class="location-line" @click="${() => this.onLocationLineClick(location)}">
                        <div class="location-name">
                          <b>${this.getLocationPart(location.name, 'name')}</b>
                          <span class="location-code">${this.getLocationPart(location.name, 'code')}</span>
                        </div>
                        <div class="gateway-name">${location.admin_level_name}</div>
                        <div class="deselect-btn"><span>&#10008;</span></div>
                      </div>
                    `}"
                    @nextPage="${() => this.loadNextItems()}"
                  ></lazy-list>
                `
              : html`
                  ${repeat(
                    this.sitesLocation,
                    (site: Site) => html`
                      <div
                        class="site-line ${this.getSiteLineClass(site.id)}"
                        @click="${() => this.onSiteLineClick(site)}"
                        @mouseenter="${() => this.onSiteHoverStart(site)}"
                        @mouseleave="${() => this.onSiteHoverEnd()}"
                      >
                        <div class="location-name">
                          <b>${site.name}</b>
                        </div>
                        <div class="gateway-name">${translate('LOCATION_WIDGET.GATEWAY_NAME')}</div>
                        <div class="deselect-btn"><span>&#10008;</span></div>
                      </div>
                    `
                  )}
                `}

            <div ?hidden="${!this.isSitesEmpty()}" class="missing-sites">
              ${translate('LOCATION_WIDGET.MISSING_SITES.NO_SITES')}<br />
              ${translate('LOCATION_WIDGET.MISSING_SITES.ADD_MISSING')}<a
                class="link"
                @click="${() => updateAppLocation('/management')}"
                >${translate('NAVIGATION_MENU.MANAGEMENT')}</a
              >
            </div>
            <div ?hidden="${!this.isSearchEmpty()}" class="no-search-results">
              ${translate('LOCATION_WIDGET.NO_SEARCH_RESULTS.NO_LOCATIONS')}<br />
              ${translate('LOCATION_WIDGET.NO_SEARCH_RESULTS.CHANGE_REQUEST')}
            </div>
            <etools-loading ?active="${this.loadingInProcess}"></etools-loading>
          </div>
        </div>
      </div>
    </div>
  `;
}
