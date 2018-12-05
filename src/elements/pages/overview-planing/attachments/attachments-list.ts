import { loadAttachments, uploadAttachment } from '../../../redux-store/effects/attachments.effects';
import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';
import { getEndpoint } from '../../../app-config/app-config';

class AttachmentsList extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.ProcessDataMixin,
    FMMixins.CommonMethods,
    FMMixins.ReduxMixin], Polymer.Element) {

    public static get is() { return 'attachments-list'; }

    public static get properties() {
        return {};
    }

    public openUploadAttachment() {
        this.errors = null;
        this.resetInputs();
        this.dialog = {opened: true};
        this.attachment = { file: [] };
    }

    public onFinishUpload() {
        const file = this.attachment.file[0];
        const fileType = this.attachment.file_type;
        if (!file || !fileType) { return; }
        const attachment = {
            file: file.raw,
            file_type: fileType
        };
        this.dispatchOnStore(uploadAttachment(attachment));
    }

    public connectedCallback() {
        super.connectedCallback();

        this.dispatchOnStore(loadAttachments());
        const endpoint = getEndpoint('attachments') as StaticEndpoint;
        this.dispatchOnStore(loadPermissions(endpoint.url, 'attachments'));

        this.permissionSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'permissions.attachments'),
            (permissions: IBackendPermissions) => {
                this.permissions = permissions;
                this.fileTypes = permissions && this.getDescriptorChoices(permissions, 'file_type') || [];
            });

        this.attachmentsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'attachments.data'),
            (attachments: IListData<Attachment>) => {
                this.attachments = attachments && attachments.results;
                this.count = attachments && attachments.count;
            });

        this.requestAttachmentsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'attachments.requestInProcess'),
            (requestInProcess: boolean | null) => {
                this.requestInProcess = requestInProcess;
                if (requestInProcess !== false) { return; }

                this.errors = this.getFromStore('attachments.errors');
                if (this.errors) { return; }

                this.dialog = {opened: false};
            });
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.permissionSubscriber();
        this.attachmentsSubscriber();
        this.requestAttachmentsSubscriber();
    }
}

customElements.define(AttachmentsList.is, AttachmentsList);
