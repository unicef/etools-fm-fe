import {css, CSSResult} from 'lit-element';

// language=CSS
export const AppShellStyles: CSSResult = css`
  :host {
    display: block;
  }

  app-header-layout {
    position: relative;
  }

  .main-content {
    flex: 1;
  }

  @media print {
    #pageheader,
    #drawer {
      display: none;
    }

    app-drawer-layout:not([small-menu]) {
      --app-drawer-width: 0;
    }

    :host {
      --secondary-background-color: #fff;
    }
  }
`;
