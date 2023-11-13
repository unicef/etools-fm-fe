import '@shoelace-style/shoelace/dist/components/button/button.js';
import {buttonsStyles} from '@unicef-polymer/etools-unicef/src/styles/button-styles';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/button-group/button-group.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import './reason-popup';
import {css, LitElement, TemplateResult, html, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {
  ASSIGN,
  BACK_TRANSITIONS,
  REASON_FIELDS,
  REJECT,
  REJECT_REPORT,
  SEPARATE_TRANSITIONS,
  TRANSITIONS_ORDER
} from './activity-statuses';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {store} from '../../../../../redux/store';
import {changeActivityStatus} from '../../../../../redux/effects/activity-details.effects';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import {updateAppLocation} from '../../../../../routing/routes';
import {ACTIVITIES_PAGE} from '../../activities-page';
import {translate, get as getTranslation} from 'lit-translate';
import {SharedStyles} from '../../../../styles/shared-styles';
import {getErrorText} from '../../../../utils/utils';

@customElement('statuses-actions')
export class StatusesActionsComponent extends LitElement {
  @property({type: Number}) activityId: number | null = null;
  @property({type: String}) possibleTransitions: ActivityTransition[] = [];
  @property({type: Boolean, attribute: 'is-staff'}) isStaff = false;
  @property({type: Boolean}) disableBtns = false;

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
    const transition: ActivityTransition | undefined = this.possibleTransitions.find(
      ({transition}: ActivityTransition) => BACK_TRANSITIONS.has(transition)
    );
    return transition
      ? html`
          <sl-button
            variant="success"
            @click="${() => this.changeStatus(transition)}"
            ?disabled="${this.disableBtns}"
          >
            <etools-icon name="arrowLeftIcon" slot="prefix"></etools-icon>
          </sl-button>
        `
      : html``;
  }

  protected getRejectBtn(): TemplateResult {
    const transition: ActivityTransition | undefined = this.possibleTransitions.find(
      ({transition}: ActivityTransition) => transition === REJECT || transition === REJECT_REPORT
    );
    return transition
      ? html`
          <sl-button
            class="main-button reject-button"
            @click="${() => this.changeStatus(transition)}"
            ?disabled="${this.disableBtns}"
          >
            ${translate(`ACTIVITY_ITEM.TRANSITIONS.${transition.transition}`)}
          </sl-button>
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
          <sl-button-group>
            <sl-button
              variant="primary"
              class="${className}"
              @click="${() => this.changeStatus(mainTransition)}"
              ?disabled="${this.disableBtns}"
            >
              ${this.getMainBtnText(mainTransition.transition)} ${this.getAdditionalTransitions(otherTransitions)}
            </sl-button>
          </sl-button-group>
        `
      : html``;
  }

  private getMainBtnText(transitionName: string) {
    const key: string = transitionName === ASSIGN && this.isStaff ? 'ASSIGN_AND_ACCEPT' : transitionName;
    return translate(`ACTIVITY_ITEM.TRANSITIONS.${key}`);
  }

  private getAdditionalTransitions(transitions?: ActivityTransition[]): TemplateResult {
    if (!transitions || !transitions.length) {
      return html``;
    }
    return html`
      <sl-dropdown @click="${(event: MouseEvent) => event.stopImmediatePropagation()}">
        <sl-button slot="trigger" variant="primary" caret></sl-button>
        <sl-menu>
          ${transitions.map(
            (transition: ActivityTransition) => html`
              <sl-menu-item @click="${() => this.changeStatus(transition)}">
                ${translate(`ACTIVITY_ITEM.TRANSITIONS.${transition.transition}`)}
              </sl-menu-item>
            `
          )}
        </sl-menu>
      </sl-dropdown>
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
        const backendMessage = getErrorText(errors);
        const errorText: string = backendMessage || getTranslation('PLEASE_TRY_AGAIN');
        fireEvent(this, 'toast', {text: `${getTranslation('ERROR_CHANGE_ACTIVITY_STATUS')}: ${errorText}`});
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
      SharedStyles,
      buttonsStyles,
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

        .back-button svg {
          color: white;
        }

        .back-button[disabled] svg {
          color: lightgray;
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

        paper-button[disabled] {
          color: lightgray;
        }

        div[slot='dropdown-content'] {
          padding: 20px 24px;
          color: var(--primary-text-color);
        }
      `
    ];
  }
}
