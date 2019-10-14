import { CSSResultArray, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { fireEvent } from '../../../utils/fire-custom-event';
import { clone } from 'ramda';
import { template } from './edit-attachments-popup.tpl';
import { store } from '../../../../redux/store';
import { addAttachmentToList, updateListAttachment } from '../../../../redux/effects/attachments-list.effects';
import { listAttachmentUpdate } from '../../../../redux/selectors/attachments-list.selectors';
import { Unsubscribe } from 'redux';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';

@customElement('edit-attachment-popup')
export class EditAttachmentsPopupComponent extends LitElement {
    @property() public dialogOpened: boolean = true;
    @property() public editedAttachment: Partial<Attachment> = {};
    @property() public attachmentTypes: DefaultDropdownOption[] = [];
    @property() public errors: GenericObject = {};
    public savingInProcess: boolean = false;
    public selectedFile: File | null = null;

    private originalData: Attachment | null = null;
    private endpointName!: string;
    private additionalEndpointData: GenericObject = {};
    private readonly updateAttachmentsUnsubscribe: Unsubscribe;

    public set data(data: IAttachmentPopupData) {
        if (!data) { return; }
        const { editedAttachment, attachmentTypes, endpointName, additionalEndpointData }: IAttachmentPopupData = data;
        this.attachmentTypes = attachmentTypes;
        this.endpointName = endpointName;
        this.additionalEndpointData = additionalEndpointData;

        if (!editedAttachment) { return; }
        this.editedAttachment = { ...this.editedAttachment, ...editedAttachment };
        this.originalData = clone(editedAttachment);
    }

    public constructor() {
        super();
        this.updateAttachmentsUnsubscribe = store.subscribe(listAttachmentUpdate((updateInProcess: boolean | null) => {
            // set updating state for spinner
            this.savingInProcess = Boolean(updateInProcess);
            if (updateInProcess) { return; }

            // check errors on update(create) complete
            this.errors = store.getState().attachmentsList.error;
            if (this.errors && Object.keys(this.errors).length) { return; }

            // close popup if update(create) was successful
            this.dialogOpened = false;
            fireEvent(this, 'response', { confirmed: true });
        }, false));
    }

    public static get styles(): CSSResultArray {
        return [SharedStyles, pageLayoutStyles, FlexLayoutClasses];
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.updateAttachmentsUnsubscribe();
    }

    public processRequest(): void {
        // validate if file is selected for new attachments
        if (!this.editedAttachment.id && !this.selectedFile) {
            fireEvent(this, 'toast', {
                text: 'Please, select correct file',
                showCloseBtn: false
            });
            return;
        }

        // compose new attachment data
        const data: Partial<Attachment> = {};
        if (this.selectedFile) { data.file = this.selectedFile; }
        const typeChanged: boolean =
            Boolean(this.originalData && this.editedAttachment.file_type !== this.originalData.file_type);
        if (!this.originalData && this.editedAttachment.file_type || typeChanged) {
            data.file_type = this.editedAttachment.file_type;
        }

        // don't save attachment if nothing changed. just close popup
        if (!Object.keys(data).length) {
            this.onClose();
            return;
        }

        if (this.editedAttachment.id) {
            store.dispatch<AsyncEffect>(updateListAttachment(this.endpointName, this.additionalEndpointData, this.editedAttachment.id, data));
        } else {
            store.dispatch<AsyncEffect>(addAttachmentToList(this.endpointName, this.additionalEndpointData, data));
        }
    }

    public onClose(): void {
        fireEvent(this, 'response', { confirmed: false });
    }

    public resetFieldError(fieldName: string): void {
        if (!this.errors) { return; }
        delete this.errors[fieldName];
        this.performUpdate();
    }
}
