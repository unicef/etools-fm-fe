import { css, CSSResultArray, customElement, html, property, TemplateResult } from 'lit-element';
import { translate } from '../../../../../localization/localisation';
import { elevationStyles } from '../../../../styles/elevation-styles';
import { SharedStyles } from '../../../../styles/shared-styles';
import { BaseCard } from './base-card';
import { CardStyles } from '../../../../styles/card-styles';
import { repeat } from 'lit-html/directives/repeat';
import '@polymer/paper-radio-group/paper-radio-group';
import '@polymer/paper-radio-button/paper-radio-button';

@customElement('monitor-information-card')
export class MonitorInformationCard extends BaseCard {
    @property() public userType: UserType = 'staff';
    public userTypes: UserType[] = ['staff', 'tpm'];

    public render(): TemplateResult {
        // language=HTML
        return html`
            <etools-card
                card-title="${ translate('ACTIVITY_ITEM.MONITOR_INFO')}"
                is-editable
                ?edit="${!this.isReadonly}"
                @start-edit="${() => this.isReadonly = false}"
                @save="${() => this.save()}"
                @cancel="${() => this.cancel()}">
                <div class="card-content" slot="content">
                    <div class="layout horizontal user-types">
                        <label>${ translate('ACTIVITY_ITEM.USER_TYPE')}</label>
                        <paper-radio-group
                            selected="${ this.userType }"
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
