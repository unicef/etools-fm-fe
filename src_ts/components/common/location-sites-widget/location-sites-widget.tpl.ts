import {LocationSitesWidgetComponent} from './location-sites-widget';
import {html, TemplateResult} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import {updateAppLocation} from '../../../routing/routes';
import {translate} from 'lit-translate';

export function template(this: LocationSitesWidgetComponent): TemplateResult {
  return html`
    <div class="widget-container">
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
            ${repeat(
              this.sitesList,
              (site: Site) => html`
                <div
                  class="site-line ${this.getSiteLineClass(site.id)}"
                  @mouseenter="${() => this.onSiteHoverStart(site)}"
                >
                  <div class="location-name" @tap="${() => this.onSiteLineClick(site)}">
                    <b>${site.name}</b>
                  </div>
                  <div class="deselect-btn" @tap="${(event: CustomEvent) => this.onRemoveSiteClick(event)}">
                    <span>&#10008;</span>
                  </div>
                </div>
              `
            )}
            <div ?hidden="${this.hasSites}" class="missing-sites">
              ${translate('LOCATION_WIDGET.MISSING_SITES.NO_SITES')}<br />
              ${translate('LOCATION_WIDGET.MISSING_SITES.ADD_MISSING')}<a
                class="link"
                @click="${() => updateAppLocation('/settings')}"
                >${translate('NAVIGATION_MENU.SETTINGS')}</a
              >
            </div>
            <etools-loading ?active="${this.loadingInProcess}"></etools-loading>
          </div>
        </div>
      </div>
    </div>
  `;
}
