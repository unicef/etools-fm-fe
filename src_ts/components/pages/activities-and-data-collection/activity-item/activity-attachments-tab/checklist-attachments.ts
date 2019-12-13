import {css, CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import '../../../../common/attachmants-list/attachments-list';
import '@unicef-polymer/etools-data-table';
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

@customElement('checklist-attachments')
export class ChecklistAttachments extends MethodsMixin(LitElement) {
  @property() activityDetailsId: number | null = null;
  @property() items: IChecklistAttachment[] = [];
  @property() attachmentsTypes: AttachmentType[] = [];
  private checklistAttachmentsUnsubscribe!: Unsubscribe;
  private checklistAttachmentsTypesUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.attachmentsTypes = store.getState().activityDetails.checklistAttachmentsTypes;
    if (this.activityDetailsId) {
      store.dispatch<AsyncEffect>(loadChecklistAttachments(this.activityDetailsId));
      if (!this.attachmentsTypes || !this.attachmentsTypes.length) {
        store.dispatch<AsyncEffect>(loadChecklistAttachmentsTypes(this.activityDetailsId));
      }
    }

    this.checklistAttachmentsUnsubscribe = store.subscribe(
      activityChecklistAttachments((checklistAttachments: IChecklistAttachment[]) => {
        this.items = checklistAttachments;
      }, false)
    );

    this.checklistAttachmentsTypesUnsubscribe = store.subscribe(
      activityChecklistAttachmentsTypes((checklistAttachmentsTypes: AttachmentType[]) => {
        this.attachmentsTypes = checklistAttachmentsTypes;
        console.log(this.attachmentsTypes);
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.checklistAttachmentsUnsubscribe();
    this.checklistAttachmentsTypesUnsubscribe();
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

  formatDate(date: string | null): string {
    return date ? moment(date).format('DD MMM YYYY') : '-';
  }

  //fixme copy-paste from attachments-list.ts
  getTypeDisplayName(id: number): string {
    const type: AttachmentType | undefined = this.attachmentsTypes.find((item: AttachmentType) => item.id === id);
    return (type && type.label) || '';
  }

  static get styles(): CSSResult[] {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      CardStyles,
      FlexLayoutClasses,
      css`
        .custom-row-data-title {
          display: flex;
        }
        .custom-row-data {
          display: flex;
          margin-top: 1%;
        }
        .custom-row-details-content {
          font-size: 12px;
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
