import { CSSResultArray, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { template } from './remove-attachment-popup.tpl';
import { fireEvent } from '../../../utils/fire-custom-event';
import { store } from '../../../../redux/store';
import { listAttachmentUpdate } from '../../../../redux/selectors/attachments-list.selectors';
import { Unsubscribe } from 'redux';
import { deleteListAttachment } from '../../../../redux/effects/attachments-list.effects';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { TabInputsStyles } from '../../../styles/tab-inputs-styles';

@customElement('remove-attachment-popup')
export class RemoveAttachmentPopupComponent extends LitElement {
    @property() public dialogOpened: boolean = true;
    @property() public removeInProcess: boolean = false;
    private attachmentToDelete!: number;
    private endpointName!: string;
    private readonly updateAttachmentsUnsubscribe: Unsubscribe;

    public set data(data: IRemmoveAttachmentPopupData) {
        if (!data) { return; }
        const { id, endpointName }: IRemmoveAttachmentPopupData = data;
        this.attachmentToDelete = id;
        this.endpointName = endpointName;
    }

    public constructor() {
        super();
        this.updateAttachmentsUnsubscribe = store.subscribe(listAttachmentUpdate((updateInProcess: boolean | null) => {
            // set updating state for spinner
            this.removeInProcess = Boolean(updateInProcess);
            if (updateInProcess) { return; }

            // check errors on request complete
            // this.errors = store.getState().attachmentsList.error;
            // if (this.errors && Object.keys(this.errors).length) { return; }

            // close popup if delete was successful
            this.dialogOpened = false;
            fireEvent(this, 'response', { confirmed: true });
        }, false));
    }

    public static get styles(): CSSResultArray {
        return [SharedStyles, pageLayoutStyles, FlexLayoutClasses, TabInputsStyles];
    }

    public render(): TemplateResult {
        return template.call(this);
    }
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.updateAttachmentsUnsubscribe();
    }

    public processRequest(): void {
        store.dispatch<AsyncEffect>(deleteListAttachment(this.endpointName, this.attachmentToDelete));
    }

    public onClose(): void {
        fireEvent(this, 'response', { confirmed: false });
    }
}
