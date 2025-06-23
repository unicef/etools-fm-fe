import {css, CSSResult} from 'lit';

// language=css
export const CommentPanelsStyles: CSSResult = css`
  comments-list,
  messages-panel {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-shadow: 0 4px 10px 3px rgba(0, 0, 0, 0.17);
    border-radius: 11px;
    background-color: #ffffff;
    overflow: hidden;
    height: 100%;
    z-index: 15;
    transition: 0.5s;
  }
  .data-container {
    flex: auto;
    min-height: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  comments-panel-header,
  messages-panel-header {
    flex-wrap: nowrap;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    min-height: 64px;
    background-color: #009688;
    color: #ffffff;
    cursor: move;
  }
  comments-panel-header {
    padding: 0 24px 0 24px;
  }
  @media screen and (min-width: 890px) {
    messages-panel-header {
      padding: 0 64px 0 24px;
    }
  }
  @media screen and (max-width: 889px) {
    messages-panel-header {
      padding: 0 24px 0 24px;
    }
  }
  .panel-header b {
    margin-inline-start: 10px;
  }
  *:focus-visible {
    outline: 2px solid rgb(170 165 165 / 50%);
  }

  .buttons etools-icon-button:last-child {
    margin-inline-start: 10px;
  }
`;
