import '@unicef-polymer/etools-dropdown';
import '../../../common/attachmants-list/attachments-list';
import {html, TemplateResult} from 'lit-element';
import {RationaleTabComponent} from './rationale-tab';
import {translate} from '../../../../localization/localisation';
import {RATIONALE_ATTACHMENTS} from '../../../../endpoints/endpoints-list';
import {InputStyles} from '../../../styles/input-styles';
import './annual-fm-rationale/annual-fm-rationale';

export function template(this: RationaleTabComponent): TemplateResult {
  // language=HTML
  return html`
    ${InputStyles}
    <div class="year-dropdown-container">
      <etools-dropdown
        class="year-dropdown"
        .selected="${this.selectedYear}"
        label="${translate('RATIONALE.YEAR_DRD_LABEL')}"
        placeholder="${translate('RATIONALE.YEAR_DRD_PLACEHOLDER')}"
        .options="${this.yearOptions}"
        option-label="label"
        option-value="value"
        trigger-value-change-event
        @etools-selected-item-changed="${({detail}: CustomEvent) => this.onYearSelected(detail.selectedItem.value)}"
        hide-search
        allow-outside-scroll
      ></etools-dropdown>
    </div>

    <annual-fm-rationale .selectedYear="${this.selectedYear}" .editedModel="${this.yearPlan}"></annual-fm-rationale>

    <attachments-list endpoint-name="${RATIONALE_ATTACHMENTS}"></attachments-list>
  `;
}
