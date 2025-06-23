import {LitElement, html, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {CommentPanelsStyles} from '../common-comments.styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import './comments-group';
import './comments-panel-header';
import {CommentsCollection} from '../../comments/comments.reducer';
import {CommentsDescription, CommentsItemsNameMap} from '../../comments/comments-items-name-map';
import {extractId, removeTrailingIds} from '../../comments/comments.helpers';
import {CommentItemData, CommentRelatedItem} from '../../comments/comments-types';
import {EtoolsTextarea} from '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';

@customElement('comments-list')
export class CommentsList extends LitElement {
  @property() selectedGroup: string | null = null;
  @property() relatedItems: CommentRelatedItem[] = [];

  set commentsCollection(collection: CommentsCollection) {
    this.commentsGroups = Object.entries(collection || {}).map(([relatedTo, comments]) => {
      const relatedToKey: string = removeTrailingIds(relatedTo);
      const relatedToId = extractId(relatedTo);
      const relatedItem = this.relatedItems?.find((x) => x.type === relatedToKey && x.id.toString() === relatedToId);
      const relatedToTranslateKey = CommentsItemsNameMap[relatedToKey];
      const commentWithDescription = comments.find(({related_to_description}) => related_to_description);
      const relatedToDescription = commentWithDescription?.related_to_description || '';
      const fieldDescription = CommentsDescription[relatedToKey] || CommentsDescription[relatedTo] || null;

      return {
        relatedItem,
        relatedToTranslateKey,
        relatedToDescription,
        fieldDescription,
        relatedTo,
        count: comments.length,
        lastCreatedMessageDate: (comments[comments.length - 1] as any).created
      };
    });
    this.requestUpdate();
  }

  commentsGroups: CommentItemData[] = [];

  protected render(): TemplateResult {
    return html`
      <comments-panel-header .count="${this.commentsGroups.length}"></comments-panel-header>
      <div class="data-container">
        ${this.commentsGroups.map((group) => {
          return html`
            <comments-group
              ?opened="${group.relatedTo === this.selectedGroup}"
              .relatedItem="${group.relatedItem}"
              .relatedTo="${group.relatedToTranslateKey}"
              .relatedToDescription="${group.relatedToDescription}"
              .fieldDescription="${group.fieldDescription}"
              .commentsCount="${group.count}"
              .lastCreatedMessageDate="${group.lastCreatedMessageDate}"
              tabindex="0"
              @click="${() => this.showMessages(group)}"
              @keyup="${(event: KeyboardEvent) => {
                if (event.key === 'Enter') {
                  this.showMessages(group);
                  const commentsPanelElement = document.querySelector('comments-panels');
                  const messagesPanelElement = commentsPanelElement?.shadowRoot?.querySelector('messages-panel');
                  (messagesPanelElement?.shadowRoot?.querySelector('etools-textarea') as EtoolsTextarea)?.focus();
                }
              }}"
            ></comments-group>
          `;
        })}
      </div>
    `;
  }

  showMessages(commentsGroup: CommentItemData): void {
    fireEvent(this, 'show-messages', {commentsGroup});
  }

  static get styles(): CSSResultArray {
    // language=css
    return [CommentPanelsStyles];
  }
}
