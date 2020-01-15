import {css, CSSResult} from 'lit-element';

// language=CSS
export const pageHeaderStyles: CSSResult = css`
  app-toolbar {
    padding: 0 16px 0 0;
    height: 60px;
  }

  .titlebar {
    color: var(--header-color);
  }

  #menuButton {
    display: block;
    color: var(--header-color);
  }

  support-btn {
    margin-left: 24px;
    color: var(--header-color);
  }

  etools-profile-dropdown {
    margin-left: 16px;
  }

  .titlebar {
    display: flex;
    flex: 1;
    font-size: 28px;
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
    color: var(--nonprod-text-warn-color);
    font-weight: 700;
    font-size: 18px;
  }

  @media (min-width: 850px) {
    #menuButton {
      display: none;
    }
  }
`;
