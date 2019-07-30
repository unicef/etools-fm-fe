import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@polymer/polymer/lib/elements/dom-if';
import '@polymer/paper-styles/element-styles/paper-material-styles';
import '@polymer/paper-button/paper-button';

import {SharedStyles} from '../../styles/shared-styles';
import '../../common/layout/page-content-header/page-content-header';
import {property} from '@polymer/decorators';
import '../../common/layout/etools-tabs';
import {pageContentHeaderSlottedStyles} from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import '../../common/layout/status/etools-status';
import {pageLayoutStyles} from '../../styles/page-layout-styles';

import {GenericObject} from '../../../types/globals';
import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../../redux/store';
import {updateAppLocation} from '../../../routing/routes';

/**
 * @polymer
 * @customElement
 */
class EngagementTabs extends connect(store)(PolymerElement) {

  public static get template() {
    // main template
    // language=HTML
    return html`
      ${SharedStyles} ${pageContentHeaderSlottedStyles} ${pageLayoutStyles}
      <style include="paper-material-styles"></style>

      <etools-status></etools-status>

      <page-content-header with-tabs-visible>
      
        <h1 slot="page-title">[[engagement.title]]</h1>

        <div slot="title-row-actions" class="content-header-actions">
          <paper-button raised>Action 1</paper-button>
          <paper-button raised>Action 2</paper-button>
        </div>

        <etools-tabs slot="tabs"
                     tabs="[[pageTabs]]"
                     active-tab="{{activeTab}}"></etools-tabs>
      </page-content-header>
      
      <section class="paper-material page-content" elevation="1">
        <template is="dom-if" if="[[isActiveTab(activeTab, 'details')]]">
          <engagement-details></engagement-details>
        </template>
        
        <template is="dom-if" if="[[isActiveTab(activeTab, 'questionnaires')]]">
          <engagement-questionnaires></engagement-questionnaires>
        </template>
      </section>
    `;
  }

  @property({type: Array})
  pageTabs = [
    {
      tab: 'details',
      tabLabel: 'Details',
      hidden: false
    },
    {
      tab: 'questionnaires',
      tabLabel: 'Questionnaires‎',
      hidden: false
    }
  ];

  @property({type: String, observer: 'tabChanged'})
  activeTab: string = 'details';

  @property({type: Object})
  engagement: GenericObject = {
    id: null,
    title: 'Engagement title'
  };

  isActiveTab(tab: string, expectedTab: string): boolean {
    return tab === expectedTab;
  }

  public stateChanged(state: RootState) {
    // update page route data
    if (state.app!.routeDetails.routeName === 'engagements' &&
        state.app!.routeDetails.subRouteName !== 'list') {
      this.activeTab = state.app!.routeDetails.subRouteName as string;
      const engagementId = state.app!.routeDetails.params!.engagementId;
      if (engagementId) {
        this.engagement.id = engagementId;
      }
    }
  }

  tabChanged(newTabName: string, oldTabName: string | undefined) {
    if (oldTabName === undefined) {
      // page load, tab init, component is gonna be imported in loadPageComponents action
      return;
    }
    if (newTabName !== oldTabName) {
      // go to new tab
      updateAppLocation(
          `engagements/${this.engagement.id}/${newTabName}`, true);
    }
  }

}

window.customElements.define('engagement-tabs', EngagementTabs);
