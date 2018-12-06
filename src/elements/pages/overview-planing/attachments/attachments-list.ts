import {
    addAttachment,
    deleteAttachment,
    loadAttachments,
    updateAttachment
} from '../../../redux-store/effects/attachments.effects';
import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';
import { getEndpoint } from '../../../app-config/app-config';

class AttachmentsList extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.ProcessDataMixin,
    FMMixins.CommonMethods,
    FMMixins.ReduxMixin], Polymer.Element) {

    public static get is() { return 'attachments-list'; }

    public static get properties() {
        return {
            dialogTexts: {
                type: Object,
                value: () => ({
                    create: {title: 'Upload Attachment', confirm: 'Upload', type: 'create'},
                    edit: {title: 'Edit Attachment', confirm: 'Save', type: 'edit'}
                })
            },
        };
    }

    public openUploadAttachment() {
        this.errors = null;
        this.resetInputs();
        const dialogTexts = this.dialogTexts['create'];
        this.dialog = {
            opened: true,
            type: 'create',
            ...dialogTexts
        };
        this.selectedModel = {};
        this.file = [];
    }

    public onFinishUpload() {
        const dialogType = this.dialog.type;
        if (dialogType === 'create') {
            this.createModel();
        } else if (dialogType === 'edit') {
            this.updateModel();
        }
    }

    public createModel() {
        const file = this.file[0];
        const fileType = this.selectedModel.file_type;
        if (!file || !fileType) { return; }
        const attachment = {
            file: file.raw,
            file_type: fileType
        };
        this.dispatchOnStore(addAttachment(attachment));
    }

    public updateModel() {
        const data = this.changesToRequest(this.originalData, this.selectedModel, this.permissions);
        const file = this.file[0];
        if (!this.selectedModel.id || R.isEmpty(data) && !file.raw) {
            this.dialog = { opened: false };
            return;
        }
        if (file.raw) {
            data.file = file.raw;
        }
        this.dispatchOnStore(updateAttachment(this.selectedModel.id, data));
    }

    public openDialog({ model }: EventModel<Attachment>) {
        const { item } = model;
        const dialogTexts = this.dialogTexts['edit'];
        this.dialog = {
            opened: true,
            type: 'edit',
            ...dialogTexts
        };

        this.file = [{ file_name: item.filename, path: item.file }];
        this.originalData = R.clone(item);
        this.selectedModel = R.clone(item);
    }

    public onDeleteAttachment({ model }: EventModel<Attachment>) {
        const { item } = model;
        this.selectedModel = {id: item.id};
        this.dialogDelete = { opened: true };
    }

    public onFinishDelete() {
        this.dispatchOnStore(deleteAttachment(this.selectedModel.id));
    }

    public isEditDialog(type: string) {
        return type === 'edit';
    }

    public isAllowEdit(permissions: IBackendPermissionActions): boolean {
        return permissions && !!permissions.POST;
    }

    public connectedCallback() {
        super.connectedCallback();

        this.dispatchOnStore(loadAttachments());
        const endpoint = getEndpoint('attachments') as StaticEndpoint;
        this.dispatchOnStore(loadPermissions(endpoint.url, 'attachments'));

        this.permissionSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'attachments'], store),
            (permissions: IBackendPermissions) => {
                this.permissions = permissions;
                this.fileTypes = permissions && this.getDescriptorChoices(permissions, 'file_type') || [];
            });

        this.attachmentsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['attachments', 'data'], store),
            (attachments: IListData<Attachment>) => {
                this.attachments = attachments && attachments.results;
                this.count = attachments && attachments.count;
            });

        this.requestAttachmentsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['attachments', 'requestInProcess'], store),
            (requestInProcess: boolean | null) => {
                this.requestInProcess = requestInProcess;
                if (requestInProcess !== false) { return; }

                this.errors = this.getFromStore('attachments.errors');
                if (this.errors) { return; }

                this.dispatchOnStore(loadAttachments());
                this.dialog = {opened: false};
                this.dialogDelete = {opened: false};
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
