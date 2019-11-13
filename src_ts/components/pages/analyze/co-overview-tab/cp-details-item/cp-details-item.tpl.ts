import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import { html, TemplateResult } from 'lit-element';
import { CpDetailsItem } from './cp-details-item';
import { InputStyles } from '../../../../styles/input-styles';
// TODO: !!! import { translate } from '../../../../localization/localisation';
// TODO: add translations!

export function template(this: CpDetailsItem): TemplateResult {
    return html`
        ${ InputStyles}
        <div class="full-report-container">
            ${this.fullReport ? this.fullReport.name  : 'Full Report is undefined'}
        </div>
    `;
}
