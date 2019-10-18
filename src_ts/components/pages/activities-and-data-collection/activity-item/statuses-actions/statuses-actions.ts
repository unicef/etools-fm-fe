import '@polymer/paper-button';
import { css, CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { ActivityStatus, ComplexMainActionData, POSSIBLE_TRANSITIONS } from './activity-statuses';
import { arrowLeftIcon, arrowRightIcon } from '../../../../styles/app-icons';
import { FlexLayoutClasses } from '../../../../styles/flex-layout-classes';
import { translate } from '../../../../../localization/localisation';
import { store } from '../../../../../redux/store';
import { changeActivityStatus } from '../../../../../redux/effects/activity-details.effects';
import { fireEvent } from '../../../../utils/fire-custom-event';

@customElement('statuses-actions')
export class StatusesActionsComponent extends LitElement {
    @property({ type: String }) public currentStatus: ActivityStatus | null = null;
    @property({ type: String }) public activityType: 'staff' | 'tpm' | null = null;
    @property({ type: Number }) public activityId: number | null = null;

    public render(): TemplateResult {
        // language=HTML
        return html`
            <!--  BACK Button  -->
            <paper-button class="back-button" ?hidden="${ this.hideBackButton() }" @tap="${ () => this.changeStatus('backAction') }">${ arrowLeftIcon }</paper-button>


            <!--  REJECT Button  -->
            <paper-button class="back-button" ?hidden="${ this.hideRejectButton() }" @tap="${ () => this.changeStatus('rejectAction') }">${ translate('ACTIVITY_ITEM.TRANSITIONS.REJECT') }</paper-button>


            <!--  MAIN Button  -->
            ${ !this.isStatusCorrect(this.currentStatus) || this.activityType === null ? '' : html`
                <paper-button class="main-button" @tap="${ () => this.changeStatus('mainAction') }">
                    <span>${ this.getMainButtonText() }</span>${ arrowRightIcon }
                </paper-button>
            ` }

        `;
    }

    protected hideBackButton(): boolean {
        return !this.isStatusCorrect(this.currentStatus) || !POSSIBLE_TRANSITIONS[this.currentStatus].backAction;
    }

    protected hideRejectButton(): boolean {
        return !this.isStatusCorrect(this.currentStatus) || !POSSIBLE_TRANSITIONS[this.currentStatus].rejectAction;
    }

    private getMainButtonText(): string {
        if (!this.isStatusCorrect(this.currentStatus) || this.activityType === null) { return ''; }
        const mainAction: ActivityStatus | ComplexMainActionData = POSSIBLE_TRANSITIONS[this.currentStatus].mainAction;
        const nextStatus: ActivityStatus = typeof mainAction === 'string' ? mainAction : mainAction[this.activityType];
        return translate(`ACTIVITY_ITEM.TRANSITIONS.FROM_${ this.currentStatus }_TO_${ nextStatus }`);
    }

    private changeStatus(actionType: 'backAction' | 'rejectAction' | 'mainAction'): void {
        if (
            !this.isStatusCorrect(this.currentStatus) ||
            this.activityType === null ||
            this.activityId === null
        ) { return; }

        const action: ActivityStatus | ComplexMainActionData | undefined =
            POSSIBLE_TRANSITIONS[this.currentStatus][actionType];

        if (!actionType) { return; }

        const nextStatus: ActivityStatus = typeof action === 'string' ?
            action :
            (action as ComplexMainActionData)[this.activityType];
        store
            .dispatch<AsyncEffect>(changeActivityStatus(this.activityId, nextStatus))
            .then(() => {
                const errors: any = store.getState().activityDetails.error;
                if (!errors) { return; }

                const errorText: string = errors.data && errors.data[0] || 'please try again later';
                fireEvent(this, 'toast', { text: `Can not change activity status: ${ errorText }` });
            });
    }

    private isStatusCorrect(status: string | null): status is ActivityStatus {
        return status !== null && Boolean(POSSIBLE_TRANSITIONS[status]);
    }

    public static get styles(): CSSResult[] {

        // language=CSS
        return [FlexLayoutClasses, css`
            :host {
                display: flex;
                flex-direction: row;
            }
            .back-button {
                width: 36px;
                height: 36px;
                min-width: 0;
                color: white;
                background: var(--green-color);
                font-weight: 500;
            }

            .main-button {
                height: 36px;
                padding: 0 18px;
                color: white;
                background: var(--green-color);
                font-weight: 500;
            }

            .main-button span {
                margin-right: 7px;
            }
        `];
    }
}
