import '@polymer/iron-flex-layout/iron-flex-layout';

import { appDrawerStyles } from './menu/styles/app-drawer-styles';
import { html, TemplateResult } from 'lit-element';

export const AppShellStyles: TemplateResult = html`
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
