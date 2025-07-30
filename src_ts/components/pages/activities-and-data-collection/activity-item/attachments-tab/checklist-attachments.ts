import {css, LitElement, TemplateResult, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import '../../../../common/attachmants-list/attachments-list';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import {MethodsMixin} from '../../../../common/mixins/methods-mixin';
import {Unsubscribe} from 'redux';
import {store} from '../../../../../redux/store';
import {
  loadChecklistAttachments,
  loadChecklistAttachmentsTypes
} from '../../../../../redux/effects/activity-details.effects';
import {
  activityChecklistAttachments,
  activityChecklistAttachmentsTypes
} from '../../../../../redux/selectors/activity-details.selectors';
import {template} from './checklist-attachments.tpl';
import {CommentElementMeta, CommentsMixin} from '../../../../common/comments/comments-mixin';

@customElement('checklist-attachments')
export class ChecklistAttachments extends CommentsMixin(MethodsMixin(LitElement)) {
  @property() activityDetailsId: number | null = null;
  @property() items: IChecklistAttachment[] = [];
  @property() attachmentsTypes: AttachmentType[] = [];
  @property() loading = false;
  @property({type: Boolean})
  lowResolutionLayout = false;
  private checklistAttachmentsUnsubscribe!: Unsubscribe;
  private checklistAttachmentsTypesUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.attachmentsTypes = store.getState().activityDetails.checklistAttachmentsTypes;
    if (this.activityDetailsId) {
      this.loading = true;
      store.dispatch<AsyncEffect>(loadChecklistAttachments(this.activityDetailsId));
      if (!this.attachmentsTypes.length) {
        store.dispatch<AsyncEffect>(loadChecklistAttachmentsTypes(this.activityDetailsId));
      }
    }

    this.checklistAttachmentsUnsubscribe = store.subscribe(
      activityChecklistAttachments((checklistAttachments: IChecklistAttachment[]) => {
        this.items = checklistAttachments;
        this.loading = false;
      }, false)
    );

    this.checklistAttachmentsTypesUnsubscribe = store.subscribe(
      activityChecklistAttachmentsTypes((checklistAttachmentsTypes: AttachmentType[]) => {
        this.attachmentsTypes = checklistAttachmentsTypes;
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.checklistAttachmentsUnsubscribe();
    this.checklistAttachmentsTypesUnsubscribe();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('items') || (changedProperties.has('loading') && this.items.length && !this.loading)) {
      this.setCommentMode();
    }
  }
  getSpecialElements(container: HTMLElement): CommentElementMeta[] {
    const element: HTMLElement = container.shadowRoot!.querySelector('#wrapper') as HTMLElement;
    const relatedTo: string = container.getAttribute('related-to') as string;
    const relatedToDescription = container.getAttribute('related-to-description') as string;
    return [{element, relatedTo, relatedToDescription}];
  }

  getRelatedInfo({partner, cp_output, intervention}: IChecklistAttachment): {type: string; content: string} {
    if (partner) {
      return {type: 'Partner', content: partner.name};
    } else if (cp_output) {
      return {type: 'CP Output', content: cp_output.name};
    } else if (intervention) {
      return {type: 'Intervention', content: intervention.title};
    } else {
      return {type: '-', content: '-'};
    }
  }

  static get styles(): CSSResult[] {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      CardStyles,
      layoutStyles,
      css`
        .custom-row-data-title {
          display: flex;
        }
        .custom-row-data {
          display: flex;
          margin-top: 1%;
        }
        .custom-row-details-content {
          font-size: var(--etools-font-size-12, 12px);
        }
        .sub-title {
          opacity: 0.6;
          font-weight: 700;
        }
        .download-link {
          font-weight: 700;
          text-decoration: none;
        }
        .;
      `
    ];
  }
}
