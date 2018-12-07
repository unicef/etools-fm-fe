import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';
import { getEndpoint } from '../../../app-config/app-config';
import { createLogIssue, loadLogIssues, updateLogIssue } from '../../../redux-store/effects/log-issues.effects';
import { AddNotification } from '../../../redux-store/actions/notification.actions';
import { locationsInvert } from '../../settings/sites-tab/locations-invert';
import { loadSiteLocations } from '../../../redux-store/effects/site-specific-locations.effects';

class PreparationTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.ProcessDataMixin,
    FMMixins.CommonMethods,
    FMMixins.ReduxMixin,
    FMMixins.RouteHelperMixin], Polymer.Element) {
    public static get is() {
        return 'preparation-tab';
    }

    public static get properties() {
        return {
            count: Number,
            dialogTexts: {
                type: Object,
                value: () => ({
                    add: {title: 'Log Issue', confirm: 'Log', type: 'create'},
                    edit: {title: 'Edit Issue', confirm: 'Save', type: 'edit'},
                    view: {title: 'View Issue', confirm: '', type: 'view'}
                })
            },
            errors: {
                type: Object
            },
            selectedModel: {
                type: Object,
                value: () => ({})
            }
        };
    }

    public getInitQueryParams(): QueryParams {
        return {
            page: 1,
            page_size: 10,
            cp_output__in: [],
            partner__in: [],
            location_site__in: [],
            status: 'new'
        };
    }

    public connectedCallback() {
        super.connectedCallback();
        this.addEventListener('sort-changed', this.sort);
        this.addEventListener('add-new', () => this.openCreateLogIssue());

        const endpoint = getEndpoint('logIssues') as StaticEndpoint;
        this.dispatchOnStore(loadPermissions(endpoint.url, 'logIssues'));
        if (!this.getFromStore('specificLocations.results')) {
            this.dispatchOnStore(loadSiteLocations());
        }

        this.logIssuesSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['logIssues'], store),
            (logIssues: IListData<LogIssue>) => {
                this.logIssues = logIssues.results || [];
                this.count = logIssues.count;
            });

        this.cpOutputsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'monitoredCpOutputs'], store),
            (cpOutputs: IListData<CpOutput>) => {
                this.cpOutputs = cpOutputs || [];
            });

        this.monitoredPartnersSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'monitoredPartners'], store),
            (monitoredPartners: []) => {
                this.monitoredPartners = monitoredPartners || [];
            });

        this.sitesSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['specificLocations'], store),
            (sites: IStatedListData<Site> | undefined) => {
                if (!sites) { return; }
                const sitesObject = sites.results || [];
                this.locations = locationsInvert(sitesObject);
            });

        this.permissionsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'logIssues'], store),
            (permissions: IBackendPermissions) => {
                this.permissions = permissions;
                if (permissions) {
                    this.statuses = this.getDescriptorChoices(permissions, 'status') || [];
                    this.relatedTypes = this.getDescriptorChoices(permissions, 'related_to_type') || [];
                }
            });

        this.permissionsDetailsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'logIssuesDetails'], store),
            (permissions: IBackendPermissions) => {
                this.permissionsDetails = permissions;
            });

        this.requestLogIssuesSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['logIssues', 'requestInProcess'], store),
            (requestInProcess: boolean | null) => {
                this.requestInProcess = requestInProcess;
                if (requestInProcess !== false) { return; }

                this.errors = this.getFromStore('logIssues.errors');
                if (this.errors && !R.isEmpty(this.errors)) {
                    const nonFieldErrors = this.errors.non_field_errors;
                    if (nonFieldErrors) {
                        nonFieldErrors.forEach((error: string) => this.dispatchOnStore(new AddNotification(error)));
                    }
                    return;
                }

                this.updateQueryParams({page: 1});
                this.dialog = {opened: false};
                this.startLoad();
            });
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('sort-changed', this.sort);
        this.removeEventListener('add-new', this.openCreateLogIssue);
        this.logIssuesSubscriber();
        this.cpOutputsSubscriber();
        this.monitoredPartnersSubscriber();
        this.locationsSubscriber();
        this.sitesSubscriber();
        this.permissionsSubscriber();
        this.permissionsDetailsSubscriber();
        this.requestLogIssuesSubscriber();
    }

    public openCreateLogIssue() {
        const dialogTexts = this.dialogTexts['add'];
        this.dialog = {
            opened: true,
            relatedToType: 'cp_output',
            ...dialogTexts
        };
        this.selectedModel = { status: 'new' };
        this.currentFiles = [];
        // set permissions for create
        this.permissionsDetails = this.permissions;
    }

    public openEditLogIssue({ model }: EventModel<LogIssue>) {
        const { item } = model;
        if  (!item.id) { return; }
        const files = item.attachments.map((attachment: Attachment) => this.transformAttachmentToFile(attachment));

        const dialogTexts = this.dialogTexts['edit'];
        this.dialog = {
            opened: true,
            relatedToType: item.related_to_type,
            ...dialogTexts
        };

        this.originalData = R.clone(item);
        this.selectedModel = R.clone(item);
        this.originalFiles = R.clone(files);
        this.currentFiles = R.clone(files);

        // load permissions for update
        const endpoint = getEndpoint('logIssuesDetails', {id: item.id}) as StaticEndpoint;
        this.dispatchOnStore(loadPermissions(endpoint.url, 'logIssuesDetails'));
    }

    public openViewDialog(event: EventModel<LogIssue>) {
        this.openEditLogIssue(event);
        const dialogTexts = this.dialogTexts['view'];
        this.dialog = {
            ...this.dialog,
            ...dialogTexts
        };
    }

    public onDownloadFiles({ model }: EventModel<LogIssue>) {
        const { item } = model;
        if  (!item.id) { return; }
        item.attachments.forEach((attach: Attachment) => {
            if (attach.file && typeof attach.file === 'string') {
                window.open(attach.file);
            }
        });
    }

    public isAllowEdit(model: LogIssue, permissions: IBackendPermissions) {
        return model.status !== 'past' && this.actionAllowed(permissions, 'create');
    }

    public isDialogType(type: string, ...allowedTypes: string[]) {
        return !!~allowedTypes.indexOf(type);
    }

    public validate() {
        const type = this.dialog.relatedToType;
        if (type === 'cp_output' && !this.selectedModel.cp_output ) {
            this.errors = {...this.errors, ...{cp_output: 'Cp Output is not provided'}};
            return false;
        }
        if (type === 'partner' && !this.selectedModel.partner ) {
            this.errors = {...this.errors, ...{partner: 'Partner is not provided'}};
            return false;
        }
        if (type === 'location') {
            if (!this.selectedModel.location) {
                this.errors = {...this.errors, ...{location: 'Location is not provided'}};
                return false;
            }
            if (!this.selectedModel.location_site) {
                this.errors = {...this.errors, ...{location_site: 'Location Site is not provided'}};
                return false;
            }
        }
        return true;
    }

    public onFinishDialog() {
        if (!this.validate()) { return; }
        if (this.dialog.type === 'create') {
            const files = this.currentFiles;
            this.createIssue(this.selectedModel, files);
        }
        if (this.dialog.type === 'edit') {
            this.updateIssue(this.selectedModel);
        }
    }

    public resetData({ target }: CustomEvent): void {
        if (target !== this.$.dialog) { return; }
        this.dialog = null;
        this.resetInputs();
        this.selectedModel = {};
        this.errors = null;
    }

    public createIssue(issue: LogIssue, files: AttachmentFile[]) {
        const attachments: Attachment[] = files.map(file => ({file: file.raw})) ;
        this.dispatchOnStore(createLogIssue(issue, attachments));
    }

    public updateIssue(issue: LogIssue) {
        const data = this.changesToRequest(this.originalData, this.selectedModel, this.permissions);
        const changedFiles: Attachment[] = this.getChangedFiles(this.originalFiles, this.currentFiles);
        const newFiles: Attachment[] = this.getNewFiles(this.currentFiles);
        const deletedFiles: Attachment[] = this.getDeletedFiles(this.originalFiles, this.currentFiles);
        if (!issue.id || R.isEmpty(data) && !newFiles.length &&  !deletedFiles.length && !changedFiles.length) {
            this.dialog = { opened: false };
            return;
        }
        this.dispatchOnStore(updateLogIssue(issue.id, data, newFiles, deletedFiles, changedFiles));
    }

    public isType(field: string, value: string) {
        return field === value;
    }

    public changeFilter({ detail, target }: CustomEvent) {
        const { selectedItems } = detail;
        const property = (target as HTMLElement).dataset.property;
        if (!property) { throw new Error('Filter must contain data property attribute'); }

        if (selectedItems && selectedItems.length) {
            const values = selectedItems.map((item: any) => item.id);
            this.updateQueryParams({[property]: values});
        } else {
            this.updateQueryParams({page: 1, [property]: []});
        }
        this.startLoad();
    }

    public changeOnlyNewFilter({ detail }: CustomEvent) {
        const checked = detail.value;
        if (checked) {
            this.updateQueryParams({status: 'new'});
        } else {
            this.removeQueryParams('status');
        }
        this.updateQueryParams({page: 1});
        this.startLoad();
    }

    public _pageNumberChanged({detail}: CustomEvent) {
        this.updateQueryParams({page: detail.value});
        this.startLoad();
    }

    public _pageSizeSelected({detail}: CustomEvent) {
        this.updateQueryParams({page_size: detail.value});
        this.startLoad();
    }

    public setValue({ detail, target }: CustomEvent) {
        const fieldName = (target as HTMLElement).dataset.fieldname || '';
        const { selectedItem } = detail;
        this.selectedModel[fieldName] = selectedItem && selectedItem.id || null;
    }

    public setLocation(e: CustomEvent) {
        this.setValue(e);
        const locationId = this.selectedModel && this.selectedModel.location;
        if (!locationId) { return; }
        const location = this.locations.find((item: ISiteParrentLocation) => item.id === locationId);
        this.locationSites = location && location.sites || [];
    }

    public getColumnRelatedTypeValue(item: LogIssue) {
        let type = 'cp_output';

        if (item.partner) {
            type = 'partner';
        } else if (item.location_site) {
            type = 'location';
        }
        return this.getChoiceLabel(type, this.relatedTypes);
    }

    public getColumnNameValue(item: LogIssue) {
        if (item.partner) {
            return item.partner.name;
        } else if (item.location && item.location_site) {
            return `${item.location.name} - ${item.location_site.name}`;
        } else if (item.cp_output) {
            return item.cp_output.name;
        }
        return '';
    }

    public finishLoad() {
        this._debounceLoadData = Polymer.Debouncer.debounce(this._debounceLoadData,
            Polymer.Async.timeOut.after(100), () => {
                this.dispatchOnStore(loadLogIssues(this.queryParams));
            });
    }

    public sort({ detail }: CustomEvent) {
        const { field, direction } = detail;
        this.updateQueryParams({ordering: `${direction === 'desc' ? '-' : ''}${field}`});
        this.startLoad();
    }

    private getChangedFiles(originalFiles: AttachmentFile[], currentFiles: AttachmentFile[]): Attachment[] {
        const changedFiles: Attachment[] = [];
        originalFiles.forEach((originalFile: AttachmentFile) => {
            if (currentFiles.some((currentFile: AttachmentFile) =>
                currentFile.id === originalFile.id && !!currentFile.raw && !currentFile.path)) {
                const attachment = this.transformFileToAttachment(originalFile);
                changedFiles.push(attachment);
            }
        });
        return changedFiles;
    }

    private getNewFiles(currentFiles: AttachmentFile[]): Attachment[] {
        const newFiles: Attachment[] = [];
        currentFiles.forEach((currentFile: AttachmentFile) => {
            if (!currentFile.id) {
                const attachment = this.transformFileToAttachment(currentFile);
                newFiles.push(attachment);
            }
        });
        return newFiles;
    }

    private getDeletedFiles(originalFiles: AttachmentFile[], currentFiles: AttachmentFile[]): Attachment[] {
        const deletedFiles: Attachment[] = [];
        originalFiles.forEach((originalFile: AttachmentFile) => {
            if (!currentFiles.some((currentFile: AttachmentFile) => currentFile.id === originalFile.id)) {
                const attachment = this.transformFileToAttachment(originalFile);
                deletedFiles.push(attachment);
            }
        });
        return deletedFiles;
    }

    private transformFileToAttachment(file: AttachmentFile): Attachment {
        const attachment: Attachment = { file: file.raw ? file.raw : file.path };
        if (file.id) { attachment.id = file.id; }
        if (file.file_name) { attachment.filename = file.file_name; }
        return attachment;
    }

    private transformAttachmentToFile(attachment: Attachment): AttachmentFile {
        const file: AttachmentFile = {
            id: attachment.id,
            file_name: attachment.filename || ''
        };
        if (attachment.file && typeof attachment.file === 'string') { file.path = attachment.file; }
        return file;
    }
}

customElements.define(PreparationTab.is, PreparationTab);
