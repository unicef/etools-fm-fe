import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import {html, TemplateResult} from 'lit';
import {translate} from 'lit-translate';
import {InputStyles} from '../../../../styles/input-styles';
import {AnnualFmRationale} from './annual-fm-rationale';
import '../../../../common/layout/etools-card';
import {hasPermission, Permissions} from '../../../../../config/permissions';
import {FormBuilderCardStyles} from '@unicef-polymer/etools-form-builder/dist/lib/styles/form-builder-card.styles';

export function template(this: AnnualFmRationale): TemplateResult {
  return html`
    ${InputStyles}
    <style>
      ${FormBuilderCardStyles} .helper-text {
        padding: 0 12px;
        margin-top: -6px;
        font-size: 12px;
      }

      .numeric-input {
        width: 300px;
      }
    </style>

    <etools-card
      class="elevation page-content card-container"
      elevation="1"
      card-title="${translate('RATIONALE.TITLE')}"
      ?is-editable="${hasPermission(Permissions.EDIT_RATIONALE)}"
      ?edit="${!this.isReadonly}"
      @start-edit="${() => this.startEdit()}"
      @save="${() => this.save()}"
      @cancel="${() => this.cancel()}"
    >
      ${this.editedData && this.editedData.history && this.editedData.history[0]
        ? html`
            <div slot="actions">
              <div class="history-info">
                ${translate('RATIONALE.ANNUAL_FM_RATIONALE.LAST_EDITED', {
                  user: this.editedData.history[0].by_user_display,
                  date: this.getChangesDate(this.editedData.history[0].created)
                })}
              </div>
            </div>
          `
        : null}

      <div slot="content" class="card-content">
        <etools-loading
          ?active="${this.savingInProcess}"
          loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
        ></etools-loading>
        <div class="layout vertical card-content">
          <div>
            <etools-textarea
              class="validate-input flex"
              .value="${this.editedData.prioritization_criteria}"
              @value-changed="${({detail}: CustomEvent) =>
                this.updateModelValue('prioritization_criteria', detail.value)}"
              label="${translate('RATIONALE.LABELS.PRIORITIZATION')}"
              placeholder="${this.isReadonly ? '-' : translate('RATIONALE.PLACEHOLDERS.PRIORITIZATION')}"
              ?invalid="${this.errors.prioritization_criteria}"
              error-message="${this.errors.prioritization_criteria}"
              @focus="${() => this.resetFieldError('prioritization_criteria')}"
              @click="${() => this.resetFieldError('prioritization_criteria')}"
              ?readonly="${this.isReadonly}"
            >
            </etools-textarea>
          </div>
          <div>
            <etools-textarea
              class="validate-input flex"
              .value="${this.editedData.methodology_notes}"
              @value-changed="${({detail}: CustomEvent) => this.updateModelValue('methodology_notes', detail.value)}"
              label="${translate('RATIONALE.LABELS.METHODOLOGY')}"
              placeholder="${this.isReadonly ? '-' : translate('RATIONALE.PLACEHOLDERS.METHODOLOGY')}"
              ?invalid="${this.errors.methodology_notes}"
              error-message="${this.errors.methodology_notes}"
              @focus="${() => this.resetFieldError('methodology_notes')}"
              @click="${() => this.resetFieldError('methodology_notes')}"
              ?readonly="${this.isReadonly}"
            >
            </etools-textarea>
          </div>
          <div>
            <etools-textarea
              class="validate-input flex"
              .value="${this.editedData.modalities}"
              @value-changed="${({detail}: CustomEvent) => this.updateModelValue('modalities', detail.value)}"
              label="${translate('RATIONALE.LABELS.MODALITIES')}"
              placeholder="${this.isReadonly ? '-' : translate('RATIONALE.PLACEHOLDERS.MODALITIES')}"
              ?invalid="${this.errors.modalities}"
              error-message="${this.errors.modalities}"
              @focus="${() => this.resetFieldError('modalities')}"
              @click="${() => this.resetFieldError('modalities')}"
              ?readonly="${this.isReadonly}"
            >
            </etools-textarea>
          </div>
          <div>
            <etools-input
              class="validate-input flex numeric-input"
              .value="${this.editedData.target_visits}"
              @input="${({target}: CustomEvent) => this.onTargetVisitsChange((target as HTMLInputElement).value)}"
              type="${this.isReadonly ? 'text' : 'number'}"
              label="${translate('RATIONALE.LABELS.VISITS')}"
              placeholder="${this.isReadonly ? '-' : translate('RATIONALE.PLACEHOLDERS.VISITS')}"
              ?invalid="${this.errors.target_visits}"
              error-message="${this.errors.target_visits}"
              @focus="${() => this.resetFieldError('target_visits')}"
              @click="${() => this.resetFieldError('target_visits')}"
              ?readonly="${this.isReadonly}"
            >
            </etools-input>
          </div>
          <div>
            <etools-textarea
              class="validate-input flex"
              value="${this.editedData.partner_engagement}"
              @value-changed="${({detail}: CustomEvent) => this.updateModelValue('partner_engagement', detail.value)}"
              label="${translate('RATIONALE.LABELS.PARTNER_ENGAGEMENT')}"
              placeholder="${this.isReadonly ? '-' : translate('RATIONALE.PLACEHOLDERS.PARTNER_ENGAGEMENT')}"
              ?invalid="${this.errors.partner_engagement}"
              error-message="${this.errors.partner_engagement}"
              @focus="${() => this.resetFieldError('partner_engagement')}"
              @click="${() => this.resetFieldError('partner_engagement')}"
              ?readonly="${this.isReadonly}"
            >
            </etools-textarea>
          </div>
          <div>
            <etools-textarea
              class="validate-input flex"
              value="${this.editedData.other_aspects}"
              @value-changed="${({detail}: CustomEvent) => this.updateModelValue('other_aspects', detail.value)}"
              label="${translate('RATIONALE.LABELS.OTHER')}"
              placeholder="${this.isReadonly ? '-' : translate('RATIONALE.PLACEHOLDERS.OTHER')}"
              ?invalid="${this.errors.other_aspects}"
              error-message="${this.errors.other_aspects}"
              @focus="${() => this.resetFieldError('other_aspects')}"
              @click="${() => this.resetFieldError('other_aspects')}"
              ?readonly="${this.isReadonly}"
            >
            </etools-textarea>
          </div>
        </div>
      </div>
    </etools-card>
  `;
}
