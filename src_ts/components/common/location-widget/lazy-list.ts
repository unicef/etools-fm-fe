import {html, css, LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

@customElement('lazy-list')
export class LazyList extends LitElement {
  @property() items: [] = [];
  @property() itemStyle = '';
  @property() itemTemplate?: () => TemplateResult;
  @query('#list') list!: HTMLElement;

  render(): TemplateResult {
    // language=HTML
    if (!this.itemTemplate) {
      return html` No item template `;
    }
    return html`
      <style>
        ${this.itemStyle}
      </style>
      <div id="list" class="list-container" @scroll="${() => this.onScroll()}">
        ${repeat(this.items, this.itemTemplate)}
      </div>
    `;
  }

  onScroll(): void {
    if (this.list.scrollTop + this.list.clientHeight >= this.list.scrollHeight) {
      fireEvent(this, 'nextPage');
    }
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      css`
        :host {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .list-container {
          display: flex;
          flex-flow: column;
          flex: 1;
          overflow: hidden auto;
        }
      `
    ];
  }
}
