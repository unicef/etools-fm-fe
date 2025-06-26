import {LitElement, html, TemplateResult, CSSResultArray, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {CommentPanelsStyles} from '../common-comments.styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {fitCommentsToWindow, makeCommentsDraggable} from '../../comments/comments.helpers';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';

@customElement('comments-panel-header')
export class CommentsPanelHeader extends LitElement {
  @property() count = 0;
  @property() isExpanded = false;
  protected render(): TemplateResult {
    return html`
      <div>${translate('COMMENTS_PANEL')} <b>(${this.count})</b></div>
      <div class="buttons">
        <etools-icon-button
          label="expand/collapse comments"
          @click="${() => this.toggleMinimize()}"
          name="${this.isExpanded ? 'unfold-more' : 'unfold-less'}"
        >
        </etools-icon-button>

        <etools-icon-button label="close comments" name="close" @click="${() => this.closePanel()}">
        </etools-icon-button>
      </div>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mousedown', makeCommentsDraggable);
    this.addEventListener('touchstart', makeCommentsDraggable);
    window.addEventListener('resize', fitCommentsToWindow);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('resize', fitCommentsToWindow);
  }

  closePanel(): void {
    fireEvent(this, 'close-comments-panels');
  }

  toggleMinimize(): void {
    this.isExpanded = !this.isExpanded;
    fireEvent(this, 'toggle-minimize');
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
