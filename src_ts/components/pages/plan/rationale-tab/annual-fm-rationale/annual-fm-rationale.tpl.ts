import '@polymer/paper-input/paper-textarea';
import {html, TemplateResult} from 'lit-element';
import {translate} from '../../../../../localization/localisation';
import {InputStyles} from '../../../../styles/input-styles';
import {AnnualFmRationale} from './annual-fm-rationale';
import '../../../../common/layout/etools-card';
import {hasPermission, Permissions} from '../../../../../config/permissions';

export function template(this: AnnualFmRationale): TemplateResult {
  return html`
    ${InputStyles}
    <style>
      .helper-text {
        padding: 0 12px;
        margin-top: -6px;
        font-size: 12px;
      }

      .numeric-input {
        width: 170px;
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
      <div slot="content" class="card-content">
        <etools-loading
          ?active="${this.savingInProcess}"
          loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
        ></etools-loading>
        <div class="layout vertical card-content">
          <div class="text-control">
            <paper-textarea
              class="validate-input disabled-as-readonly flex without-border"
              .value="${this.data.prioritization_criteria}"
              @value-changed="${({detail}: CustomEvent) =>
                this.updateModelValue('prioritization_criteria', detail.value)}"
              label="${translate('RATIONALE.LABELS.PRIORITIZATION')}"
              placeholder="${translate('RATIONALE.PLACEHOLDERS.PRIORITIZATION')}"
              ?invalid="${this.errors.prioritization_criteria}"
              error-message="${this.errors.prioritization_criteria}"
              @focus="${() => this.resetFieldError('prioritization_criteria')}"
              @tap="${() => this.resetFieldError('prioritization_criteria')}"
              ?disabled="${this.isReadonly}"
              ?readonly="${this.isReadonly}"
            >
            </paper-textarea>
          </div>
          <div class="text-control">
            <paper-textarea
              class="validate-input disabled-as-readonly flex without-border"
              .value="${this.data.methodology_notes}"
              @value-changed="${({detail}: CustomEvent) => this.updateModelValue('methodology_notes', detail.value)}"
              label="${translate('RATIONALE.LABELS.METHODOLOGY')}"
              placeholder="${translate('RATIONALE.PLACEHOLDERS.METHODOLOGY')}"
              ?invalid="${this.errors.methodology_notes}"
              error-message="${this.errors.methodology_notes}"
              @focus="${() => this.resetFieldError('methodology_notes')}"
              @tap="${() => this.resetFieldError('methodology_notes')}"
              ?disabled="${this.isReadonly}"
              ?readonly="${this.isReadonly}"
            >
            </paper-textarea>
          </div>
          <div class="text-control">
            <paper-textarea
              class="validate-input disabled-as-readonly flex without-border"
              .value="${this.data.modalities}"
              @value-changed="${({detail}: CustomEvent) => this.updateModelValue('modalities', detail.value)}"
              label="${translate('RATIONALE.LABELS.MODALITIES')}"
              placeholder="${translate('RATIONALE.PLACEHOLDERS.MODALITIES')}"
              ?invalid="${this.errors.modalities}"
              error-message="${this.errors.modalities}"
              @focus="${() => this.resetFieldError('modalities')}"
              @tap="${() => this.resetFieldError('modalities')}"
              ?disabled="${this.isReadonly}"
              ?readonly="${this.isReadonly}"
            >
            </paper-textarea>
          </div>
          <div class="text-control">
            <paper-input
              class="validate-input disabled-as-readonly flex numeric-input without-border"
              .value="${this.data.target_visits}"
              @input="${({target}: CustomEvent) => this.onTargetVisitsChange((target as HTMLInputElement).value)}"
              type="${this.isReadonly ? 'text' : 'number'}"
              label="${translate('RATIONALE.LABELS.VISITS')}"
              placeholder="${translate('RATIONALE.PLACEHOLDERS.VISITS')}"
              ?invalid="${this.errors.target_visits}"
              error-message="${this.errors.target_visits}"
              @focus="${() => this.resetFieldError('target_visits')}"
              @tap="${() => this.resetFieldError('target_visits')}"
              ?disabled="${this.isReadonly}"
              ?readonly="${this.isReadonly}"
            >
            </paper-input>
          </div>
          <div class="text-control">
            <paper-textarea
              class="validate-input disabled-as-readonly flex without-border"
              value="${this.data.partner_engagement}"
              @value-changed="${({detail}: CustomEvent) => this.updateModelValue('partner_engagement', detail.value)}"
              label="${translate('RATIONALE.LABELS.PARTNER_ENGAGEMENT')}"
              placeholder="${translate('RATIONALE.PLACEHOLDERS.PARTNER_ENGAGEMENT')}"
              ?invalid="${this.errors.partner_engagement}"
              error-message="${this.errors.partner_engagement}"
              @focus="${() => this.resetFieldError('partner_engagement')}"
              @tap="${() => this.resetFieldError('partner_engagement')}"
              ?disabled="${this.isReadonly}"
              ?readonly="${this.isReadonly}"
            >
            </paper-textarea>
          </div>
          <div class="text-control">
            <paper-textarea
              class="validate-input disabled-as-readonly flex without-border"
              value="${this.data.other_aspects}"
              @value-changed="${({detail}: CustomEvent) => this.updateModelValue('other_aspects', detail.value)}"
              label="${translate('RATIONALE.LABELS.OTHER')}"
              placeholder="${translate('RATIONALE.PLACEHOLDERS.OTHER')}"
              ?invalid="${this.errors.other_aspects}"
              error-message="${this.errors.other_aspects}"
              @focus="${() => this.resetFieldError('other_aspects')}"
              @tap="${() => this.resetFieldError('other_aspects')}"
              ?disabled="${this.isReadonly}"
              ?readonly="${this.isReadonly}"
            >
            </paper-textarea>
          </div>
        </div>
      </div>
    </etools-card>
  `;
}
