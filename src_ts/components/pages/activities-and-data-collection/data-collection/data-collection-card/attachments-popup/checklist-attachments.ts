import {CSSResultArray, customElement, LitElement, property, query, TemplateResult} from 'lit-element';
import {template} from './checklist-attachments.tpl';
import {fireEvent} from '../../../../../utils/fire-custom-event';
import {AttachmentsStyles} from '../../../../../styles/attachments.styles';
import {clone} from 'ramda';
import {updateChecklistAttachments} from '../../../../../../redux/effects/data-collection.effects';
import {store} from '../../../../../../redux/store';
import {SharedStyles} from '../../../../../styles/shared-styles';

@customElement('checklist-attachments-popup')
export class ChecklistAttachments extends LitElement {
  @property() dialogOpened: boolean = true;
  @property() saveBtnClicked: boolean = false;
  @property() savingInProcess: boolean = false;
  @property() attachments: (StoredAttachment | IEditedAttachment)[] = [];
  @property() attachmentTypes: DefaultDropdownOption[] = [
    {display_name: 'SOP', value: 34},
    {display_name: 'Other', value: 35}
  ];
  readonly: boolean = false;
  popupTitle: string = '';

  @query('#link') link!: HTMLLinkElement;
  private updateUrl!: string;
  private originalAttachments: IAttachment[] = [];

  set dialogData({attachments, title, updateUrl}: AttachmentsPopupData) {
    this.updateUrl = updateUrl;
    this.popupTitle = title;
    this.attachments = clone(attachments);
    this.originalAttachments = attachments;
  }

  render(): TemplateResult | void {
    return template.call(this);
  }

  onClose(): void {
    fireEvent(this, 'response', {confirmed: false});
  }

  saveChanges(): void {
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
      .then((noChanges: boolean) => {
        this.savingInProcess = false;
        this.dialogOpened = false;
        fireEvent(this, 'response', {confirmed: true, response: {noChanges}});
      })
      .catch(() => {
        this.savingInProcess = false;
        fireEvent(this, 'toast', {text: 'Can not save changes. Please try again later'});
      });
  }

  protected attachmentsUploaded(attachments: {success: string[]; error: string[]}): void {
    try {
      const parsedAttachments: StoredAttachment[] = attachments.success.map((jsonAttachment: string) =>
        JSON.parse(jsonAttachment)
      );
      this.attachments = [...this.attachments, ...parsedAttachments];
    } catch (e) {
      console.error(e);
      fireEvent(this, 'toast', {text: 'Can not upload attachments. Please try again later'});
    }
  }

  protected downloadFile(attachment: StoredAttachment | IAttachment): void {
    const url: string = this.isStoredAttachment(attachment) ? attachment.file_link : (attachment.file as string);
    this.link.href = url;
    this.link.click();
    window.URL.revokeObjectURL(url);
  }

  protected deleteAttachment(attachment: StoredAttachment | IEditedAttachment, index: number): void {
    if (this.isStoredAttachment(attachment)) {
      this.attachments.splice(index, 1);
    } else {
      attachment._delete = true;
    }
    this.performUpdate();
  }

  protected changeFileType(attachment: IEditedAttachment | StoredAttachment, type: DefaultDropdownOption | null): void {
    const newType: null | number = type && type.value;
    if (newType && attachment.file_type !== newType) {
      attachment.file_type = newType;
      this.performUpdate();
    }
  }

  private isStoredAttachment(attachment: StoredAttachment | IAttachment): attachment is StoredAttachment {
    return !attachment.hasOwnProperty('hyperlink');
  }

  private getChanges(): RequestChecklistAttachment[] {
    return this.attachments
      .map((attachment: IEditedAttachment | StoredAttachment) => {
        if (this.isStoredAttachment(attachment)) {
          // link attachment to checklist
          return {attachment: attachment.attachment, file_type: attachment.file_type};
        } else if (attachment._delete) {
          // remove existed attachment from checklist
          return {id: attachment.id, _delete: true} as RequestChecklistAttachment;
        }

        // get original attachment and check the changes. only file_type field can be changed
        const originalAttachment: IAttachment = this.originalAttachments.find(
          ({id}: IAttachment) => id === attachment.id
        ) as IAttachment;
        if (attachment.file_type === originalAttachment.file_type) {
          return null;
        } else {
          return {attachment: attachment.id, file_type: attachment.file_type};
        }
      })
      .filter<RequestChecklistAttachment>(
        (attachment: RequestChecklistAttachment | null): attachment is RequestChecklistAttachment => attachment !== null
      );
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, AttachmentsStyles];
  }
}
