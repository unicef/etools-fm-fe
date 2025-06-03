import {LitElement, html, TemplateResult, CSSResultArray, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {CommentPanelsStyles} from '../common-comments.styles';
import {translate, get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {makeCommentsDraggable} from '../../comments/comments.helpers';
import {CommentRelatedItem} from '../../comments/comments-types';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';

@customElement('messages-panel-header')
export class MessagesPanelHeader extends LitElement {
  @property() relatedToKey = '';
  @property() relatedItem: CommentRelatedItem | null = null;

  protected render(): TemplateResult {
    return html`
      <div>
        ${getTranslation('COMMENTS_ON')}
        <b>${this.relatedToKey ? translate(this.relatedToKey) : ''} ${this.relatedItem?.code || ''}</b>
      </div>
      <div class="buttons">
        <etools-icon-button label="view comments" name="chevron-right" @click="${() => this.hideMessages(false)}">
        </etools-icon-button>
      </div>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mousedown', makeCommentsDraggable);
    this.addEventListener('touchstart', makeCommentsDraggable);
    document.addEventListener('keydown', this.hideOnEscape.bind(this));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.hideOnEscape.bind(this));
  }

  hideOnEscape(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.hideMessages(true);
    }
  }

  hideMessages(refocusInList?: boolean): void {
    if (refocusInList) {
      const commentsPanelElement = document.querySelector('comments-panels');
      const commentsListElement = commentsPanelElement?.shadowRoot?.querySelector('comments-list');
      (commentsListElement?.shadowRoot?.querySelector('comments-group[opened]') as any)?.focus();
    }
    fireEvent(this, 'hide-messages');
  }

  static get styles(): CSSResultArray {
    // language=css
    return [
      CommentPanelsStyles,
      css`
        etools-icon-button {
          --etools-icon-font-size: var(--etools-font-size-30, 30px);
          width: 30px;
          color: white;
        }
      `
    ];
  }
}
