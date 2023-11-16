import {html, TemplateResult} from 'lit';
import {IssueTrackerPopup} from './issue-tracker-popup';
import {repeat} from 'lit/directives/repeat.js';
import {ISSUE_STATUSES} from '../issue-tracker-tab';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';
import '@shoelace-style/shoelace/dist/components/radio/radio.js';
import {simplifyValue} from '../../../../utils/objects-diff';
import '../../../../common/file-components/file-select-input';
import '../../../../common/file-components/file-select-button';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';
import {getEndpoint} from '../../../../../endpoints/endpoints';
import {ATTACHMENTS_STORE} from '../../../../../endpoints/endpoints-list';
import {translate} from 'lit-translate';

export function template(this: IssueTrackerPopup): TemplateResult {
  // main template
  // language=HTML
  return html`
    ${InputStyles} ${DialogStyles}
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
      @iron-overlay-closed="${({target}: CustomEvent) => this.resetData(target)}"
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
            <sl-radio-group
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
            </sl-radio-group>
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
