import {LitElement, TemplateResult, html, property, query, customElement, css, CSSResultArray} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import {fireEvent} from '../../utils/fire-custom-event';

@customElement('lazy-list')
export class LazyList extends LitElement {
  @property() items: [] = [];
  @property() itemStyle: string = '';
  @property() itemTemplate?: () => TemplateResult;
  @query('#list') list!: HTMLElement;

  render(): TemplateResult {
    // language=HTML
    if (!this.itemTemplate) {
      return html`
        No item template
      `;
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
