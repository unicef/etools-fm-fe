import { CSSResultArray, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { Unsubscribe } from 'redux';
import { clone } from 'ramda';
import { store } from '../../../../redux/store';
import { fireEvent } from '../../../utils/fire-custom-event';
import { issueTrackerUpdate } from '../../../../redux/selectors/issue-tracker.selectors';
import { getDifference } from '../../../utils/objects-diff';
import { createLogIssue, updateLogIssue } from '../../../../redux/effects/issue-tracker.effects';
import { outputsDataSelector, partnersDataSelector } from '../../../../redux/selectors/static-data.selectors';
import { sitesSelector } from '../../../../redux/selectors/site-specific-locations.selectors';
import { locationsInvert } from '../../settings/sites-tab/locations-invert';
import { template } from './issue-tracker-popup.tpl';
import { PaperRadioButtonElement } from '@polymer/paper-radio-button/paper-radio-button';
import { SelectedFile } from '../../../common/file-components/file-select-input';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { CardStyles } from '../../../styles/card-styles';
import { IssueTrackerPopupStyles } from './issue-tracker-popu.styles';

@customElement('issue-tracker-popup')
export class IssueTrackerPopup extends LitElement {
    public isNew: boolean = false;
    public isRequest: boolean = false;
    public isReadOnly: boolean = false;

    public relatedTypes: RelatedType[] = ['cp_output', 'partner', 'location'];

    @property()
    public relatedToType: RelatedType = 'cp_output';

    @property({ type: Array })
    public outputs: EtoolsCpOutput[] = [];

    @property({ type: Array })
    public partners: EtoolsPartner[] = [];

    @property({ type: Array })
    public locations: IGroupedSites[] = [];

    @property({ type: Array })
    public locationSites: Site[] = [];

    @property() public dialogOpened: boolean = true;
    @property() public errors: GenericObject = {};

    @property() public editedData: Partial<LogIssue> = {};
    public originalData: LogIssue | null = null;

    @property({ type: Array })
    public currentFiles: Partial<Attachment>[] = [];

    @property({ type: Array })
    public originalFiles: Attachment[] = [];

    private readonly updateUnsubscribe: Unsubscribe;
    private readonly sitesUnsubscribe: Unsubscribe;
    private readonly outputsUnsubscribe!: Unsubscribe;
    private readonly partnersUnsubscribe!: Unsubscribe;

    public set readonly(value: boolean) {
        this.isReadOnly = value;
    }

    public set data(data: LogIssue) {
        this.isNew = (!data);
        if (this.isNew) {
            this.editedData.status = 'new';
            return;
        }
        this.editedData = { ...this.editedData, ...data };
        this.relatedToType = this.editedData.related_to_type || 'cp_output';
        this.originalData = clone(data);
        this.originalFiles = clone(data.attachments);
        this.currentFiles = clone(data.attachments);
    }

    public constructor() {
        super();
        this.updateUnsubscribe = store.subscribe(issueTrackerUpdate((isRequest: boolean | null) => {
            // set updating state for spinner
            this.isRequest = Boolean(isRequest);
            if (isRequest) { return; }

            // check errors on update(create) complete
            this.errors = store.getState().issueTracker.error;
            if (this.errors && Object.keys(this.errors).length) { return; }

            // close popup if update(create) was successful
            this.dialogOpened = false;
            fireEvent(this, 'response', { confirmed: true });
        }, false));

        this.sitesUnsubscribe = store.subscribe(sitesSelector((sites: Site[] | null) => {
            if (!sites) { return; }
            this.locations = locationsInvert(sites);
        }));

        this.outputsUnsubscribe = store.subscribe(outputsDataSelector((outputs: EtoolsCpOutput[] | undefined) => {
            if (!outputs) { return; }
            this.outputs = outputs;
        }));
        this.partnersUnsubscribe = store.subscribe(partnersDataSelector((partners: EtoolsPartner[] | undefined) => {
            if (!partners) { return; }
            this.partners = partners;
        }));
    }

    public onClose(): void {
        fireEvent(this, 'response', { confirmed: false });
    }

    public processRequest(): void {
        if (!this.validate()) { return; }
        if (this.isNew) {
            this.createIssue();
        } else {
            this.updateIssue();
        }
    }

    public validate(): boolean {
        const type: RelatedType = this.relatedToType;
        if (type === 'cp_output' && !this.editedData.cp_output ) {
            this.errors = { ...this.errors, ...{ cp_output: 'Cp Output is not provided' } };
            return false;
        }
        if (type === 'partner' && !this.editedData.partner ) {
            this.errors = { ...this.errors, ...{ partner: 'Partner is not provided' } };
            return false;
        }
        if (type === 'location') {
            if (!this.editedData.location) {
                this.errors = { ...this.errors, ...{ location: 'Location is not provided' } };
                return false;
            }
        }
        return true;
    }

    public resetData(target: EventTarget | null): void {
        if (this.shadowRoot && target !== this.shadowRoot.querySelector('#dialog')) { return; }
        this.errors = {};
    }

    public createIssue(): void {
        if (!this.editedData) { return; }
        // const files: File[] = this.etoolsUploadMulti.rawFiles && Array.from(this.etoolsUploadMulti.rawFiles) || [];
        store.dispatch<AsyncEffect>(createLogIssue(this.editedData, this.currentFiles));
    }

    public updateIssue(): void {
        if (!this.editedData) { return; }
        const data: Partial<LogIssue> = getDifference<any>(
            this.originalData,
            this.editedData,
            { toRequest: true, nestedFields: ['options'] });
        const newFiles: Partial<Attachment>[] = this.getNewFiles(this.currentFiles);
        // const files: File[] = this.etoolsUploadMulti.rawFiles && Array.from(this.etoolsUploadMulti.rawFiles) || [];
        const deletedFiles: Partial<Attachment>[] = this.getDeletedFiles(this.currentFiles, this.originalFiles);
        const changedFiles: Partial<Attachment>[] = this.getChangedFiles(this.currentFiles);
        const isChanged: boolean = !!Object.keys(data).length;
        if (!this.editedData.id || !isChanged && !newFiles.length && !deletedFiles.length && !changedFiles.length) {
            this.dialogOpened = false;
            this.onClose();
            return;
        }
        store.dispatch<AsyncEffect>(updateLogIssue(this.editedData.id, data, newFiles, deletedFiles, changedFiles));
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.updateUnsubscribe();
        this.sitesUnsubscribe();
        this.outputsUnsubscribe();
        this.partnersUnsubscribe();
    }

    public static get styles(): CSSResultArray {
        return [SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, IssueTrackerPopupStyles];
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public resetFieldError(fieldName: string): void {
        if (!this.errors) { return; }
        delete this.errors[fieldName];
        this.performUpdate();
    }

    public updateModelValue(fieldName: keyof LogIssue, value: any): void {
        if (!this.editedData) { return; }
        // sets values from inputs to model, refactor arrays with objects to ids arrays
        this.editedData[fieldName] = !Array.isArray(value) ?
            value :
            value.map((item: any) => item.id);
    }

    public changeRelatedType(item: PaperRadioButtonElement): void {
        const type: RelatedType = item.get('name');
        this.relatedToType = type;
        if (type !== this.editedData.related_to_type) {
            this.editedData.partner = null;
            this.editedData.cp_output = null;
            this.editedData.location = null;
            this.editedData.location_site = null;
            this.editedData.related_to_type = type;
        }
    }

    public setLocation(value: any): void {
        this.updateModelValue('location', value);
        const locationId: string | undefined = this.editedData && this.editedData.location as unknown as string;
        if (!locationId) { return; }
        const location: IGroupedSites | undefined = this.locations.find((item: ISiteParrentLocation) => item.id === locationId);
        this.locationSites = location && location.sites || [];
    }

    public onChangeFile({ id, file }: SelectedFile): void {
        const indexAttachment: number = this.currentFiles
            .findIndex((nextAttachment: Partial<Attachment>) => nextAttachment.id === id);
        if (~indexAttachment) {
            this.currentFiles.splice(indexAttachment, 1, { id, file });
        }
    }

    public onAddFile(file: File): void {
        this.currentFiles = [...this.currentFiles, ...[{
            filename: file.name,
            file
        }]];
    }

    public onDeleteFile({ id }: SelectedFile): void {
        const indexAttachment: number = this.currentFiles
            .findIndex((nextAttachment: Partial<Attachment>) => nextAttachment.id === id);
        if (~indexAttachment) {
            this.currentFiles.splice(indexAttachment, 1);
            this.currentFiles = [...this.currentFiles];
        }
    }

    private getChangedFiles(currentFiles: Partial<Attachment>[]): Partial<Attachment>[] {
        return currentFiles
            .filter((attachment: Partial<Attachment>) =>
                attachment.id && !(typeof attachment.file === 'string' || attachment.file instanceof String));
    }

    private getNewFiles(currentFiles: Partial<Attachment>[]): Partial<Attachment>[] {
        return currentFiles
            .filter((currentFile: Partial<Attachment>) => (!currentFile.id));
    }

    private getDeletedFiles(currentFiles: Partial<Attachment>[], originalFiles: Attachment[]): Partial<Attachment>[] {
        return originalFiles
            .filter((originalFile: Partial<Attachment>) =>
                !currentFiles.some((currentFile: Partial<Attachment>) => currentFile.id === originalFile.id));
    }
}
