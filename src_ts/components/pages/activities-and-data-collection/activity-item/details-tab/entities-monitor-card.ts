import { CSSResultArray, customElement, html, TemplateResult } from 'lit-element';
import { translate } from '../../../../../localization/localisation';
import { elevationStyles } from '../../../../styles/elevation-styles';
import { SharedStyles } from '../../../../styles/shared-styles';
import { BaseCard } from './base-card';
import { store } from '../../../../../redux/store';
import { SetEditedDetailsCard } from '../../../../../redux/actions/activity-details.actions';

export const CARD_NAME: string = 'entities-monitor';

@customElement('entities-monitor-card')
export class EntitiesMonitorCard extends BaseCard {

    public startEdit(): void {
        this.isReadonly = false;
        store.dispatch(new SetEditedDetailsCard(CARD_NAME));
    }

    public render(): TemplateResult {
        // language=HTML
        return html`
            <etools-card
                card-title="${ translate('ACTIVITY_ITEM.ENTRIES_TO_MONITOR')}"
                ?is-editable="${!this.editedCard || this.editedCard === CARD_NAME}"
                ?edit="${!this.isReadonly}"
                @start-edit="${() => this.startEdit()}"
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
