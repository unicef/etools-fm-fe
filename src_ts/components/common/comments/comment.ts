import {LitElement, html, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {CommentStyles} from './comment.styles';
import {translate, get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import dayjs from 'dayjs';
import {CommentType} from './comments.reducer';

@customElement('comment-element')
export class CommentElement extends LitElement {
  static get styles(): CSSResultArray {
    // language=css
    return [CommentStyles];
  }

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
    return `${date.format('MMM DD YYYY')} ${getTranslation('AT')} ${date.format('HH:mm')}`;
  }

  protected render(): TemplateResult {
    return html`
      <div class="avatar">${this.authorAvatar}</div>
      <div class="info">
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
          : html`
              <div class="message">${this.comment.text}</div>
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
                  <etools-icon ?hidden="${this.deleting}" class="delete" name="cancel"></etools-icon> ${translate(
                    'DELETE'
                  )}
                </div>
              </div>
            `}
      </div>
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
}
