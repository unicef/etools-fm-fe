import {LitElement, html, CSSResultArray, TemplateResult, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import dayjs from 'dayjs';
import {CommentType} from '../../comments/comments.reducer';
@customElement('message-item')
export class MessageItem extends LitElement {
  @property({type: Boolean, reflect: true, attribute: 'my-comment'}) myComment!: boolean;
  @property() comment!: CommentType & {loadingError?: boolean; created: string};
  @property() resolving = false;
  @property() deleting = false;

  get authorAvatar(): string {
    return !this.comment
      ? ''
      : `${this.comment.user.first_name ? this.comment.user.first_name[0] : ''}${
          this.comment.user.last_name ? this.comment.user.last_name[0] : ''
        }`;
  }

  get date(): string {
    const date = dayjs(this.comment.created);
    return `${date.format('MMM DD YYYY')} at ${date.format('HH:mm')}`;
  }

  protected render(): TemplateResult {
    return html`
      <div class="info">
        <div class="avatar">${this.authorAvatar}</div>
        <div class="flex-c">
          <div class="name-and-phone">
            <div class="name">${this.comment.user.first_name} ${this.comment.user.last_name}</div>
            <etools-loading
              no-overlay
              ?active="${!this.comment.id && !this.comment.loadingError}"
              loading-text=""
            ></etools-loading>
            <div class="date" ?hidden="${!this.comment.id && !this.comment.loadingError}">
              ${this.comment.id
                ? this.date
                : html`<div
                    class="retry"
                    tabindex="0"
                    @click="${() => this.retry()}"
                    @keyup="${(event: KeyboardEvent) => {
                      if (event.key === 'Enter') {
                        this.retry();
                      }
                    }}"
                  >
                    <etools-icon name="refresh"></etools-icon>${translate('RETRY')}
                  </div> `}
            </div>
          </div>

          ${this.comment.state === 'deleted'
            ? html`<div class="deleted-message">${translate('MESSAGE_WAS_DELETED')}</div> `
            : html` <div class="message">${this.comment.text}</div>`}
        </div>
      </div>

      ${this.comment.state === 'deleted'
        ? html``
        : html`
            <div
              class="actions"
              ?hidden="${(!this.comment.id && !this.comment.loadingError) ||
              (!this.myComment && this.comment.state !== 'resolved')}"
            >
              <!--      Resolve action        -->
              <div
                @click="${() => this.resolve()}"
                @keyup="${(event: KeyboardEvent) => {
                  if (event.key === 'Enter') {
                    this.resolve();
                  }
                }}"
                tabindex="0"
                class="${this.comment.state === 'resolved' ? 'resolved' : ''}"
                ?hidden="${!this.comment.id}"
              >
                <etools-loading no-overlay ?active="${this.resolving}" loading-text=""></etools-loading>
                <etools-icon
                  ?hidden="${this.resolving}"
                  class="resolve"
                  name="${this.comment.state === 'resolved' ? 'check' : 'archive'}"
                ></etools-icon>
                ${translate(this.comment.state === 'resolved' ? 'RESOLVED' : 'RESOLVE')}
              </div>
              <!--      Delete action        -->
              <div
                ?hidden="${!this.myComment}"
                tabindex="0"
                @click="${() => this.delete()}"
                @keyup="${(event: KeyboardEvent) => {
                  if (event.key === 'Enter') {
                    this.delete();
                    // Focus this element so we can continue with tabs on next elements;
                    this.focus();
                  }
                }}"
              >
                <etools-loading no-overlay ?active="${this.deleting}" loading-text=""></etools-loading>
                <etools-icon ?hidden="${this.deleting}" class="delete" name="delete"></etools-icon> ${translate(
                  'DELETE'
                )}
              </div>
            </div>
          `}
    `;
  }

  resolve(): void {
    if (this.resolving || this.comment.state === 'resolved') {
      return;
    }
    fireEvent(this, 'resolve');
  }

  delete(): void {
    if (this.deleting) {
      return;
    }
    fireEvent(this, 'delete');
  }

  retry(): void {
    fireEvent(this, 'retry');
  }

  static get styles(): CSSResultArray {
    // language=css
    return [
      layoutStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          background: var(--primary-background-color);
          border-radius: 11px;
          padding: 12px;
          width: 83%;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12);
        }
        .flex-c {
          flex: 1;
        }
        :host([my-comment]) {
          align-self: flex-end;
        }
        :host([my-comment]) .info .name-and-phone,
        :host([my-comment]) .info {
          flex-direction: row-reverse;
        }
        :host([my-comment]) .actions {
          flex-direction: row;
        }
        :host([my-comment]) .avatar {
          margin-inline-end: 0;
          margin-inline-start: 7px;
        }
        .avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: 36px;
          height: 36px;
          margin-inline-end: 7px;
          border-radius: 50%;
          background-color: var(--darker-divider-color);
          color: #ffffff;
          font-weight: 500;
          font-size: var(--etools-font-size-18, 18px);
          text-transform: uppercase;
        }
        .info {
          display: flex;
        }
        .info .name-and-phone {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .name {
          font-size: var(--etools-font-size-14, 14px);
          font-weight: 400;
          line-height: 16px;
          color: #212121;
        }
        .date {
          font-size: var(--etools-font-size-13, 13px);
          font-weight: 400;
          line-height: 15px;
          color: #5c5c5c;
        }
        .message {
          font-size: var(--etools-font-size-16, 16px);
          font-weight: 400;
          line-height: 20px;
          color: #5c5c5c;
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
          justify-content: flex-end;
          padding-top: 8px;
          margin-top: 6px;
          border-top: 1px solid var(--light-divider-color);
        }
        .actions div {
          display: flex;
          align-items: center;
          margin-inline-end: 30px;
          font-weight: 400;
          font-size: var(--etools-font-size-13, 13px);
          line-height: 18px;
          color: #5c5c5c;
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
          --etools-icon-font-size: var(--etools-font-size-18, 18px);
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
      `
    ];
  }
}
