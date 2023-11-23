import {LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {Unsubscribe} from 'redux';
import {clone} from 'ramda';
import {store} from '../../../../../redux/store';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {issueTrackerIsUpdate} from '../../../../../redux/selectors/issue-tracker.selectors';
import {getDifference} from '../../../../utils/objects-diff';
import {createLogIssue, updateLogIssue} from '../../../../../redux/effects/issue-tracker.effects';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../styles/card-styles';
import {IssueTrackerPopupStyles} from './issue-tracker-popu.styles';
import {SiteMixin} from '../../../../common/mixins/site-mixin';
import {CpOutputsMixin} from '../../../../common/mixins/cp-outputs-mixin';
import {PartnersMixin} from '../../../../common/mixins/partners-mixin';
import {DataMixin} from '../../../../common/mixins/data-mixin';
import {translate, get as getTranslation} from 'lit-translate';
import {validateRequiredFields} from '../../../../utils/validations.helper';
import {repeat} from 'lit/directives/repeat.js';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import '@unicef-polymer/etools-unicef/src/etools-radio/etools-radio-group';
import '@shoelace-style/shoelace/dist/components/radio/radio.js';
import {simplifyValue} from '../../../../utils/objects-diff';
import '../../../../common/file-components/file-select-input';
import '../../../../common/file-components/file-select-button';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';
import {getEndpoint} from '../../../../../endpoints/endpoints';
import {ATTACHMENTS_STORE} from '../../../../../endpoints/endpoints-list';
import {ISSUE_STATUSES} from '../issue-tracker-tab-statuses';

@customElement('issue-tracker-popup')
export class IssueTrackerPopup extends PartnersMixin(CpOutputsMixin(SiteMixin(DataMixin()<LogIssue>(LitElement)))) {
  @property() attachments: StoredAttachment[] = [];

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

  @property() dialogOpened = true;

  @property({type: Array})
  currentFiles: IAttachment[] = [];

  @property({type: Array})
  originalFiles: IAttachment[] = [];

  @property({type: Boolean})
  autoValidateIssue = false;

  relatedTypes: RelatedType[] = ['cp_output', 'partner', 'location'];
  isNew = false;
  isRequest = false;
  isReadOnly = false;

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
        fireEvent(this, 'dialog-closed', {confirmed: true});
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
    return html`
      ${InputStyles} ${DialogStyles}
      <style>
        .container {
          padding: 14px;
        }
      </style>
      <etools-dialog
        id="dialog"
        size="md"
        no-padding
        keep-dialog-open
        ?opened="${this.dialogOpened}"
        .okBtnText="${translate(this.isNew ? 'MAIN.BUTTONS.ADD' : 'MAIN.BUTTONS.SAVE')}"
        .cancelBtnText="${translate('CANCEL')}"
        .hideConfirmBtn="${this.isReadOnly}"
        dialog-title="${translate(this.isNew ? 'ISSUE_TRACKER.ADD_POPUP_TITLE' : 'ISSUE_TRACKER.EDIT_POPUP_TITLE')}"
        @etools-dialog-closed="${({target}: CustomEvent) => this.resetData(target)}"
        @confirm-btn-clicked="${() => this.processRequest()}"
        @close="${this.onClose}"
      >
        <etools-loading
          ?active="${this.isRequest}"
          loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
        ></etools-loading>

        <div class="container layout vertical">
          <div class="layout horizontal center">
            <div class="layout vertical related-to-type flex-2">
              <label id="related-to-type">${translate('ISSUE_TRACKER.RELATED_TO_TYPE')}</label>
              <etools-radio-group
                .value="${this.relatedToType}"
                @sl-change="${({detail}: CustomEvent) => this.changeRelatedType(detail.item)}"
                ?disabled="${this.isReadOnly}"
              >
                ${repeat(
                  this.relatedTypes,
                  (type: RelatedType) => html`
                    <sl-radio value="${type}" ?disabled="${this.isReadOnly || !this.isNew}">
                      ${translate(`ISSUE_TRACKER.RELATED_TYPE.${type.toUpperCase()}`)}
                    </sl-radio>
                  `
                )}
              </etools-radio-group>
            </div>

            <etools-dropdown
              class="validate-input flex-1"
              .selected="${this.editedData.status}"
              label="${translate('ISSUE_TRACKER.STATUS')}"
              placeholder="${translate('ISSUE_TRACKER.PLACEHOLDER.STATUS')}"
              .options="${ISSUE_STATUSES}"
              option-label="display_name"
              option-value="value"
              required
              ?readonly="${this.isReadOnly}"
              ?invalid="${this.errors && this.errors.status}"
              .errorMessage="${this.errors && this.errors.status}"
              @focus="${() => this.resetFieldError('status')}"
              @click="${() => this.resetFieldError('status')}"
              @etools-selected-item-changed="${({detail}: CustomEvent) =>
                this.updateModelValue('status', detail.selectedItem && detail.selectedItem.value)}"
              trigger-value-change-event
              hide-search
              allow-outside-scroll
            ></etools-dropdown>
          </div>

          ${this.relatedToType === 'partner'
            ? html`
                <div class="layout horizontal preparation-input-container">
                  <etools-dropdown
                    class="validate-input flex"
                    .selected="${simplifyValue(this.editedData.partner)}"
                    label="${translate('ISSUE_TRACKER.PARTNER')}"
                    placeholder="${translate('ISSUE_TRACKER.PLACEHOLDER.PARTNER')}"
                    .options=${this.partners}
                    option-label="name"
                    option-value="id"
                    required
                    ?readonly="${this.isReadOnly}"
                    ?invalid="${this.errors && this.errors.partner}"
                    .errorMessage="${this.errors && this.errors.partner}"
                    trigger-value-change-event
                    @focus="${() => this.resetFieldError('partner')}"
                    @click="${() => this.resetFieldError('partner')}"
                    @etools-selected-item-changed="${({detail}: CustomEvent) =>
                      this.updateModelValue('partner', detail.selectedItem && detail.selectedItem.id)}"
                    allow-outside-scroll
                  >
                  </etools-dropdown>
                </div>
              `
            : ''}
          ${this.relatedToType === 'cp_output'
            ? html`
                <div class="layout horizontal preparation-input-container">
                  <etools-dropdown
                    class="validate-input flex"
                    .selected="${simplifyValue(this.editedData.cp_output)}"
                    @etools-selected-item-changed="${({detail}: CustomEvent) =>
                      this.updateModelValue('cp_output', detail.selectedItem && detail.selectedItem.id)}"
                    label="${translate('ISSUE_TRACKER.CP_OUTPUT')}"
                    placeholder="${translate('ISSUE_TRACKER.PLACEHOLDER.CP_OUTPUT')}"
                    .options=${this.outputs}
                    option-label="name"
                    option-value="id"
                    required
                    ?readonly="${this.isReadOnly}"
                    ?invalid="${this.errors && this.errors.cp_output}"
                    .errorMessage="${this.errors && this.errors.cp_output}"
                    trigger-value-change-event
                    @focus="${() => this.resetFieldError('cp_output')}"
                    @click="${() => this.resetFieldError('cp_output')}"
                    allow-outside-scroll
                  >
                  </etools-dropdown>
                </div>
              `
            : ''}
          ${this.relatedToType === 'location'
            ? html`
                <div class="layout horizontal preparation-input-container">
                  <etools-dropdown
                    class="validate-input flex"
                    .selected="${simplifyValue(this.editedData.location)}"
                    label="${translate('ISSUE_TRACKER.LOCATION')}"
                    placeholder="${translate('ISSUE_TRACKER.PLACEHOLDER.LOCATION')}"
                    .options=${this.locations}
                    option-label="name"
                    option-value="id"
                    required
                    ?readonly="${this.isReadOnly}"
                    ?invalid="${this.errors && this.errors.location}"
                    .errorMessage="${this.errors && this.errors.location}"
                    trigger-value-change-event
                    @focus="${() => this.resetFieldError('location')}"
                    @click="${() => this.resetFieldError('location')}"
                    @etools-selected-item-changed="${({detail}: CustomEvent) =>
                      this.setLocation(detail.selectedItem && detail.selectedItem.id)}"
                    allow-outside-scroll
                  >
                  </etools-dropdown>
                  <etools-dropdown
                    class="validate-input flex"
                    .selected="${simplifyValue(this.editedData.location_site)}"
                    label="${translate('ISSUE_TRACKER.SITE')}"
                    placeholder="${translate('ISSUE_TRACKER.PLACEHOLDER.SITE')}"
                    .options=${this.locationSites}
                    option-label="name"
                    option-value="id"
                    ?readonly="${this.isReadOnly}"
                    ?invalid="${this.errors && this.errors.location_site}"
                    .errorMessage="${this.errors && this.errors.location_site}"
                    trigger-value-change-event
                    @focus="${() => this.resetFieldError('location_site')}"
                    @click="${() => this.resetFieldError('location_site')}"
                    @etools-selected-item-changed="${({detail}: CustomEvent) =>
                      this.updateModelValue('location_site', detail.selectedItem && detail.selectedItem.id)}"
                    allow-outside-scroll
                  >
                  </etools-dropdown>
                </div>
              `
            : ''}

          <etools-textarea
            class="validate-input preparation-input-container issue-tracker-input"
            .value=${this.editedData.issue}
            max-rows="3"
            label="${translate('ISSUE_TRACKER.ISSUE')}"
            placeholder="${translate('ISSUE_TRACKER.PLACEHOLDER.ISSUE')}"
            required
            ?readonly="${this.isReadOnly}"
            ?invalid="${this.errors && this.errors.issue}"
            error-message="${(this.errors && this.errors.issue) || translate('THIS_FIELD_IS_REQUIRED')}"
            @value-changed="${({detail}: CustomEvent) => this.updateModelValue('issue', detail.value)}"
            @focus="${() => {
              this.autoValidateIssue = true;
              this.resetFieldError('issue');
            }}"
            @click="${() => this.resetFieldError('issue')}"
            .autoValidate="${this.autoValidateIssue}"
          ></etools-textarea>

          <div>
            ${repeat(
              this.currentFiles,
              (attachment: IAttachment) => html`
                <file-select-input
                  .fileId="${attachment.id}"
                  .fileName="${attachment.filename}"
                  .fileData="${attachment.file}"
                  ?isReadonly="${this.isReadOnly}"
                  @file-deleted="${({detail}: CustomEvent<SelectedFile>) => this.onDeleteFile(detail)}"
                  @file-selected="${({detail}: CustomEvent<SelectedFile>) => this.onChangeFile(detail)}"
                ></file-select-input>
              `
            )}
            ${this.isReadOnly
              ? ''
              : html`
                  <etools-upload-multi
                    .uploadBtnLabel="${translate('UPLOAD_FILE')}"
                    class="with-padding"
                    ?hidden="${this.readonly}"
                    @upload-finished="${({detail}: CustomEvent) => this.attachmentsUploaded(detail)}"
                    .endpointInfo="${{endpoint: getEndpoint(ATTACHMENTS_STORE).url}}"
                  ></etools-upload-multi>
                `}
          </div>
        </div>
      </etools-dialog>
    `;
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
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
    if (!validateRequiredFields(this)) {
      return false;
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
      fireEvent(this, 'toast', {text: getTranslation('ERROR_UPLOAD')});
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
    const isChanged = !!Object.keys(data).length;
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

  changeRelatedType(item: any): void {
    const type: RelatedType = item.get('value');
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
    const locationId: string | undefined = this.editedData && (this.editedData.location as unknown as string);
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
