import {css, CSSResult, html, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * @LitElement
 * @customElement
 */
@customElement('page-content-header')
export class PageContentHeader extends LitElement {
  @property({type: Boolean, reflect: true, attribute: 'with-tabs-visible'})
  withTabsVisible = false;

  static get is(): string {
    return 'page-content-header';
  }

  static get styles(): CSSResult {
    // language=CSS
    return css`
      *[hidden] {
        display: none !important;
      }

      :host {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        flex: 1;

        background-color: var(--primary-background-color);
        padding: 0 24px;
        min-height: 85px;
        border-bottom: 1px solid var(--dark-divider-color);
      }

      :host([with-tabs-visible]) {
        min-height: 114px;
      }

      .content-header-row {
        display: flex;
        justify-content: flex-start;
      }

      .title-row {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        margin: var(--table-row-margin, 30px 0 0);
        padding: 0 24px;
        min-height: var(--table-row-height, 36px);
      }

      .title-row h1 {
        display: flex;
        margin: var(--title-margin);
        margin: 0;
        font-weight: normal;
        text-transform: capitalize;
        font-size: var(--etools-font-size-24, 24px);
        line-height: 1.3;
        min-height: 31px;
      }

      .title-row > .title-row-actions {
        flex: none;
        margin-inline-start: auto;
      }

      .tabs {
        margin-top: 5px;
      }

      @media print {
        :host {
          padding: 0;
          border-bottom: none;
          min-height: 0 !important;
          margin-bottom: 16px;
        }

        .title-row h1 {
          font-size: var(--etools-font-size-18, 18px);
        }
      }

      @media (max-width: 380px) {
        .title-row {
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-bottom: 3%;
        }
        .title-row h1 {
          font-size: var(--etools-font-size-18, 18px);
          width: 100%;
        }
      }

      @media print {
        slot[name='title-row-actions'] {
          display: none;
        }
      }
    `;
  }

  render(): TemplateResult {
    // language=HTML
    return html`
      <div class="content-header-row title-row">
        <h1>
          <slot name="page-title"></slot>
        </h1>
        <div class="title-row-actions">
          <slot name="title-row-actions"></slot>
        </div>
      </div>

      <div class="content-header-row tabs" ?hidden="${!this.withTabsVisible}">
        <slot name="tabs"></slot>
      </div>
    `;
  }
}
