import {css, CSSResult} from 'lit';

// language=CSS
export const pageHeaderStyles: CSSResult = css`
  app-toolbar {
    padding: 0;
    height: var(--toolbar-height);
  }

  .titlebar {
    color: var(--header-color);
  }

  #menuButton {
    display: flex;
    color: var(--header-color);
  }

  support-btn {
    color: var(--header-color);
    margin-left: auto;
  }

  etools-profile-dropdown {
  }

  .titlebar {
    display: flex;
    flex: 1;
    font-size: var(--etools-font-size-28, 28px);
    font-weight: 300;
  }

  .titlebar img {
    width: 34px;
    margin: 0 8px 0 24px;
  }

  .content-align {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  #app-logo {
    height: 32px;
    width: auto;
  }

  .envWarning {
    color: var(--header-color);
    font-weight: 700;
    font-size: var(--etools-font-size-18, 18px);
    line-height: 20px;
  }
  @media (max-width: 1024px) {
    .envWarning {
      display: none;
    }
    .envLong {
      display: none;
    }
    .titlebar img {
      margin: 0 8px 0 12px;
    }
    etools-profile-dropdown {
      margin-left: 12px;
      width: 40px;
    }
  }
  @media (max-width: 820px) {
    .dropdown {
      order: 1;
      margin-top: 0;
    }
    app-toolbar {
      --toolbar-height: auto;
      padding-inline-end: 0px;
      margin: 0 !important;
    }
  }
  @media (max-width: 576px) {
    #app-logo {
      display: none;
    }
    .titlebar img {
      margin: 0 8px 0 4px;
    }

    .refresh-button {
      margin-right: 0;
    }
    .envWarning {
      font-size: 10px;
      line-height: 12px;
      white-space: nowrap;
      margin-left: 2px;
    }
  }

  @media (min-width: 850px) {
    #menuButton {
      display: none;
    }
  }
`;
