import {css, CSSResult} from 'lit';

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

  etools-loading {
    position: fixed;
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
