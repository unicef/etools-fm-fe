import {css, CSSResult, customElement, html, LitElement, property, query, TemplateResult} from 'lit-element';
import '@polymer/paper-tabs/paper-tabs';
import '@polymer/paper-tabs/paper-tab';
import {PaperTabsElement} from '@polymer/paper-tabs/paper-tabs';
// import { store } from '../../../redux/store';
// import { routeDetailsSelector } from '../../../redux/selectors/app.selectors';
// import { Unsubscribe } from 'redux';

/**
 * @LitElement
 * @customElement
 */

@customElement('etools-tabs')
export class EtoolsTabs extends LitElement {
  @property({type: String})
  activeTab: string = '';

  @property({type: Array})
  tabs!: GenericObject[];

  @query('#tabs') tabsElement!: PaperTabsElement;

  // private routeDetailsUnsubscribe!: Unsubscribe;

  static get styles(): CSSResult {
    // language=CSS
    return css`
      *[hidden] {
        display: none !important;
      }

      :host {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
      }

      :host([border-bottom]) {
        border-bottom: 1px solid var(--dark-divider-color);
      }

      paper-tabs {
        --paper-tabs-selection-bar-color: var(--primary-color);
      }

      paper-tab[link],
      paper-tab {
        --paper-tab-ink: var(--primary-color);
        padding: 0 24px;
      }

      paper-tab .tab-content {
        color: var(--secondary-text-color);
        text-transform: uppercase;
      }

      paper-tab.iron-selected .tab-content {
        color: var(--primary-color);
      }

      @media print {
        :host {
          display: none;
        }
      }
    `;
  }

  render(): TemplateResult {
    // main template
    // language=HTML
    return html`
      <paper-tabs id="tabs" .selected="${this.activeTab}" attr-for-selected="name" noink>
        ${this.tabs.map((item: GenericObject) => this.getTabHtml(item))}
      </paper-tabs>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // this.routeDetailsUnsubscribe = store.subscribe(routeDetailsSelector(() => setTimeout(() => this.updateTabs())));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    // this.routeDetailsUnsubscribe();
  }

  updateTabs(): void {
    if (!this.tabsElement) {
      return;
    }
    this.tabsElement.updateStyles();
    this.tabsElement.notifyResize();
  }

  getTabHtml(item: any): TemplateResult {
    return html`
      <paper-tab name="${item.tab}" link ?hidden="${item.hidden}">
        <span class="tab-content">
          ${item.tabLabel}
          ${item.showTabCounter
            ? html`
                ${item.counter}
              `
            : ''}
        </span>
      </paper-tab>
    `;
  }
}
