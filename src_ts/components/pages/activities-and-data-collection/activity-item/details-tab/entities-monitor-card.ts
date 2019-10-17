import { CSSResultArray, customElement, html, TemplateResult } from 'lit-element';
import { translate } from '../../../../../localization/localisation';
import { elevationStyles } from '../../../../styles/elevation-styles';
import { SharedStyles } from '../../../../styles/shared-styles';
import { BaseCard } from './base-card';

@customElement('entities-monitor-card')
export class EntitiesMonitorCard extends BaseCard {
    public render(): TemplateResult {
        // language=HTML
        return html`
            <etools-card
                card-title="${ translate('ACTIVITY_ITEM.ENTRIES_TO_MONITOR')}"
                is-editable
                ?edit="${!this.isReadonly}"
                @start-edit="${() => this.isReadonly = false}"
                @save="${() => this.save()}"
                @cancel="${() => this.cancel()}">
                <div class="card-content" slot="content">
                </div>>
            </etools-card>
        `;
    }

    public static get styles(): CSSResultArray {
        return [elevationStyles, SharedStyles];
    }
}
