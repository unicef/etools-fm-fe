import '@unicef-polymer/etools-dropdown';
import { html, TemplateResult } from 'lit-element';
import { RationaleTabComponent } from './rationale-tab';
import { hasPermission, Permissions } from '../../../../config/permissions';
import { translate } from '../../../../localization/localisation';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { TableStyles } from '../../../styles/table-styles';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { TabInputsStyles } from '../../../styles/tab-inputs-styles';
import { RationaleStyles } from './rationale.styles';

export function template(this: RationaleTabComponent): TemplateResult {
    return html`
        ${SharedStyles} ${pageLayoutStyles} ${RationaleStyles}
        ${FlexLayoutClasses} ${TableStyles} ${TabInputsStyles}

        <div class="year-dropdown-container">
            <etools-dropdown class="year-dropdown"
                             .selected="${ this.selectedYear }"
                             label="${ translate('RATIONALE.YEAR_DRD_LABEL') }"
                             placeholder="${ translate('RATIONALE.YEAR_DRD_PLACEHOLDER') }"
                             .options="${ this.yearOptions }"
                             option-label="label"
                             option-value="value"
                             trigger-value-change-event
                             @etools-selected-item-changed="${ ({ detail }: CustomEvent) => this.onYearSelected(detail.selectedItem.value) }"
                             hide-search allow-outside-scroll></etools-dropdown>
        </div>

        <section class="elevation page-content table-container rationale-table-section" elevation="1">

            <etools-loading ?active="${ this.loadingInProcess }" loading-text="${ translate('MAIN.LOADING_DATA_IN_PROCESS') }"></etools-loading>

            <div class="table-title-block with-bottom-line">
                <div class="table-title">${ translate('RATIONALE.TITLE') }</div>
                <div class="buttons-container">

                    <div class="history-info" hidden$="[[!yearPlan.history.length]]">
                        Last edited by ${ this.yearPlan && this.yearPlan.history[0].by_user_display } on ${ this.getChangesDate(this.yearPlan && this.yearPlan.history[0].created) }</div>

                    <paper-icon-button
                            @tap="${() => this.openPopup()}"
                            class="panel-button"
                            ?hidden="${ !hasPermission(Permissions.EDIT_RATIONALE) }"
                            icon="create"></paper-icon-button>
                </div>
            </div>

            <div class="container layout vertical rational-view">
                <div class="text-control">
                    <label>${ translate('RATIONALE.LABELS.PRIORITIZATION') }</label>
                    <div class="value">${ this.formatValue(this.yearPlan && this.yearPlan.prioritization_criteria) }</div>
                </div>
                <div class="text-control">
                    <label>${ translate('RATIONALE.LABELS.METHODOLOGY') }</label>
                    <div class="value">${ this.formatValue(this.yearPlan && this.yearPlan.methodology_notes) }</div>
                </div>
                <div class="text-control">
                    <label>${ translate('RATIONALE.LABELS.MODALITIES') }</label>
                    <div class="value">${ this.formatValue(this.yearPlan && this.yearPlan.modalities) }</div>
                </div>
                <div class="text-control">
                    <label>${ translate('RATIONALE.LABELS.VISITS') }</label>
                    <div class="value">${ this.formatValue(this.yearPlan && this.yearPlan.target_visits) }</div>
                </div>
                <div class="text-control">
                    <label>${ translate('RATIONALE.LABELS.PARTNER_ENGAGEMENT') }</label>
                    <div class="value">${ this.formatValue(this.yearPlan && this.yearPlan.partner_engagement) }</div>
                </div>
                <div class="text-control">
                    <label>${ translate('RATIONALE.LABELS.OTHER') }</label>
                    <div class="value">${ this.formatValue(this.yearPlan && this.yearPlan.other_aspects) }</div>
                </div>
            </div>

        </section>
    `;
}
