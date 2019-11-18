import {CSSResultArray, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {Unsubscribe} from 'redux';
import {clone} from 'ramda';
import {store} from '../../../../../redux/store';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {issueTrackerIsUpdate} from '../../../../../redux/selectors/issue-tracker.selectors';
import {getDifference} from '../../../../utils/objects-diff';
import {createLogIssue, updateLogIssue} from '../../../../../redux/effects/issue-tracker.effects';
import {template} from './issue-tracker-popup.tpl';
import {PaperRadioButtonElement} from '@polymer/paper-radio-button/paper-radio-button';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../styles/card-styles';
import {IssueTrackerPopupStyles} from './issue-tracker-popu.styles';
import {SiteMixin} from '../../../../common/mixins/site-mixin';
import {CpOutputsMixin} from '../../../../common/mixins/cp-outputs-mixin';
import {PartnersMixin} from '../../../../common/mixins/partners-mixin';
import {DataMixin} from '../../../../common/mixins/data-mixin';

@customElement('issue-tracker-popup')
export class IssueTrackerPopup extends PartnersMixin(CpOutputsMixin(SiteMixin(DataMixin()<LogIssue>(LitElement)))) {
  isNew: boolean = false;
  isRequest: boolean = false;
  isReadOnly: boolean = false;

  relatedTypes: RelatedType[] = ['cp_output', 'partner', 'location'];

  @property()
  relatedToType: RelatedType = 'cp_output';

  @property({type: Array})
  outputs: EtoolsCpOutput[] = [];

  @property({type: Array})
  partners: EtoolsPartner[] = [];

  @property({type: Array})
  locations: IGroupedSites[] = [];

  @property({type: Array})
  locationSites: Site[] = [];

  @property() dialogOpened: boolean = true;

  @property({type: Array})
  currentFiles: Partial<IAttachment>[] = [];

  @property({type: Array})
  originalFiles: IAttachment[] = [];

  private readonly updateUnsubscribe: Unsubscribe;

  constructor() {
    super();
    this.updateUnsubscribe = store.subscribe(
      issueTrackerIsUpdate((isRequest: boolean | null) => {
        // set updating state for spinner
        this.isRequest = Boolean(isRequest);
        if (isRequest) {
          return;
        }

        // check errors on update(create) complete
        this.errors = store.getState().issueTracker.error;
        if (this.errors && Object.keys(this.errors).length) {
          return;
        }

        // close popup if update(create) was successful
        this.dialogOpened = false;
        fireEvent(this, 'response', {confirmed: true});
      }, false)
    );
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, IssueTrackerPopupStyles];
  }

  set readonly(value: boolean) {
    this.isReadOnly = value;
  }

  set dialogData(data: LogIssue) {
    super.data = data;
    this.isNew = !data;
    if (this.isNew) {
      this.editedData.status = 'new';
      return;
    }
    this.relatedToType = this.editedData.related_to_type || 'cp_output';
    this.originalFiles = clone(data.attachments);
    this.currentFiles = clone(data.attachments);
  }

  render(): TemplateResult {
    return template.call(this);
  }

  onClose(): void {
    fireEvent(this, 'response', {confirmed: false});
  }

  processRequest(): void {
    if (!this.validate()) {
      return;
    }
    if (this.isNew) {
      this.createIssue();
    } else {
      this.updateIssue();
    }
  }

  validate(): boolean {
    const type: RelatedType = this.relatedToType;
    if (type === 'cp_output' && !this.editedData.cp_output) {
      this.errors = {...this.errors, ...{cp_output: 'Cp Output is not provided'}};
      return false;
    }
    if (type === 'partner' && !this.editedData.partner) {
      this.errors = {...this.errors, ...{partner: 'Partner is not provided'}};
      return false;
    }
    if (type === 'location') {
      if (!this.editedData.location) {
        this.errors = {...this.errors, ...{location: 'Location is not provided'}};
        return false;
      }
    }
    return true;
  }

  resetData(target: EventTarget | null): void {
    if (this.shadowRoot && target !== this.shadowRoot.querySelector('#dialog')) {
      return;
    }
    this.errors = {};
  }

  createIssue(): void {
    if (!this.editedData) {
      return;
    }
    // const files: File[] = this.etoolsUploadMulti.rawFiles && Array.from(this.etoolsUploadMulti.rawFiles) || [];
    store.dispatch<AsyncEffect>(createLogIssue(this.editedData, this.currentFiles));
  }

  updateIssue(): void {
    if (!this.editedData) {
      return;
    }
    const originalData: Partial<LogIssue> = this.originalData || {};
    const data: Partial<LogIssue> = getDifference<LogIssue>(originalData, this.editedData, {
      toRequest: true,
      nestedFields: ['options']
    });
    const newFiles: Partial<IAttachment>[] = this.getNewFiles(this.currentFiles);
    // const files: File[] = this.etoolsUploadMulti.rawFiles && Array.from(this.etoolsUploadMulti.rawFiles) || [];
    const deletedFiles: Partial<IAttachment>[] = this.getDeletedFiles(this.currentFiles, this.originalFiles);
    const changedFiles: Partial<IAttachment>[] = this.getChangedFiles(this.currentFiles);
    const isChanged: boolean = !!Object.keys(data).length;
    if (!this.editedData.id || (!isChanged && !newFiles.length && !deletedFiles.length && !changedFiles.length)) {
      this.dialogOpened = false;
      this.onClose();
      return;
    }
    store.dispatch<AsyncEffect>(updateLogIssue(this.editedData.id, data, newFiles, deletedFiles, changedFiles));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.updateUnsubscribe();
  }

  changeRelatedType(item: PaperRadioButtonElement): void {
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

  setLocation(value: any): void {
    this.updateModelValue('location', value);
    const locationId: string | undefined = this.editedData && ((this.editedData.location as unknown) as string);
    if (!locationId) {
      return;
    }
    const location: IGroupedSites | undefined = this.locations.find(
      (item: ISiteParrentLocation) => item.id === locationId
    );
    this.locationSites = (location && location.sites) || [];
  }

  onChangeFile({id, file}: SelectedFile): void {
    const indexAttachment: number = this.currentFiles.findIndex(
      (nextAttachment: Partial<IAttachment>) => nextAttachment.id === id
    );
    if (~indexAttachment) {
      this.currentFiles.splice(indexAttachment, 1, {id, file});
    }
  }

  onAddFile(file: File): void {
    this.currentFiles = [
      ...this.currentFiles,
      ...[
        {
          filename: file.name,
          file
        }
      ]
    ];
  }

  onDeleteFile({id}: SelectedFile): void {
    const indexAttachment: number = this.currentFiles.findIndex(
      (nextAttachment: Partial<IAttachment>) => nextAttachment.id === id
    );
    if (~indexAttachment) {
      this.currentFiles.splice(indexAttachment, 1);
      this.currentFiles = [...this.currentFiles];
    }
  }

  private getChangedFiles(currentFiles: Partial<IAttachment>[]): Partial<IAttachment>[] {
    return currentFiles.filter(
      (attachment: Partial<IAttachment>) =>
        attachment.id && !(typeof attachment.file === 'string' || attachment.file instanceof String)
    );
  }

  private getNewFiles(currentFiles: Partial<IAttachment>[]): Partial<IAttachment>[] {
    return currentFiles.filter((currentFile: Partial<IAttachment>) => !currentFile.id);
  }

  private getDeletedFiles(currentFiles: Partial<IAttachment>[], originalFiles: IAttachment[]): Partial<IAttachment>[] {
    return originalFiles.filter(
      (originalFile: Partial<IAttachment>) =>
        !currentFiles.some((currentFile: Partial<IAttachment>) => currentFile.id === originalFile.id)
    );
  }
}
