import {css, CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../styles/card-styles';

const PARTNER_TAB: string = 'partner';
const CP_OUTPUT_TAB: string = 'cp-output';
const LOCATION_TAB: string = 'location';

@customElement('open-issues-action-points')
export class OpenIssuesActionPoints extends LitElement {
  pageTabs: PageTab[] = [
    {
      tab: PARTNER_TAB,
      tabLabel: 'By Partner',
      hidden: false
    },
    {
      tab: CP_OUTPUT_TAB,
      tabLabel: 'By CP Output',
      hidden: false
    },
    {
      tab: LOCATION_TAB,
      tabLabel: 'By Location',
      hidden: false
    }
  ];
  @property() activeTab: string = PARTNER_TAB;
  @property() tabElement: TemplateResult = this.getTabElement();

  render(): TemplateResult {
    return html`
      <section class="elevation page-content card-container" elevation="1">
        <div class="card-title-box with-bottom-line">
          <div class="card-title">Open Issues and Action Points</div>
        </div>
        <etools-tabs
          class="tabs-container"
          id="tabs"
          slot="tabs"
          .tabs="${this.pageTabs}"
          @iron-select="${({detail}: any) => this.onSelect(detail.item)}"
          .activeTab="${this.activeTab}"
        ></etools-tabs>
        <div class="layout vertical card-content">
          ${this.tabElement}
        </div>
      </section>
    `;
  }
  // TODO reduce copy-paste?
  onSelect(selectedTab: HTMLElement): void {
    const tabName: string = selectedTab.getAttribute('name') || '';
    if (this.activeTab === tabName) {
      return;
    }
    this.activeTab = tabName;
    this.tabElement = this.getTabElement();
  }

  getTabElement(): TemplateResult {
    switch (this.activeTab) {
      case PARTNER_TAB:
        return html`
          <open-issues-partnership-tab></open-issues-partnership-tab>
        `;
      case CP_OUTPUT_TAB:
        return html`
          <open-issues-cp-output-tab></open-issues-cp-output-tab>
        `;
      case LOCATION_TAB:
        return html`
          <open-issues-location-tab></open-issues-location-tab>
        `;
      default:
        return html``;
    }
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
