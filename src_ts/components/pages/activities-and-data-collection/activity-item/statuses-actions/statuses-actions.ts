import '@polymer/paper-button';
import '@polymer/paper-menu-button';
import '@polymer/paper-icon-button';
import './reason-popup';
import {css, CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {
  ASSIGN,
  BACK_TRANSITIONS,
  REASON_FIELDS,
  REJECT,
  REJECT_REPORT,
  SEPARATE_TRANSITIONS,
  TRANSITIONS_ORDER
} from './activity-statuses';
import {arrowLeftIcon} from '../../../../styles/app-icons';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {store} from '../../../../../redux/store';
import {changeActivityStatus} from '../../../../../redux/effects/activity-details.effects';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {openDialog} from '../../../../utils/dialog';
import {updateAppLocation} from '../../../../../routing/routes';
import {ACTIVITIES_PAGE} from '../../activities-page';
import {translate} from 'lit-translate';

@customElement('statuses-actions')
export class StatusesActionsComponent extends LitElement {
  @property({type: Number}) activityId: number | null = null;
  @property({type: String}) possibleTransitions: ActivityTransition[] = [];
  @property({type: Boolean, attribute: 'is-staff'}) isStaff = false;

  render(): TemplateResult {
    // language=HTML
    return html`
      <!--  BACK Button  -->
      ${this.getBackBtn()}

      <!--  REJECT Button  -->
      ${this.getRejectBtn()}

      <!--  MAIN Button  -->
      ${this.getMainBtn()}
    `;
  }

  protected getBackBtn(): TemplateResult {
    const transition:
      | ActivityTransition
      | undefined = this.possibleTransitions.find(({transition}: ActivityTransition) =>
      BACK_TRANSITIONS.has(transition)
    );
    return transition
      ? html`
          <paper-button class="back-button" @tap="${() => this.changeStatus(transition)}">
            ${arrowLeftIcon}
          </paper-button>
        `
      : html``;
  }

  protected getRejectBtn(): TemplateResult {
    const transition: ActivityTransition | undefined = this.possibleTransitions.find(
      ({transition}: ActivityTransition) => transition === REJECT || transition === REJECT_REPORT
    );
    return transition
      ? html`
          <paper-button class="main-button reject-button" @tap="${() => this.changeStatus(transition)}">
            ${translate(`ACTIVITY_ITEM.TRANSITIONS.${transition.transition}`)}
          </paper-button>
        `
      : html``;
  }

  protected getMainBtn(): TemplateResult {
    const [mainTransition, ...otherTransitions]: ActivityTransition[] = this.possibleTransitions
      .filter(({transition}: ActivityTransition) => !SEPARATE_TRANSITIONS.has(transition))
      .sort(
        (transitionA: ActivityTransition, transitionB: ActivityTransition) =>
          TRANSITIONS_ORDER.indexOf(transitionA.transition) - TRANSITIONS_ORDER.indexOf(transitionB.transition)
      );
    const className = `main-button${otherTransitions.length ? ' with-additional' : ''}`;
    return mainTransition
      ? html`
          <paper-button class="${className}" @tap="${() => this.changeStatus(mainTransition)}">
            ${this.getMainBtnText(mainTransition.transition)} ${this.getAdditionalTransitions(otherTransitions)}
          </paper-button>
        `
      : html``;
  }

  private getMainBtnText(transitionName: string): string | Callback {
    const key: string = transitionName === ASSIGN && this.isStaff ? 'ASSIGN_AND_ACCEPT' : transitionName;
    return translate(`ACTIVITY_ITEM.TRANSITIONS.${key}`);
  }

  private getAdditionalTransitions(transitions?: ActivityTransition[]): TemplateResult {
    if (!transitions || !transitions.length) {
      return html``;
    }
    return html`
      <paper-menu-button horizontal-align="right" @tap="${(event: MouseEvent) => event.stopImmediatePropagation()}">
        <paper-icon-button slot="dropdown-trigger" class="option-button" icon="expand-more"></paper-icon-button>
        <div slot="dropdown-content">
          ${transitions.map(
            (transition: ActivityTransition) => html`
              <div class="other-options" @tap="${() => this.changeStatus(transition)}">
                ${translate(`ACTIVITY_ITEM.TRANSITIONS.${transition.transition}`)}
              </div>
            `
          )}
        </div>
      </paper-menu-button>
    `;
  }

  private async changeStatus(transition: ActivityTransition): Promise<void> {
    if (!this.activityId) {
      return;
    }
    const newStatusData: Partial<IActivityDetails> | null = REASON_FIELDS[transition.transition]
      ? await this.getReasonComment(transition)
      : {
          status: transition.target
        };

    if (!newStatusData) {
      return;
    }
    store.dispatch<AsyncEffect>(changeActivityStatus(this.activityId, newStatusData)).then(() => {
      const errors: any = store.getState().activityDetails.error;
      if (errors) {
        const backendMessage: string = Array.isArray(errors.data) ? errors.data[0] : errors.data;
        const errorText: string = backendMessage || 'please try again later';
        fireEvent(this, 'toast', {text: `Can not change activity status: ${errorText}`});
      } else if (transition.transition === REJECT) {
        updateAppLocation(`${ACTIVITIES_PAGE}`);
      }
    });
  }

  private getReasonComment(transition: ActivityTransition): Promise<Partial<IActivityDetails | null>> {
    return openDialog<ReasonPopupData, ReasonPopupResponse>({
      dialog: 'reason-popup',
      dialogData: {
        popupTitle: `ACTIVITY_ITEM.REASON_FOR_TRANSITION.${transition.transition}.TITLE`,
        label: `ACTIVITY_ITEM.REASON_FOR_TRANSITION.${transition.transition}.LABEL`
      }
    }).then(({confirmed, response}: IDialogResponse<ReasonPopupResponse>) => {
      if (!confirmed || !response) {
        return null;
      }

      const field: keyof IActivityDetails = REASON_FIELDS[transition.transition];
      return {
        status: transition.target,
        [field]: response.comment
      };
    });
  }

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

        .reject-button {
          background: var(--reject-color);
        }

        .main-button.with-additional {
          padding: 0 0 0 18px;
        }

        .main-button span {
          margin-right: 7px;
        }

        div[slot='dropdown-content'] {
          padding: 20px 24px;
          color: var(--primary-text-color);
        }
      `
    ];
  }
}
