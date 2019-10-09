import '@polymer/paper-input/paper-textarea';
import { RationalePopupComponent } from './rationale-popup';
import { html, TemplateResult } from 'lit-element';
import { translate } from '../../../../../localization/localisation';
import { InputStyles } from '../../../../styles/input-styles';
import { DialogStyles } from '../../../../styles/dialog-styles';

export function template(this: RationalePopupComponent): TemplateResult {
    return html`
        ${InputStyles} ${DialogStyles}
        <style>
            .helper-text {
                padding: 0 12px;
                margin-top: -6px;
                font-size: 12px;
            }

            .numeric-input { width: 170px; }
        </style>

        <etools-dialog
                size="md"
                no-padding
                keep-dialog-open ?opened="${ this.dialogOpened }"
                .okBtnText="${ translate('MAIN.BUTTONS.SAVE') }"
                dialog-title="${ translate('RATIONALE.POPUP_TITLE') }"
                @confirm-btn-clicked="${() => this.processRequest()}"
                @close="${ this.onClose }">
             <etools-loading ?active="${ this.savingInProcess }" loading-text="${ translate('MAIN.SAVING_DATA_IN_PROCESS') }"></etools-loading>

            <div class="layout vertical">
                <div class="container">
                    <paper-textarea
                            class="validate-input disabled-as-readonly flex"
                            .value="${ this.editedModel.prioritization_criteria }"
                            @value-changed="${ ({ detail }: CustomEvent) => this.updateModelValue('prioritization_criteria', detail.value) }"
                            max-rows="3"
                            label="${ translate('RATIONALE.LABELS.PRIORITIZATION') }"
                            placeholder="${ translate('RATIONALE.PLACEHOLDERS.PRIORITIZATION') }"
                            ?invalid="${ this.errors.prioritization_criteria }"
                            error-message="${ this.errors.prioritization_criteria }"
                            @focus="${ () => this.resetFieldError('prioritization_criteria') }"
                            @tap="${ () => this.resetFieldError('prioritization_criteria') }">
                    </paper-textarea>
                    <div class="helper-text">${ translate('RATIONALE.HELPER_TEXTS.PRIORITIZATION') }</div>
                </div>
                <div class="container">
                    <paper-textarea
                            class="validate-input disabled-as-readonly flex"
                            .value="${ this.editedModel.methodology_notes }"
                            @value-changed="${ ({ detail }: CustomEvent) => this.updateModelValue('methodology_notes', detail.value) }"
                            max-rows="3"
                            label="${ translate('RATIONALE.LABELS.METHODOLOGY') }"
                            placeholder="${ translate('RATIONALE.PLACEHOLDERS.METHODOLOGY') }"
                            ?invalid="${ this.errors.methodology_notes }"
                            error-message="${ this.errors.methodology_notes }"
                            @focus="${ () => this.resetFieldError('methodology_notes') }"
                            @tap="${ () => this.resetFieldError('methodology_notes') }">
                    </paper-textarea>
                    <div class="helper-text">${ translate('RATIONALE.HELPER_TEXTS.METHODOLOGY') }</div>
                </div>
                <div class="container">
                    <paper-textarea
                            class="validate-input disabled-as-readonly flex"
                            .value="${ this.editedModel.modalities }"
                            @value-changed="${ ({ detail }: CustomEvent) => this.updateModelValue('modalities', detail.value) }"
                            max-rows="3"
                            label="${ translate('RATIONALE.LABELS.MODALITIES') }"
                            placeholder="${ translate('RATIONALE.PLACEHOLDERS.MODALITIES') }"
                            ?invalid="${ this.errors.modalities }"
                            error-message="${ this.errors.modalities }"
                            @focus="${ () => this.resetFieldError('modalities') }"
                            @tap="${ () => this.resetFieldError('modalities') }">
                    </paper-textarea>
                    <div class="helper-text">${ translate('RATIONALE.HELPER_TEXTS.MODALITIES') }</div>
                </div>
                <div class="container">
                    <paper-input
                            class="validate-input disabled-as-readonly flex numeric-input"
                            .value="${ this.editedModel.target_visits }"
                            @input="${ ({ target }: CustomEvent) => this.onTargetVisitsChange((target as HTMLInputElement).value) }"
                            type="number"
                            label="${ translate('RATIONALE.LABELS.VISITS') }"
                            placeholder="${ translate('RATIONALE.PLACEHOLDERS.VISITS') }"
                            ?invalid="${ this.errors.target_visits }"
                            error-message="${ this.errors.target_visits }"
                            @focus="${ () => this.resetFieldError('target_visits') }"
                            @tap="${ () => this.resetFieldError('target_visits') }">
                    </paper-input>
                </div>
                <div class="container">
                    <paper-textarea
                            class="validate-input disabled-as-readonly flex"
                            value="${ this.editedModel.partner_engagement }"
                            @value-changed="${ ({ detail }: CustomEvent) => this.updateModelValue('partner_engagement', detail.value) }"
                            max-rows="3"
                            label="${ translate('RATIONALE.LABELS.PARTNER_ENGAGEMENT') }"
                            placeholder="${ translate('RATIONALE.PLACEHOLDERS.PARTNER_ENGAGEMENT') }"
                            ?invalid="${ this.errors.partner_engagement }"
                            error-message="${ this.errors.partner_engagement }"
                            @focus="${ () => this.resetFieldError('partner_engagement') }"
                            @tap="${ () => this.resetFieldError('partner_engagement') }">
                    </paper-textarea>
                    <div class="helper-text">${ translate('RATIONALE.HELPER_TEXTS.PARTNER_ENGAGEMENT') }</div>
                </div>
                <div class="container">
                    <paper-textarea
                            class="validate-input disabled-as-readonly flex"
                            value="${ this.editedModel.other_aspects }"
                            @value-changed="${ ({ detail }: CustomEvent) => this.updateModelValue('other_aspects', detail.value) }"
                            max-rows="3"
                            label="${ translate('RATIONALE.LABELS.OTHER') }"
                            placeholder="${ translate('RATIONALE.PLACEHOLDERS.OTHER') }"
                            ?invalid="${ this.errors.other_aspects }"
                            error-message="${ this.errors.other_aspects }"
                            @focus="${ () => this.resetFieldError('other_aspects') }"
                            @tap="${ () => this.resetFieldError('other_aspects') }">
                    </paper-textarea>
                </div>

            </div>

        </etools-dialog>
    `;
}
