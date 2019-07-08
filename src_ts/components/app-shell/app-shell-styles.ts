import {html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';

import {appDrawerStyles} from './menu/styles/app-drawer-styles';

export const AppShellStyles = html`
${appDrawerStyles}
<style>
  :host {
    display: block;
  }

  app-header-layout {
    position: relative;
  }

  .main-content {
    @apply --layout-flex;
  }

  .page {
    display: none;
  }

  .page[active] {
    display: block;
  }

</style>
`;
