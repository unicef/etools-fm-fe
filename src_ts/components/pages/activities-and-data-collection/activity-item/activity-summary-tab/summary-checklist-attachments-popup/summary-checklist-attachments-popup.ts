import {LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {AttachmentsStyles} from '../../../../../styles/attachments.styles';
import {clone} from 'ramda';
import {updateChecklistAttachments} from '../../../../../../redux/effects/data-collection.effects';
import {store} from '../../../../../../redux/store';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {template} from './summary-checklist-attachments-popup.tpl';
import {get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';

@customElement('summary-checklist-attachments-popup')
export class SummaryChecklistAttachmentsPopup extends LitElement {
  @property() dialogOpened = true;
  @property() saveBtnClicked = false;
  @property() savingInProcess = false;
  @property() attachments: (StoredAttachment | IEditedAttachment)[] = [];
  @property() attachmentTypes: AttachmentType[] | undefined = [];

  @query('#link') link!: HTMLLinkElement;

  readonly = false;
  popupTitle = '';
  private updateUrl?: string;

  static get styles(): CSSResultArray {
    return [SharedStyles, AttachmentsStyles];
  }

  set dialogData({attachments, title, updateUrl, attachmentTypes}: AttachmentsPopupData) {
    this.updateUrl = updateUrl;
    this.popupTitle = title;
    this.attachmentTypes = attachmentTypes;
    this.attachments = clone(attachments);
  }

  render(): TemplateResult | void {
    return template.call(this);
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  saveChanges(): void {
    if (!this.updateUrl) {
      return;
    }
    this.saveBtnClicked = true;
    const fileTypeNotSelected: boolean = this.attachments.some(
      (attachment: IEditedAttachment | StoredAttachment) =>
        !attachment.file_type && !attachment.hasOwnProperty('delete')
    );
    if (fileTypeNotSelected) {
      return;
    }

    this.savingInProcess = true;
    const changedData: RequestChecklistAttachment[] = this.getChanges();

    store
      .dispatch<AsyncEffect>(updateChecklistAttachments(this.updateUrl, changedData))
      .then(() => {
        this.savingInProcess = false;
        this.dialogOpened = false;
        fireEvent(this, 'dialog-closed', {confirmed: true});
      })
      .catch(() => {
        this.savingInProcess = false;
        fireEvent(this, 'toast', {text: getTranslation('ERROR_CHANGES_SAVE')});
      });
  }

  protected attachmentsUploaded(attachments: {success: string[]; error: string[]}): void {
    try {
      const parsedAttachments: StoredAttachment[] = attachments.success.map(
        (jsonAttachment: string | StoredAttachment) => {
          if (typeof jsonAttachment === 'string') {
            return JSON.parse(jsonAttachment);
          } else {
            return jsonAttachment;
          }
        }
      );
      this.attachments = [...this.attachments, ...parsedAttachments];
    } catch (e) {
      console.error(e);
      fireEvent(this, 'toast', {text: getTranslation('ERROR_UPLOAD')});
    }
  }

  protected downloadFile(attachment: StoredAttachment | IAttachment): void {
    const url: string = this.isStoredAttachment(attachment) ? attachment.file_link : (attachment.file as string);
    this.link.href = url;
    this.link.click();
    window.URL.revokeObjectURL(url);
  }

  protected deleteAttachment(index: number): void {
    this.attachments.splice(index, 1);
    this.attachments = [...this.attachments];
  }

  protected changeFileType(attachment: IEditedAttachment | StoredAttachment, type: DefaultDropdownOption | null): void {
    const newType: null | number = type && type.value;
    if (newType && attachment.file_type !== newType) {
      attachment.file_type = newType;
      this.requestUpdate();
    }
  }

  private isStoredAttachment(attachment: StoredAttachment | IAttachment): attachment is StoredAttachment {
    return !attachment.hasOwnProperty('hyperlink');
  }

  private getChanges(): RequestChecklistAttachment[] {
    return this.attachments.map((attachment: IEditedAttachment | StoredAttachment) => {
      const id: number = this.isStoredAttachment(attachment) ? attachment.attachment : attachment.id;
      const file_type: number | string = attachment.file_type;
      return {id, file_type};
    });
  }
}
