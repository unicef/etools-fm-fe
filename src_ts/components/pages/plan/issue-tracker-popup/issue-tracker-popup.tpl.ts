import { html, TemplateResult } from 'lit-html';
import { IssueTrackerPopup } from './issue-tracker-popup';
import { translate } from '../../../../localization/localisation';
import { repeat } from 'lit-html/directives/repeat';
import { ISSUE_STATUSES } from '../issue-tracker-tab/issue-tracker-tab';
import '@unicef-polymer/etools-dialog/etools-dialog';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-input/paper-textarea';
import '@polymer/paper-radio-group/paper-radio-group';
import '@polymer/paper-radio-button/paper-radio-button';
import { simplifyValue } from '../../../utils/objects-diff';
import '../../../common/file-components/file-select-input';
import '../../../common/file-components/file-select-button';
import { SelectedFile } from '../../../common/file-components/file-select-input';
import { InputStyles } from '../../../styles/input-styles';
import { DialogStyles } from '../../../styles/dialog-styles';

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
        ?opened="${ this.dialogOpened }"
        .okBtnText="${ translate(this.isNew ? 'MAIN.BUTTONS.ADD' : 'MAIN.BUTTONS.SAVE') }"
        .hideConfirmBtn="${ this.isReadOnly }"
        dialog-title="${ translate('ISSUE_TRACKER.POPUP_TITLE') }"
        @iron-overlay-closed="${({ target }: CustomEvent) => this.resetData(target)}"
        @confirm-btn-clicked="${() => this.processRequest()}">
    <etools-loading
            ?active="${ this.isRequest }"
            loading-text="${ translate('MAIN.SAVING_DATA_IN_PROCESS') }"></etools-loading>

    <div class="container layout vertical">
        <div class="layout horizontal center">

            <div class="layout vertical related-to-type flex-2">
                <label id="related-to-type">${ translate('ISSUE_TRACKER.RELATED_TO_TYPE')}</label>
                <paper-radio-group
                        selected="${ this.relatedToType }"
                         @iron-select="${({ detail }: CustomEvent) => this.changeRelatedType(detail.item)}"
                        ?disabled="${ this.isReadOnly }">
                    ${repeat(this.relatedTypes, (type: RelatedType) => html`
                        <paper-radio-button
                                name="${ type }"
                                ?disabled="${ this.isReadOnly || !this.isNew }">
                            ${ translate(`ISSUE_TRACKER.RELATED_TYPE.${type.toUpperCase()}`)}
                        </paper-radio-button>
                    `)}
                </paper-radio-group>
            </div>

            <etools-dropdown
                    class="validate-input disabled-as-readonly flex-1"
                    .selected="${ this.editedData.status}"
                    label="${ translate('ISSUE_TRACKER.STATUS') }"
                    placeholder="${ translate('ISSUE_TRACKER.PLACEHOLDER.STATUS') }"
                    .options="${ ISSUE_STATUSES }"
                    option-label="display_name"
                    option-value="value"
                    required
                    ?disabled="${ this.isReadOnly }"
                    ?readonly="${ this.isReadOnly }"
                    ?invalid="${ this.errors && this.errors.status }"
                    .errorMessage="${ this.errors && this.errors.status }"
                    @focus="${ () => this.resetFieldError('status') }"
                    @tap="${ () => this.resetFieldError('status') }"
                    @etools-selected-item-changed="${({ detail }: CustomEvent) =>
                        this.updateModelValue('status', detail.selectedItem && detail.selectedItem.value)}"
                    trigger-value-change-event
                    hide-search
                    allow-outside-scroll></etools-dropdown>
        </div>

        ${this.relatedToType === 'partner' ? html`
            <div class="layout horizontal preparation-input-container">
                <etools-dropdown
                        class="validate-input disabled-as-readonly flex"
                        .selected="${ simplifyValue(this.editedData.partner) }"
                        label="${ translate('ISSUE_TRACKER.PARTNER') }"
                        placeholder="${ translate('ISSUE_TRACKER.PLACEHOLDER.PARTNER') }"
                        .options=${ this.partners }
                        option-label="name"
                        option-value="id"
                        required
                        ?disabled="${ this.isReadOnly }"
                        ?readonly="${ this.isReadOnly }"
                        ?invalid="${ this.errors && this.errors.partner }"
                        .errorMessage="${ this.errors && this.errors.partner }"
                        trigger-value-change-event
                        @focus="${ () => this.resetFieldError('partner') }"
                        @tap="${ () => this.resetFieldError('partner') }"
                        @etools-selected-item-changed="${({ detail }: CustomEvent) =>
                            this.updateModelValue('partner', detail.selectedItem && detail.selectedItem.id)}"
                        hide-search
                        allow-outside-scroll>
                </etools-dropdown>
            </div>
        ` : ''}

        ${this.relatedToType === 'cp_output' ? html`
            <div class="layout horizontal preparation-input-container">
                <etools-dropdown
                        class="validate-input disabled-as-readonly flex"
                        .selected="${ simplifyValue(this.editedData.cp_output) }"
                        @etools-selected-item-changed="${({ detail }: CustomEvent) =>
                            this.updateModelValue('cp_output', detail.selectedItem && detail.selectedItem.id)}"
                        label="${ translate('ISSUE_TRACKER.CP_OUTPUT') }"
                        placeholder="${ translate('ISSUE_TRACKER.PLACEHOLDER.CP_OUTPUT') }"
                        .options=${ this.outputs }
                        option-label="name"
                        option-value="id"
                        required
                        ?disabled="${ this.isReadOnly }"
                        ?readonly="${ this.isReadOnly }"
                        ?invalid="${ this.errors && this.errors.cp_output }"
                        .errorMessage="${ this.errors && this.errors.cp_output }"
                        trigger-value-change-event
                        @focus="${ () => this.resetFieldError('cp_output') }"
                        @tap="${ () => this.resetFieldError('cp_output') }"
                        hide-search
                        allow-outside-scroll>
                </etools-dropdown>
            </div>
        ` : ''}

        ${this.relatedToType === 'location' ? html`
            <div class="layout horizontal preparation-input-container">
                <etools-dropdown
                        class="validate-input disabled-as-readonly flex"
                        .selected="${ simplifyValue(this.editedData.location) }"
                        label="${ translate('ISSUE_TRACKER.LOCATION') }"
                        placeholder="${ translate('ISSUE_TRACKER.PLACEHOLDER.LOCATION') }"
                        .options=${ this.locations }
                        option-label="name"
                        option-value="id"
                        required
                        ?disabled="${ this.isReadOnly }"
                        ?readonly="${ this.isReadOnly }"
                        ?invalid="${ this.errors && this.errors.location }"
                        .errorMessage="${ this.errors && this.errors.location }"
                        trigger-value-change-event
                        @focus="${ () => this.resetFieldError('location') }"
                        @tap="${ () => this.resetFieldError('location') }"
                        @etools-selected-item-changed="${({ detail }: CustomEvent) =>
                            this.setLocation(detail.selectedItem && detail.selectedItem.id)}"
                        hide-search
                        allow-outside-scroll>
                </etools-dropdown>
                <etools-dropdown
                        class="validate-input disabled-as-readonly flex"
                        .selected="${ simplifyValue(this.editedData.location_site) }"
                        label="${ translate('ISSUE_TRACKER.SITE') }"
                        placeholder="${ translate('ISSUE_TRACKER.PLACEHOLDER.SITE') }"
                        .options=${ this.locationSites }
                        option-label="name"
                        option-value="id"
                        ?disabled="${ this.isReadOnly }"
                        ?readonly="${ this.isReadOnly }"
                        ?invalid="${ this.errors && this.errors.location_site }"
                        .errorMessage="${ this.errors && this.errors.location_site }"
                        trigger-value-change-event
                        @focus="${ () => this.resetFieldError('location_site') }"
                        @tap="${ () => this.resetFieldError('location_site') }"
                        @etools-selected-item-changed="${({ detail }: CustomEvent) =>
                            this.updateModelValue('location_site', detail.selectedItem && detail.selectedItem.id)}"
                        hide-search
                        allow-outside-scroll>
                </etools-dropdown>
            </div>
        ` : ''}

        <paper-textarea
                class="validate-input disabled-as-readonly preparation-input-container"
                .value=${ this.editedData.issue }
                max-rows="3"
                label="${ translate('ISSUE_TRACKER.ISSUE') }"
                placeholder="${ translate('ISSUE_TRACKER.PLACEHOLDER.ISSUE') }"
                required
                ?disabled="${ this.isReadOnly }"
                ?readonly="${ this.isReadOnly }"
                ?invalid="${ this.errors && this.errors.issue }"
                error-message="${ this.errors && this.errors.issue }"
                @value-changed="${ ({ detail }: CustomEvent) => this.updateModelValue('issue', detail.value) }"
                @focus="${ () => this.resetFieldError('issue') }"
                @tap="${ () => this.resetFieldError('issue') }"></paper-textarea>

        <div>
            ${repeat(this.currentFiles, (attachment: Partial<Attachment>) => html`
                <file-select-input
                    .fileId="${ attachment.id }"
                    .fileName="${ attachment.filename }"
                    .fileData="${ attachment.file }"
                    ?isReadonly="${ this.isReadOnly }"
                    @file-deleted="${ ({ detail }: CustomEvent<SelectedFile>) => this.onDeleteFile(detail)}"
                    @file-selected="${ ({ detail }: CustomEvent<SelectedFile>) => this.onChangeFile(detail)}"></file-select-input>
            `)}
            ${ this.isReadOnly ? '' : html`
                <file-select-button @file-selected="${ ({ detail }: CustomEvent) => this.onAddFile(detail)}"></file-select-button>
            `}
        </div>

    </div>

</etools-dialog>
`;
}
