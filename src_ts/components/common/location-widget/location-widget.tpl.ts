import {LocationWidgetComponent} from './location-widget';
import {html, TemplateResult} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import './lazy-list';

export function template(this: LocationWidgetComponent): TemplateResult {
  return html`
    <div class="widget-container">
      <div class="history" ?hidden="${!this.history.length}">
        ${this.history.map(
          (location: WidgetLocation, index: number) => html`
            <paper-input
              label="${this.getHistoryInputLabel(location.gateway)}"
              value="${this.getLocationPart(location.name, 'name')}"
              readonly
              inline
            >
              <div slot="suffix" @tap="${() => this.removeFromHistory(index)}" class="close-btn">
                <span>&#10008;</span>
              </div>
            </paper-input>
          `
        )}
      </div>

      <div class="map-and-list">
        <div id="map"></div>
        <div class="list">
          <paper-input
            class="search-input"
            type="search"
            .value="${this.locationSearch}"
            @value-changed="${({detail}: CustomEvent<{value: string}>) => this.search(detail)}"
            placeholder="Search"
            inline
          >
            <iron-icon icon="search" slot="prefix"></iron-icon>
          </paper-input>

          <div class="locations-list">
            ${!this.isLeaf
              ? html`
                  <lazy-list
                    .items="${this.items}"
                    .itemStyle="${this.itemStyle}"
                    .itemTemplate="${(location: WidgetLocation) => html`
                      <div class="location-line" @tap="${() => this.onLocationLineClick(location)}">
                        <div class="location-name">
                          <b>${this.getLocationPart(location.name, 'name')}</b>
                          <span class="location-code">${this.getLocationPart(location.name, 'code')}</span>
                        </div>
                        <div class="gateway-name">${location.gateway.name}</div>
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
                        @tap="${() => this.onSiteLineClick(site)}"
                        @mouseenter="${() => this.onSiteHoverStart(site)}"
                        @mouseleave="${() => this.onSiteHoverEnd()}"
                      >
                        <div class="location-name">
                          <b>${site.name}</b>
                        </div>
                        <div class="gateway-name">Site</div>
                        <div class="deselect-btn"><span>&#10008;</span></div>
                      </div>
                    `
                  )}
                `}

            <div ?hidden="${this.hideEmptySitesMessage(this.loadingInProcess)}" class="missing-sites">
              There are no sites for this location.. <br />
              You can add missing sites in <a class="link" on-click="goToSettings">Settings</a>
            </div>
            <etools-loading ?active="${this.loadingInProcess}"></etools-loading>
          </div>
        </div>
      </div>
    </div>
  `;
}
