import {CSSResultArray, customElement, LitElement, property, query, TemplateResult} from 'lit-element';
import {fireEvent} from '../../../../../../utils/fire-custom-event';
import {template} from './partner-edit-attachments-popup.tpl';
import {store} from '../../../../../../../redux/store';
import {addAttachmentToList, updateListAttachment} from '../../../../../../../redux/effects/attachments-list.effects';
import {listAttachmentUpdate} from '../../../../../../../redux/selectors/attachments-list.selectors';
import {Unsubscribe} from 'redux';
import {SharedStyles} from '../../../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../../../styles/flex-layout-classes';
import {DataMixin} from '../../../../../../common/mixins/data-mixin';
import {get as getTranslation} from 'lit-translate';
import {validateRequiredFields} from '@unicef-polymer/etools-modules-common/dist/utils/validation-helper';
import {EtoolsUpload} from '@unicef-polymer/etools-upload/etools-upload';

@customElement('partner-edit-attachment-popup')
export class PartnerEditAttachmentsPopupComponent extends DataMixin()<IAttachment>(LitElement) {
  @property() dialogOpened = true;
  @property() attachmentTypes: AttachmentType[] = [];
  @query('#uploadFile') uploadFile!: EtoolsUpload;

  protected savingInProcess = false;

  private endpointName!: string;
  private additionalEndpointData: GenericObject = {};
  private updateAttachmentsUnsubscribe!: Unsubscribe;

  static get styles(): CSSResultArray {
    return [SharedStyles, pageLayoutStyles, FlexLayoutClasses];
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
          if (this.errors.initialResponse && this.errors.initialResponse.status === 413) {
            this.uploadFile.setInvalid(true, getTranslation('ERROR_UPLOAD_FILE_TOO_LARGE'));
            this.uploadFile.fail = true;
          } else {
            fireEvent(this, 'toast', {text: getTranslation('ERROR_CHANGES_SAVE')});
          }
          return;
        }

        // close popup if update(create) was successful
        this.dialogOpened = false;
        fireEvent(this, 'response', {confirmed: true});
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
    if (!this.uploadFile._filename) {
      this.uploadFile.rawFile = null;
    }
    if (!validateRequiredFields(this)) {
      return;
    }

    // compose new attachment data
    const isNew = !this.originalData || !this.originalData.id;
    const fd = new FormData();
    const typeChanged = Boolean(isNew || this.editedData.file_type !== this.originalData!.file_type);
    if (typeChanged) {
      fd.append('file_type', this.editedData.file_type as any);
    }
    const fileChanged = isNew || Boolean(this.uploadFile._filename !== this.originalData!.filename);
    if (fileChanged) {
      fd.append('file', this.uploadFile.rawFile as any, this.uploadFile._filename as any);
    }
    // don't save attachment if nothing changed. just close popup
    if (!typeChanged && !fileChanged) {
      this.onClose();
      return;
    }

    this.savingInProcess = true;
    if (this.originalData && this.originalData.id) {
      fd.append('id', this.originalData.id as any);
      store.dispatch<AsyncEffect>(
        updateListAttachment(this.endpointName, this.additionalEndpointData, this.originalData.id, fd, false)
      );
    } else {
      store.dispatch<AsyncEffect>(addAttachmentToList(this.endpointName, this.additionalEndpointData, fd, false));
    }
  }

  protected onClose(): void {
    fireEvent(this, 'response', {confirmed: false});
  }
}
