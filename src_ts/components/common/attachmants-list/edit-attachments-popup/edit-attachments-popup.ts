import {LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {template} from './edit-attachments-popup.tpl';
import {store} from '../../../../redux/store';
import {addAttachmentToList, updateListAttachment} from '../../../../redux/effects/attachments-list.effects';
import {listAttachmentUpdate} from '../../../../redux/selectors/attachments-list.selectors';
import {Unsubscribe} from 'redux';
import {SharedStyles} from '../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {DataMixin} from '../../mixins/data-mixin';
import {get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';

@customElement('edit-attachment-popup')
export class EditAttachmentsPopupComponent extends DataMixin()<IAttachment>(LitElement) {
  @property() dialogOpened = true;
  @property() attachmentTypes: AttachmentType[] = [];
  @property() uploadInProgress = false;
  protected savingInProcess = false;
  protected selectedFileId: number | null = null;

  private endpointName!: string;
  private additionalEndpointData: GenericObject = {};
  private updateAttachmentsUnsubscribe!: Unsubscribe;

  static get styles(): CSSResultArray {
    return [SharedStyles, pageLayoutStyles, layoutStyles];
  }

  set dialogData(data: IAttachmentPopupData) {
    if (!data) {
      return;
    }
    const {editedAttachment, attachmentTypes, endpointName, additionalEndpointData}: IAttachmentPopupData = data;
    this.attachmentTypes = attachmentTypes;
    this.endpointName = endpointName;
    this.additionalEndpointData = additionalEndpointData;

    if (!editedAttachment) {
      return;
    }
    this.data = editedAttachment;
  }

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.updateAttachmentsUnsubscribe = store.subscribe(
      listAttachmentUpdate((updateInProcess: boolean | null) => {
        // set updating state for spinner
        this.savingInProcess = Boolean(updateInProcess);
        if (updateInProcess) {
          return;
        }

        // check errors on update(create) complete
        this.errors = store.getState().attachmentsList.error;
        if (this.errors && Object.keys(this.errors).length) {
          fireEvent(this, 'toast', {text: getTranslation('ERROR_CHANGES_SAVE')});
          return;
        }

        // close popup if update(create) was successful
        this.dialogOpened = false;
        fireEvent(this, 'dialog-closed', {confirmed: true});
      }, false)
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.updateAttachmentsUnsubscribe();
  }

  switchFileType(value: any): void {
    if (value) {
      this.editedData.file_type = value;
    }
  }

  protected processRequest(): void {
    // validate if file is selected for new attachments
    if (!this.editedData.id && !this.selectedFileId) {
      fireEvent(this, 'toast', {
        text: getTranslation('SELECT_CORRECT_FILE')
      });
      return;
    }

    if (!this.editedData.file_type) {
      this.errors = {
        file_type: 'File type is required'
      };
      return;
    }

    // compose new attachment data
    const data: Partial<IAttachment> = {};
    if (this.selectedFileId) {
      data.id = this.selectedFileId;
    }
    const typeChanged = Boolean(this.originalData && this.editedData.file_type !== this.originalData.file_type);
    if ((!this.originalData && this.editedData.file_type) || typeChanged) {
      data.file_type = this.editedData.file_type;
    }

    // don't save attachment if nothing changed. just close popup
    if (!Object.keys(data).length) {
      this.onClose();
      return;
    }

    if (this.editedData.id) {
      if (this.onlyDocTypeHasChanged(data)) {
        store.dispatch<AsyncEffect>(
          updateListAttachment(this.endpointName, this.additionalEndpointData, this.editedData.id, data)
        );
      }
    } else {
      store.dispatch<AsyncEffect>(addAttachmentToList(this.endpointName, this.additionalEndpointData, data));
    }
  }

  protected onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  protected fileSelected({success}: {success?: any; error?: string}): void {
    this.uploadInProgress = false;
    this.selectedFileId = success?.id || null;
  }

  private onlyDocTypeHasChanged(data: Partial<IAttachment>): boolean {
    const modifiedFields = Object.keys(data);
    return modifiedFields.length === 1 && modifiedFields[0] === 'file_type';
  }
}
