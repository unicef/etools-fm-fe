import {css, CSSResult, LitElement, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../../../../common/progressbar/column-item-progress-bar';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../styles/card-styles';
import {store} from '../../../../../redux/store';
import {SwitchTab} from '../../../../../redux/actions/monitoring-activity.actions';
import '@unicef-polymer/etools-modules-common/dist/layout/etools-tabs';

@customElement('shared-section-with-tabs-template')
export class SharedSectionWithTabsTemplate extends LitElement {
  @property() sectionTitle!: string;
  @property() pageTabs!: PageTab[];
  @property() activeTab!: string;
  @property() tabContentMap: Map<string, TemplateResult> = new Map();
  @property() tabElement: TemplateResult = this.getTabElement();

  render(): TemplateResult {
    return html`
      <section class="elevation page-content card-container" elevation="1">
        <div class="card-title-box with-bottom-line">
          <div class="card-title">${this.sectionTitle}</div>
        </div>
        <etools-tabs-lit
          class="tabs-container"
          id="tabs"
          slot="tabs"
          .tabs="${this.pageTabs}"
          @sl-tab-show="${({detail}: any) => this.onSelect(detail.name)}"
          .activeTab="${this.activeTab}"
        ></etools-tabs-lit>
        <div class="layout vertical card-content">${this.tabElement}</div>
      </section>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.tabElement = this.getTabElement();
  }

  onSelect(tabName: string): void {
    if (this.activeTab === tabName) {
      return;
    }
    this.activeTab = tabName;
    this.tabElement = this.getTabElement();
    store.dispatch(new SwitchTab(this.activeTab));
  }

  getTabElement(): TemplateResult {
    return this.tabContentMap.get(this.activeTab) || html``;
  }

  static get styles(): CSSResult[] {
    const monitoringTabStyles: CSSResult = css`
      .tabs-container {
        border-bottom: 1px solid lightgrey;
      }
    `;
    return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, monitoringTabStyles];
  }
}
