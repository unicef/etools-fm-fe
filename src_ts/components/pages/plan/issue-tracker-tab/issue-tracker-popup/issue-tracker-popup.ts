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
import {translate} from 'lit-translate';

@customElement('issue-tracker-popup')
export class IssueTrackerPopup extends PartnersMixin(CpOutputsMixin(SiteMixin(DataMixin()<LogIssue>(LitElement)))) {
  isNew: boolean = false;
  isRequest: boolean = false;
  isReadOnly: boolean = false;
  @property() attachments: StoredAttachment[] = [];

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
  currentFiles: IAttachment[] = [];

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
        this.errors = store.getState().issueTracker.error?.data;
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
      this.errors = {...this.errors, ...{cp_output: translate('ISSUE_TRACKER.POPUP_ERROR_CP_OUTPUT')}};
      return false;
    }
    if (type === 'partner' && !this.editedData.partner) {
      this.errors = {...this.errors, ...{partner: translate('ISSUE_TRACKER.POPUP_ERROR_PARTNER')}};
      return false;
    }
    if (type === 'location') {
      if (!this.editedData.location) {
        this.errors = {...this.errors, ...{location: translate('ISSUE_TRACKER.POPUP_ERROR_LOCATION')}};
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

  attachmentsUploaded(attachments: {success: string[]; error: string[]}): void {
    try {
      const parsedAttachments: IAttachment[] = attachments.success.map((jsonAttachment: string | IAttachment) => {
        if (typeof jsonAttachment === 'string') {
          return JSON.parse(jsonAttachment);
        } else {
          return jsonAttachment;
        }
      });
      this.currentFiles = [...this.currentFiles, ...parsedAttachments];
    } catch (e) {
      console.error(e);
      fireEvent(this, 'toast', {text: 'Can not upload attachments. Please try again later'});
    }
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
    const isChanged: boolean = !!Object.keys(data).length;
    if (
      !this.editedData.id ||
      (!isChanged && JSON.stringify(this.originalFiles) === JSON.stringify(this.currentFiles))
    ) {
      this.dialogOpened = false;
      this.onClose();
      return;
    }
    store.dispatch<AsyncEffect>(updateLogIssue(this.editedData.id, data, this.currentFiles));
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
      (nextAttachment: IAttachment) => nextAttachment.id === id
    );
    if (~indexAttachment) {
      this.currentFiles.splice(indexAttachment, 1, file);
    }
  }

  onDeleteFile({id}: SelectedFile): void {
    const indexAttachment: number = this.currentFiles.findIndex(
      (nextAttachment: IAttachment) => nextAttachment.id === id
    );
    if (~indexAttachment) {
      this.currentFiles.splice(indexAttachment, 1);
      this.currentFiles = [...this.currentFiles];
    }
  }
}
