import {css, CSSResult} from 'lit';

// language=css
export const CommentStyles: CSSResult = css`
  :host {
    display: flex;
    background: var(--secondary-background-color);
    border-radius: 20px;
    padding: 12px;
    min-width: 360px;
    max-width: 60%;
    margin-bottom: 20px;
  }
  :host([my-comment]) .info .name-and-phone,
  :host([my-comment]) {
    flex-direction: row-reverse;
  }
  :host([my-comment]) .actions {
    flex-direction: row;
  }
  :host([my-comment]) .avatar {
    margin-inline-end: 0px;
    margin-inline-start: 12px;
  }
  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 40px;
    height: 40px;
    margin-inline-end: 12px;
    border-radius: 50%;
    background-color: var(--darker-divider-color);
    color: #ffffff;
    font-weight: 500;
    font-size: var(--etools-font-size-18, 18px);
    text-transform: uppercase;
  }
  .info {
    width: 100%;
  }
  .info .name-and-phone {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .name {
    font-size: var(--etools-font-size-16, 16px);
    line-height: 24px;
    color: var(--primary-text-color);
    padding-inline-end: 6px;
  }
  :host([my-comment]) .name {
    padding-inline-end: 0px;
    padding-inline-start: 6px;
  }
  .date {
    font-size: var(--etools-font-size-12, 12px);
    line-height: 16px;
    color: var(--secondary-text-color);
  }
  .message {
    font-size: var(--etools-font-size-14, 14px);
    line-height: 20px;
    color: var(--secondary-text-color);
    white-space: pre-line;
  }
  .deleted-message {
    font-size: var(--etools-font-size-14, 14px);
    line-height: 20px;
    color: var(--secondary-text-color);
    font-style: italic;
  }
  .actions {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    padding-top: 8px;
    border-top: 1px solid var(--light-divider-color);
  }
  .actions div {
    display: flex;
    align-items: center;
    margin-inline-end: 30px;
    font-weight: 500;
    font-size: var(--etools-font-size-13, 13px);
    letter-spacing: 0.038em;
    color: var(--secondary-text-color);
    cursor: pointer;
    line-height: 1;
  }
  .actions div.resolved:hover {
    text-decoration: none;
    cursor: default;
  }
  .actions div:hover {
    text-decoration: underline;
  }
  etools-icon {
    margin-inline-end: 8px;
  }
  .delete {
    --etools-icon-font-size: var(--etools-font-size-15, 15px);
    color: var(--primary-shade-of-red);
  }
  etools-icon[name='refresh'],
  .resolve {
    --etools-icon-font-size: var(--etools-font-size-18, 18px);
    color: var(--secondary-text-color);
  }
  *[hidden] {
    display: none !important;
  }
  etools-loading {
    width: 20px;
    margin-inline-end: 8px;
  }
  .retry:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  etools-icon[name='refresh'] {
    margin-inline-end: 2px;
  }
  *:focus-visible {
    outline: 2px solid rgb(170 165 165 / 50%);
  }
`;
