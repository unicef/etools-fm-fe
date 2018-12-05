import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';
import { getEndpoint } from '../../../app-config/app-config';
import { createLogIssue, loadLogIssues, updateLogIssue } from '../../../redux-store/effects/log-issues.effects';
import { AddNotification } from '../../../redux-store/actions/notification.actions';

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
            count: Number
        };
    }

    public getInitQueryParams(): QueryParams {
        return {
            page: 1,
            page_size: 10,
            cp_output__in: [],
            partner__in: [],
            location_site__in: []
        };
    }

    public connectedCallback() {
        super.connectedCallback();
        this.addEventListener('sort-changed', this.sort);
        this.addEventListener('add-new', () => this.openCreateLogIssue());

        const endpoint = getEndpoint('logIssues') as StaticEndpoint;
        this.dispatchOnStore(loadPermissions(endpoint.url, 'logIssues'));

        this.logIssuesSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'logIssues'),
            (logIssues: IListData<LogIssue>) => {
                this.logIssues = logIssues.results || [];
                this.count = logIssues.count;
            });

        this.cpOutputsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'staticData.monitoredCpOutputs'),
            (cpOutputs: IListData<CpOutput>) => {
                this.cpOutputs = cpOutputs || [];
            });

        this.monitoredPartnersSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'staticData.monitoredPartners'),
            (monitoredPartners: []) => {
                this.monitoredPartners = monitoredPartners || [];
            });

        this.locationsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'staticData.locations'),
            (locations: IListData<ISiteParrentLocation>) => {
                this.locations = locations || [];
            });

        this.sitesSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'staticData.siteLocations'),
            (siteLocations: IListData<Site>) => {
                this.siteLocations = siteLocations || [];
            });

        this.permissionsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'permissions.logIssues'),
            (permissions: IBackendPermissions) => {
                this.permissions = permissions;
                if (permissions) {
                    this.statuses = this.getDescriptorChoices(permissions, 'status') || [];
                    this.relatedTypes = this.getDescriptorChoices(permissions, 'related_to_type') || [];
                }
            });

        this.permissionsDetailsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'permissions.logIssuesDetails'),
            (permissions: IBackendPermissions) => {
                this.permissionsDetails = permissions;
            });

        this.requestLogIssuesSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'logIssues.requestInProcess'),
            (requestInProcess: boolean | null) => {
                this.requestInProcess = requestInProcess;
                if (requestInProcess !== false) { return; }

                this.errors = this.getFromStore('logIssues.errors');
                if (this.errors && !_.isEmpty(this.errors)) {
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
        this.disconnectedCallback();
        this.removeEventListener('sort-changed', this.sort);
        this.removeEventListener('create-log-issue', this.openCreateLogIssue);
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
        this.dialog = {
            opened: true,
            confirm: 'Save',
            title: 'Create Log Issue',
            relatedToType: 'cp_output',
            type: 'create'
        };
        this.issue = {};
        this.currentFiles = [];
        // set permissions for create
        this.permissionsDetails = this.permissions;
    }

    public openEditLogIssue({ model }: EventModel<LogIssue>) {
        const { item } = model;
        if  (!item.id) { return; }
        const files = item.attachments.map((attachment: Attachment) => this.transformAttachmentToFile(attachment));
        this.dialog = {
            opened: true,
            confirm: 'Save',
            title: 'Edit Log Issue',
            relatedToType: item.related_to_type,
            type: 'edit'
        };
        this.originalIssue = _.cloneDeep(item);
        this.issue = _.cloneDeep(item);
        this.originalFiles = _.cloneDeep(files);
        this.currentFiles = _.cloneDeep(files);
        // load permissions for update
        const endpoint = getEndpoint('logIssuesDetails', {id: item.id}) as StaticEndpoint;
        this.dispatchOnStore(loadPermissions(endpoint.url, 'logIssuesDetails'));
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

    public isEditDialog(type: string) {
        return type === 'edit';
    }

    public onFinishDialog() {
        const issue = this.issue;
        if (this.dialog.type === 'create') {
            const files = this.currentFiles;
            this.createIssue(issue, files);
        }
        if (this.dialog.type === 'edit') {
            this.updateIssue(issue);
        }
    }

    public resetData({ target }: CustomEvent): void {
        if (target !== this.$.dialog) { return; }
        this.dialog = null;
        this.resetInputs();
        this.issue = {};
        this.errors = null;
    }

    public createIssue(issue: LogIssue, files: AttachmentFile[]) {
        const attachments: Attachment[] = files.map(file => ({file: file.raw})) ;
        this.dispatchOnStore(createLogIssue(issue, attachments));
    }

    public updateIssue(issue: LogIssue) {
        const data = this.changesToRequest(this.originalIssue, this.issue, this.permissions);
        const changedFiles: Attachment[] = this.getChangedFiles(this.originalFiles, this.currentFiles);
        const newFiles: Attachment[] = this.getNewFiles(this.currentFiles);
        const deletedFiles: Attachment[] = this.getDeletedFiles(this.originalFiles, this.currentFiles);
        if (!issue.id || _.isEmpty(data) && !newFiles.length &&  !deletedFiles.length && !changedFiles.length) {
            this.dialog = { opened: false };
            return;
        }
        this.dispatchOnStore(updateLogIssue(issue.id, data, newFiles, deletedFiles, changedFiles));
    }

    public isType(field: string, value: string) {
        return field === value;
    }

    public changeSitesFilter({ detail }: CustomEvent) {
        const { selectedItems } = detail;
        if (selectedItems && selectedItems.length) {
            const values = selectedItems.map((item: ISiteParrentLocation) => item.id);
            this.updateQueryParams({location_site__in: values});
        } else {
            this.updateQueryParams({page: 1, location_site__in: []});
        }
        this.startLoad();
    }

    public changePartnerFilter({ detail }: CustomEvent) {
        const { selectedItems } = detail;
        if (selectedItems && selectedItems.length) {
            const values = selectedItems.map((item: Partner) => item.id);
            this.updateQueryParams({partner__in: values});
        } else {
            this.updateQueryParams({page: 1, partner__in: []});
        }
        this.startLoad();
    }

    public changeCpOutputsFilter({ detail }: CustomEvent) {
        const { selectedItems } = detail;
        if (selectedItems && selectedItems.length) {
            const values = selectedItems.map((item: CpOutput) => item.id);
            this.updateQueryParams({cp_output__in: values});
        } else {
            this.updateQueryParams({page: 1, cp_output__in: []});
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

    public setIssuePartner({ detail }: CustomEvent) {
        const selectedItem = detail.selectedItem;
        if (selectedItem && selectedItem.id) {
            this.issue.partner = selectedItem.id;
        } else {
            this.issue.cp_output = null;
        }
    }

    public setIssueCpOutput({ detail }: CustomEvent) {
        const selectedItem = detail.selectedItem;
        if (selectedItem && selectedItem.id) {
            this.issue.cp_output = selectedItem.id;
        } else {
            this.issue.cp_output = null;
        }
    }

    public setIssueLocation({ detail }: CustomEvent) {
        const selectedItem = detail.selectedItem;
        if (selectedItem && selectedItem.id) {
            this.issue.location = selectedItem.id;
        } else {
            this.issue.cp_output = null;
        }
    }

    public setIssueLocationSite({ detail }: CustomEvent) {
        const selectedItem = detail.selectedItem;
        if (selectedItem && selectedItem.id) {
            this.issue.location_site = selectedItem.id;
        } else {
            this.issue.cp_output = null;
        }
    }

    public getColumnRelatedTypeValue(item: LogIssue) {
        let type = 'cp_output';
        if (item.partner) {
            type = 'partner';
        } else if (item.location_site) {
            type = 'location_site';
        }
        return this.getChoiceLabel(type, this.relatedTypes);
    }

    public getColumnNameValue(item: LogIssue) {
        if (item.partner) {
            return item.partner.name;
        } else if (item.location_site) {
            return item.location_site.name;
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
