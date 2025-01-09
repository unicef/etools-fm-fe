import {LocationSitesWidgetComponent} from './location-sites-widget';
import {html, TemplateResult} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {updateAppLocation} from '../../../routing/routes';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';

export function template(this: LocationSitesWidgetComponent): TemplateResult {
  return html`
    <div class="widget-container">
      <div class="map-and-list row">
        <div id="map" class="col-md-6 col-12"></div>
        <div class="list col-md-6 col-12 sites-panel">
          <etools-input
            class="search-input"
            type="search"
            clearable
            .value="${this.locationSearch}"
            @value-changed="${({detail}: CustomEvent<{value: string}>) => this.search(detail)}"
            placeholder="${translate('MAIN.SEARCH')}"
            inline
          >
            <etools-icon name="search" slot="prefix"></etools-icon>
          </etools-input>

          <div class="locations-list layout-vertical">
            ${repeat(
              this.sitesList || [],
              (site: Site) => html`
                <div
                  class="site-line ${this.getSiteLineClass(site.id)}"
                  @mouseenter="${() => this.onSiteHoverStart(site)}"
                >
                  <div class="location-name" @click="${() => this.onSiteLineClick(site)}">
                    <b>${site.name}</b>
                  </div>
                  <div class="deselect-btn" @click="${(event: CustomEvent) => this.onRemoveSiteClick(event)}">
                    <span>&#10008;</span>
                  </div>
                </div>
              `
            )}
            <div ?hidden="${this.hasSites}" class="missing-sites">
              ${translate('LOCATION_WIDGET.MISSING_SITES.NO_SITES')}<br />
              ${translate('LOCATION_WIDGET.MISSING_SITES.ADD_MISSING')}<a
                class="link"
                @click="${() => updateAppLocation('/management/sites')}"
                >${translate('NAVIGATION_MENU.MANAGEMENT')}</a
              >
            </div>
            <etools-loading ?active="${this.loadingInProcess}"></etools-loading>
          </div>
        </div>
      </div>
    </div>
  `;
}
