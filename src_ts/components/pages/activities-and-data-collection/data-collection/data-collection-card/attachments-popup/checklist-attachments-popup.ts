import {css, CSSResultArray, customElement, LitElement, property, query, TemplateResult} from 'lit-element';
import {template} from './checklist-attachments-popup.tpl';
import {fireEvent} from '../../../../../utils/fire-custom-event';
import {AttachmentsStyles} from '../../../../../styles/attachments.styles';
import {clone} from 'ramda';
import {SharedStyles} from '../../../../../styles/shared-styles';

@customElement('checklist-attachments-popup')
export class ChecklistAttachmentsPopup extends LitElement {
  @property() dialogOpened: boolean = true;
  @property() saveBtnClicked: boolean = false;
  @property() savingInProcess: boolean = false;
  @property() attachments: GenericObject[] = [];

  @property() metadata!: BlueprintMetadata;
  readonly: boolean = false;
  popupTitle: string = '';

  @query('#link') link!: HTMLLinkElement;

  set dialogData({attachments, title, metadata}: FormBuilderAttachmentsPopupData) {
    this.popupTitle = title;
    this.attachments = clone(attachments);
    this.metadata = clone(metadata);
  }

  render(): TemplateResult | void {
    return template.call(this);
  }

  onClose(): void {
    fireEvent(this, 'response', {confirmed: false});
  }

  saveChanges(): void {
    const fileTypeNotSelected: boolean = this.attachments.some((attachment: GenericObject) => !attachment.file_type);
    if (fileTypeNotSelected) {
      return;
    }

    fireEvent(this, 'response', {confirmed: true, attachments: this.attachments});
  }

  protected attachmentsUploaded(attachments: {success: string[]; error: string[]}): void {
    try {
      const parsedAttachments: StoredAttachment[] = attachments.success.map((jsonAttachment: string) =>
        JSON.parse(jsonAttachment)
      );
      this.attachments = [...this.attachments, ...parsedAttachments].map((item: GenericObject) => {
        return {
          attachment: `${item.attachment}`,
          file_type: Number(item.file_type),
          filename: item.filename,
          url: item.url || item.file_link
        };
      });
    } catch (e) {
      console.error(e);
      fireEvent(this, 'toast', {text: 'Can not upload attachments. Please try again later'});
    }
  }

  protected downloadFile(attachment: GenericObject): void {
    const url: string = attachment.url;
    this.link.href = url;
    this.link.click();
    window.URL.revokeObjectURL(url);
  }

  protected deleteAttachment(index: number): void {
    this.attachments.splice(index, 1);
    this.performUpdate();
  }

  protected changeFileType(attachment: GenericObject, type: DefaultDropdownOption | null): void {
    const newType: null | number = type && type.value;
    if (newType && attachment.file_type !== newType) {
      attachment.file_type = newType;
      this.performUpdate();
    }
  }

  static get styles(): CSSResultArray {
    return [
      SharedStyles,
      AttachmentsStyles,
      css`
        .file-selector__type-dropdown {
          flex-basis: 25%;
        }
        .file-selector__filename {
          flex-basis: 35%;
        }
        .file-selector__download {
          flex-basis: 10%;
        }
        .file-selector__delete {
          flex-basis: 10%;
        }
        .file-selector-container.with-type-dropdown {
          flex-wrap: nowrap;
        }
        @media (max-width: 380px) {
          .file-selector-container.with-type-dropdown {
            justify-content: center;
          }
          .file-selector-container.with-type-dropdown etools-dropdown.type-dropdown {
            flex-basis: 90%;
          }
          .file-selector__filename {
            flex-basis: 90%;
          }
          .file-selector__download {
            flex-basis: 5%;
          }
          .file-selector__delete {
            flex-basis: 5%;
          }
        }
        @media (max-width: 600px) {
          etools-dropdown {
            padding: 0;
          }
          .file-selector-container.with-type-dropdown {
            border-bottom: 1px solid lightgrey;
            flex-wrap: wrap;
            padding-bottom: 10px;
          }
        }
      `
    ];
  }
}
