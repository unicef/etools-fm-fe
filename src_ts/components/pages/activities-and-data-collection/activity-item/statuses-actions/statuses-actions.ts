import '@polymer/paper-button';
import {css, CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {ActivityStatus, ActivityTransition, POSSIBLE_TRANSITIONS} from './activity-statuses';
import {arrowLeftIcon, arrowRightIcon} from '../../../../styles/app-icons';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {translate} from '../../../../../localization/localisation';
import {store} from '../../../../../redux/store';
import {changeActivityStatus} from '../../../../../redux/effects/activity-details.effects';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {hasActivityPermission, Permissions} from '../../../../../config/permissions';

@customElement('statuses-actions')
export class StatusesActionsComponent extends LitElement {
  @property({type: String}) activityDetails: IActivityDetails | null = null;

  static get styles(): CSSResult[] {
    // language=CSS
    return [
      FlexLayoutClasses,
      css`
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
      `
    ];
  }

  render(): TemplateResult {
    // language=HTML
    return html`
      <!--  BACK Button  -->
      <paper-button
        class="back-button"
        ?hidden="${this.hideActionButton('backAction')}"
        @tap="${() => this.changeStatus('backAction')}"
      >
        ${arrowLeftIcon}
      </paper-button>

      <!--  REJECT Button  -->
      <paper-button
        class="back-button"
        ?hidden="${this.hideActionButton('rejectAction')}"
        @tap="${() => this.changeStatus('rejectAction')}"
      >
        ${translate('ACTIVITY_ITEM.TRANSITIONS.REJECT')}
      </paper-button>

      <!--  MAIN Button  -->
      ${this.hideActionButton('mainAction')
        ? ''
        : html`
            <paper-button class="main-button" @tap="${() => this.changeStatus('mainAction')}">
              <span>${this.getMainButtonText()}</span>${arrowRightIcon}
            </paper-button>
          `}
    `;
  }

  protected hideActionButton(actionType: 'backAction' | 'rejectAction' | 'mainAction'): boolean {
    return (
      !this.detailsAreValid(this.activityDetails) ||
      !POSSIBLE_TRANSITIONS[this.activityDetails.status][actionType] ||
      !hasActivityPermission(Permissions.MAKE_STATUS_TRANSITION, this.activityDetails)
    );
  }

  private getMainButtonText(): string {
    if (!this.detailsAreValid(this.activityDetails)) {
      return '';
    }

    const currentStatus: string = this.activityDetails.status;
    const nextStatus: ActivityStatus = POSSIBLE_TRANSITIONS[currentStatus].mainAction;
    return translate(`ACTIVITY_ITEM.TRANSITIONS.FROM_${currentStatus}_TO_${nextStatus}`);
  }

  private changeStatus(actionType: 'backAction' | 'rejectAction' | 'mainAction'): void {
    if (!this.detailsAreValid(this.activityDetails)) {
      return;
    }

    const currentStatus: string = this.activityDetails.status;
    const activityId: number = this.activityDetails.id;

    const transitionData: ActivityTransition | undefined = POSSIBLE_TRANSITIONS[currentStatus];
    if (!transitionData) {
      throw new Error(`Can not find ActivityTransition data for selected status - "${currentStatus}"`);
    }

    const nextStatus: ActivityStatus | undefined = transitionData && transitionData[actionType];

    if (!nextStatus) {
      console.warn(`Selected action type "${actionType}" is missing in status "${currentStatus}"`);
      return;
    }

    store.dispatch<AsyncEffect>(changeActivityStatus(activityId, nextStatus)).then(() => {
      const errors: any = store.getState().activityDetails.error;
      if (!errors) {
        return;
      }

      const errorText: string = (errors.data && errors.data[0]) || 'please try again later';
      fireEvent(this, 'toast', {text: `Can not change activity status: ${errorText}`});
    });
  }

  private detailsAreValid(activityDetails: IActivityDetails | null): activityDetails is IActivityDetails {
    return (
      activityDetails !== null &&
      activityDetails !== undefined &&
      POSSIBLE_TRANSITIONS[activityDetails.status] !== undefined
    );
  }
}
