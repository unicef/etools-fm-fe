import {LitElement, TemplateResult, html, property, query, customElement, CSSResult, css} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import {getLocationPart} from '../../utils/get-location-part';
import {store} from '../../../redux/store';
import {loadLocationsChunk} from '../../../redux/effects/widget-locations.effects';
import {widgetLocationsItems} from '../../../redux/selectors/widget-locations.selectors';

@customElement('lazy-list')
export class LazyList extends LitElement {
  @property() items: WidgetLocation[] = [];
  @query('#list') list?: HTMLElement;

  connectedCallback(): void {
    super.connectedCallback();
    store.dispatch<AsyncEffect>(loadLocationsChunk());
    store.subscribe(
      widgetLocationsItems((items: WidgetLocation[]) => {
        this.items = items;
      })
    );
  }

  render(): TemplateResult {
    // language=HTML
    return html`
      <div id="list" class="list-container" @scroll="${() => this.onScroll()}">
        ${repeat(
          this.items,
          (location: WidgetLocation) => html`
            <div class="location-item" @tap="${() => this.onLocationLineClick(location)}">
              <div class="location-name">
                <b>${this.getLocationPart(location.name, 'name')}</b>
                <span class="location-code">${this.getLocationPart(location.name, 'code')}</span>
              </div>
              <div class="gateway-name">${location.gateway.name}</div>
              <div class="deselect-btn"><span>&#10008;</span></div>
            </div>
          `
        )}
      </div>
    `;
  }

  onScroll(): void {
    if (!this.list) {
      return;
    }
    if (this.list.scrollTop + this.list.clientHeight >= this.list.scrollHeight) {
      this.load();
    }
  }

  load(): void {
    console.log('next');
    const nextUrl: string | null = (store.getState() as IRootState).widgetLocations.nextUrl;
    if (nextUrl) {
      store.dispatch<AsyncEffect>(loadLocationsChunk());
    }
  }

  onLocationLineClick(location: WidgetLocation): void {
    dispatchEvent(new CustomEvent('location-change', {detail: location}));
  }

  getLocationPart(location: string = '', partToSelect: string): string {
    return getLocationPart(location, partToSelect);
  }

  static get styles(): CSSResult {
    // language=CSS
    return css`
      :host {
        display: flex;
        flex: 1;
      }

      .list-container {
        display: flex;
        flex-flow: column;
        flex: 1;
        position: relative;
        overflow: hidden;
        overflow-y: auto;
        height: calc(100% - 43px);
      }

      .location-item {
        position: relative;
        display: flex;
        padding: 5px;
        margin-bottom: 2px;
      }

      .location-item:last-child {
        margin-bottom: 0;
      }

      .location-item:hover {
        background-color: var(--gray-06);
        cursor: pointer;
      }

      .gateway-name {
        flex: none;
        width: 100px;
        color: var(--gray-light);
      }

      .location-name {
        flex: auto;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
      }

      .deselect-btn {
        flex: none;
        width: 50px;
        text-align: center;
        color: #dd0000;
      }

      .deselect-btn span {
        display: none;
      }

      .location-item.selected .deselect-btn {
        background-color: #f3e5bf;
      }

      .location-item.selected .deselect-btn span {
        display: inline;
      }
    `;
  }
}
