import { css, CSSResultArray, customElement, html, TemplateResult } from 'lit-element';
import { translate } from '../../../../../localization/localisation';
import { elevationStyles } from '../../../../styles/elevation-styles';
import { SharedStyles } from '../../../../styles/shared-styles';
import { BaseDetailsCard } from './base-details-card';
import { CardStyles } from '../../../../styles/card-styles';
import { repeat } from 'lit-html/directives/repeat';
import '@polymer/paper-radio-group/paper-radio-group';
import '@polymer/paper-radio-button/paper-radio-button';
import { store } from '../../../../../redux/store';
import { SetEditedDetailsCard } from '../../../../../redux/actions/activity-details.actions';

export const CARD_NAME: string = 'monitor-information';

@customElement('monitor-information-card')
export class MonitorInformationCard extends BaseDetailsCard {
    public userTypes: UserType[] = ['staff', 'tpm'];

    public startEdit(): void {
        super.startEdit();
        store.dispatch(new SetEditedDetailsCard(CARD_NAME));
    }

    public render(): TemplateResult {
        // language=HTML
        return html`
            <etools-card
                card-title="${ translate('ACTIVITY_ITEM.MONITOR_INFO')}"
                ?is-editable="${!this.editedCard || this.editedCard === CARD_NAME}"
                ?edit="${!this.isReadonly}"
                @start-edit="${() => this.startEdit()}"
                @save="${() => this.save()}"
                @cancel="${() => this.cancel()}">
                <div class="card-content" slot="content">
                    <etools-loading ?active="${ this.isLoad }" loading-text="${ translate('MAIN.LOADING_DATA_IN_PROCESS') }"></etools-loading>
                    <etools-loading ?active="${ this.isUpdate }" loading-text="${ translate('MAIN.SAVING_DATA_IN_PROCESS') }"></etools-loading>
                    <div class="layout horizontal user-types">
                        <label>${ translate('ACTIVITY_ITEM.USER_TYPE')}</label>
                        <paper-radio-group
                            selected="${ this.editedData && this.editedData.activity_type || 'staff' }"
                             @iron-select="${({ detail }: CustomEvent) => this.updateModelValue('activity_type', detail.item.name)}"
                            ?disabled="${ this.isReadonly }">
                            ${repeat(this.userTypes, (type: UserType) => html`
                                <paper-radio-button
                                    name="${ type }"
                                    ?disabled="${ this.isReadonly }">
                                    ${ translate(`ACTIVITY_ITEM.USER_TYPES.${type.toUpperCase()}`)}
                                </paper-radio-button>
                            `)}
                        </paper-radio-group>
                    </div>
                </div>
            </etools-card>
        `;
    }

    public static get styles(): CSSResultArray {
        // language=CSS
        return [elevationStyles, SharedStyles, CardStyles, css`
            .card-content {
                padding: 10px;
            }
            .user-types {
                margin: 0 12px;
            }
        `];
    }
}
