import { css, CSSResultArray, customElement, html, property, TemplateResult } from 'lit-element';
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
import { staticDataDynamic } from '../../../../../redux/selectors/static-data.selectors';
import { TEAM_MEMBERS, TPM_PARTNERS } from '../../../../../endpoints/endpoints-list';
import { loadStaticData } from '../../../../../redux/effects/load-static-data.effect';
import { simplifyValue } from '../../../../utils/objects-diff';
import { FlexLayoutClasses } from '../../../../styles/flex-layout-classes';
import { InputStyles } from '../../../../styles/input-styles';

export const CARD_NAME: string = 'monitor-information';

const USER_STAFF: UserType = 'staff';
const USER_TPM: UserType = 'tpm';

@customElement('monitor-information-card')
export class MonitorInformationCard extends BaseDetailsCard {
    public userTypes: UserType[] = [USER_STAFF, USER_TPM];
    @property() public membersOptions: User[] = [];
    @property() public tpmPartnersOptions: EtoolsTPMPartner[] = [];
    @property() public userType!: UserType;

    @property() public tpmPartner?: EtoolsTPMPartner | null;
    @property() public teamMembers: User[] = [];
    @property() public personalResponsible?: User | null;

    public set data(data: IActivityDetails | null) {
        super.data = data;
        if (!data) {
            this.editedData.activity_type = USER_STAFF;
        }
        if (this.editedData.activity_type) {
            this.userType = this.editedData.activity_type;
        }
        this.personalResponsible = this.editedData.person_responsible as unknown as User;
        this.teamMembers = this.editedData.team_members as unknown as User[];
        this.tpmPartner = this.editedData.tpm_partner as unknown as EtoolsTPMPartner;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.loadMembersOptions(this.editedData.tpm_partner);
        store.subscribe(staticDataDynamic((teamMembers: User[] | undefined) => {
            if (!teamMembers) { return; }
            this.membersOptions = teamMembers;
        }, [TEAM_MEMBERS]));
        store.subscribe(staticDataDynamic((tpmPartners: EtoolsTPMPartner[] | undefined) => {
            if (!tpmPartners) { return; }
            this.tpmPartnersOptions = tpmPartners;
        }, [TPM_PARTNERS]));
    }

    public loadMembersOptions(id?: number | null): void {
        const params: string = !id ? `?user_type=${USER_STAFF}` : `?user_type=${USER_TPM}&tpm_partner=${id}`;
        const state: IRootState = store.getState() as IRootState;
        const isReset: boolean = !!state.staticData.teamMembers;
        store.dispatch<AsyncEffect>(loadStaticData(TEAM_MEMBERS, { params }, isReset));
    }

    public setTpmPartner(tpmPartner: EtoolsTPMPartner): void {
        if (tpmPartner) {
            this.updateModelValue('tpm_partner', tpmPartner.id);
            this.tpmPartner = tpmPartner;
            this.clearMembers();
            this.loadMembersOptions(tpmPartner.id);
        }
    }

    public setTeamMembers(members: User[]): void {
        this.updateModelValue('team_members', members);
        this.teamMembers = members;
    }

    public setPersonalResponsible(responsible: User | null): void {
        this.updateModelValue('person_responsible', responsible);
        this.personalResponsible = responsible;
    }

    public setUserType(userType: UserType): void {
        this.userType = userType;
        this.updateModelValue('activity_type', userType);
        const state: IRootState = store.getState() as IRootState;
        if (userType === USER_TPM && !state.staticData.tpmPartners) {
            store.dispatch<AsyncEffect>(loadStaticData(TPM_PARTNERS));
        }
        if (userType === USER_TPM && !this.editedData.tpm_partner) {
            this.clearMembers();
        }
    }

    public clearMembers(): void {
        this.setPersonalResponsible(null);
        this.setTeamMembers([]);
    }

    public startEdit(): void {
        super.startEdit();
        store.dispatch(new SetEditedDetailsCard(CARD_NAME));
    }

    public render(): TemplateResult {
        // language=HTML
        return html`
            ${InputStyles}
            <etools-card
                card-title="${ translate('ACTIVITY_DETAILS.MONITOR_INFO')}"
                ?is-editable="${!this.editedCard || this.editedCard === CARD_NAME}"
                ?edit="${!this.isReadonly}"
                @start-edit="${() => this.startEdit()}"
                @save="${() => this.save()}"
                @cancel="${() => this.cancel()}">
                <div class="card-content" slot="content">
                    <etools-loading ?active="${ this.isLoad }" loading-text="${ translate('MAIN.LOADING_DATA_IN_PROCESS') }"></etools-loading>
                    <etools-loading ?active="${ this.isUpdate }" loading-text="${ translate('MAIN.SAVING_DATA_IN_PROCESS') }"></etools-loading>
                    <div class="layout horizontal user-types">
                        <label>${ translate('ACTIVITY_DETAILS.USER_TYPE')}</label>
                        <paper-radio-group
                            selected="${ this.userType }"
                             @iron-select="${({ detail }: CustomEvent) => this.setUserType(detail.item.name)}"
                            ?disabled="${ this.isReadonly }">
                            ${repeat(this.userTypes, (type: UserType) => html`
                                <paper-radio-button
                                    name="${ type }"
                                    ?disabled="${ this.isReadonly }">
                                    ${ translate(`ACTIVITY_DETAILS.USER_TYPES.${type.toUpperCase()}`)}
                                </paper-radio-button>
                            `)}
                        </paper-radio-group>
                    </div>
                    <div class="layout horizontal">
                        ${ this.editedData.activity_type === USER_TPM ? html`
                        <etools-dropdown
                            class="without-border flex"
                            .selected="${ simplifyValue(this.tpmPartner) }"
                            @etools-selected-item-changed="${({ detail }: CustomEvent) =>
                                this.setTpmPartner(detail.selectedItem)}"
                            trigger-value-change-event
                            label="${ translate('ACTIVITY_DETAILS.TPM_PARTNER') }"
                            .options="${ this.tpmPartnersOptions }"
                            option-label="name"
                            option-value="id"
                            ?disabled="${ this.isReadonly }"
                            ?readonly="${ this.isReadonly }"
                            ?invalid="${ this.errors && this.errors.tpm_partner }"
                            .errorMessage="${ this.errors && this.errors.tpm_partner }"
                            @focus="${ () => this.resetFieldError('tpm_partner') }"
                            @tap="${ () => this.resetFieldError('tpm_partner') }"
                            allow-outside-scroll
                            dynamic-align></etools-dropdown>
                        ` : ''}

                        <etools-dropdown-multi
                            class="without-border flex"
                            .selectedValues="${simplifyValue(this.teamMembers) }"
                            @etools-selected-items-changed="${({ detail }: CustomEvent) =>
                                this.setTeamMembers(detail.selectedItems)}"
                            ?trigger-value-change-event="${!this.isReadonly}"
                            label="${ translate('ACTIVITY_DETAILS.TEAM_MEMBERS') }"
                            .options="${ this.membersOptions }"
                            option-label="name"
                            option-value="id"
                            ?disabled="${ this.isReadonly }"
                            ?readonly="${ this.isReadonly }"
                            ?invalid="${ this.errors && this.errors.team_members }"
                            .errorMessage="${ this.errors && this.errors.team_members }"
                            @focus="${ () => this.resetFieldError('team_members') }"
                            @tap="${ () => this.resetFieldError('team_members') }"
                            allow-outside-scroll
                            dynamic-align></etools-dropdown-multi>

                        <etools-dropdown
                            class="without-border flex"
                            .selected="${ simplifyValue(this.personalResponsible) }"
                            @etools-selected-item-changed="${({ detail }: CustomEvent) =>
                                this.setPersonalResponsible(detail.selectedItem)}"
                            ?trigger-value-change-event="${!this.isReadonly}"
                            label="${ translate('ACTIVITY_DETAILS.PERSONAL_RESPONSIBLE') }"
                            .options="${ this.membersOptions }"
                            option-label="name"
                            option-value="id"
                            ?disabled="${ this.isReadonly }"
                            ?readonly="${ this.isReadonly }"
                            ?invalid="${ this.errors && this.errors.person_responsible }"
                            .errorMessage="${ this.errors && this.errors.person_responsible }"
                            @focus="${ () => this.resetFieldError('person_responsible') }"
                            @tap="${ () => this.resetFieldError('person_responsible') }"
                            allow-outside-scroll
                            dynamic-align></etools-dropdown>
                    </div>
                </div>
            </etools-card>
        `;
    }

    public static get styles(): CSSResultArray {
        // language=CSS
        return [elevationStyles, SharedStyles, CardStyles, FlexLayoutClasses, css`
            .card-content {
                padding: 10px;
            }
            .user-types {
                margin: 0 12px;
                align-items: center;
            }
        `];
    }
}
