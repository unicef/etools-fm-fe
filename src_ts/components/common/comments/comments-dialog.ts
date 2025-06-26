import {html, TemplateResult, CSSResultArray, css} from 'lit';
import {customElement, query} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import './comment';
import EtoolsDialog from '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import {GenericObject} from '@unicef-polymer/etools-types';
import {get as getTranslation, translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {sharedStyles} from '@unicef-polymer/etools-modules-common/dist/styles/shared-styles-lit';
import {CommentsItemsNameMap} from './comments-items-name-map';
import {EditComments} from './edit-comments-base';
import {removeTrailingIds} from './comments.helpers';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import {CommentType} from './comments.reducer';
import {store} from '../../../redux/store';

@customElement('comments-dialog')
export class CommentsDialog extends EditComments {
  get dialogTitle(): string {
    if (!this.relatedTo) {
      return '';
    }
    const relatedToKey: string = removeTrailingIds(this.relatedTo);
    const itemType = CommentsItemsNameMap[relatedToKey];
    if (itemType) {
      const description = this.relatedToDescription ? ` - ${this.relatedToDescription}` : '';
      return `${getTranslation('COMMENTS_ON')}: ${getTranslation(CommentsItemsNameMap[relatedToKey])}${description}`;
    } else if (this.relatedToDescription) {
      return `${getTranslation('COMMENTS_ON')}: ${this.relatedToDescription}`;
    } else {
      return '';
    }
  }

  set dialogData({collectionId, relatedTo, relatedToDescription, endpoints}: any) {
    this.collectionId = collectionId;
    this.relatedTo = relatedTo;
    this.endpoints = endpoints;
    this.relatedToDescription = relatedToDescription;
    const comments: GenericObject<CommentType[]> = store.getState().commentsData.collection[collectionId];
    const relatedToComments: CommentType[] = (comments && comments[relatedTo]) || [];
    this.comments = [...relatedToComments];
    this.updateComplete.then(() => this.scrollDown());
  }

  @query('etools-dialog') private dialogElement!: EtoolsDialog;

  protected render(): TemplateResult {
    return html`
      ${sharedStyles}
      <style>
        etools-textarea::part(textarea) {
          max-height: 96px;
          overflow-y: auto;
        }
      </style>
      <etools-dialog size="md" keep-dialog-open dialog-title="${this.dialogTitle}" @close="${this.onClose}">
        <div class="container-dialog">
          ${this.comments.map(
            (comment: any, index: number) =>
              html`<comment-element
                .comment="${comment}"
                ?my-comment="${comment.user.id === this.currentUser.id}"
                .resolving="${this.isResolving(comment.id)}"
                .deleting="${this.isDeleting(comment.id)}"
                @resolve="${() => this.resolveComment(comment.id, index)}"
                @delete="${() => this.deleteComment(comment.id, index)}"
                @retry="${() => this.retry(index)}"
              ></comment-element>`
          )}
          <div class="no-comments" ?hidden="${this.comments.length}">${translate('NO_COMMENTS')}</div>
        </div>
        <div class="message-input" slot="buttons">
          <etools-textarea
            max-rows="3"
            no-label-float
            placeholder="${translate('ENTER_MESSAGE_HERE')}"
            .value="${this.newMessageText}"
            @value-changed="${({detail}: CustomEvent) => {
              this.newMessageText = detail.value;
              this.requestUpdate();
            }}"
            @keyup="${(event: KeyboardEvent) => this.onKeyup(event)}"
            @keydown="${(event: KeyboardEvent) => this.onKeydown(event)}"
          ></etools-textarea>
          <etools-button variant="primary" @click="${() => this.addComment()}">${translate('POST')}</etools-button>
          <etools-button variant="text" class="neutral" @click="${() => this.onClose()}"
            >${translate('CLOSE')}</etools-button
          >
        </div>
      </etools-dialog>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keyup', this._handleEscape.bind(this));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keyup', this._handleEscape.bind(this));
  }

  _handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  onKeyup(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }
    if (event.ctrlKey) {
      this.newMessageText += '\n';
      this.requestUpdate();
    } else {
      this.addComment();
    }
  }

  scrollDown(): void {
    if (this.dialogElement) {
      this.dialogElement.scrollDown();
    }
  }

  static get styles(): CSSResultArray {
    // language=css
    return [
      css`
        .message-input {
          display: flex;
          align-items: flex-end;
          padding: 16px 10px 8px 25px;
          border-top: 1px solid var(--light-divider-color);
          margin-bottom: 0;
        }
        .container {
          display: flex;
          flex-direction: column;
          padding: 24px;
        }
        comment-element[my-comment] {
          align-self: flex-end;
        }

        .no-comments {
          font-size: var(--etools-font-size-15, 15px);
          font-style: italic;
          line-height: 16px;
          color: var(--secondary-text-color);
        }
      `
    ];
  }
}
