import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button-group';
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
          <etools-button
            variant="success"
            class="arrowBtn"
            @click="${() => this.changeStatus(transition)}"
            ?disabled="${this.disableBtns}"
          >
            <etools-icon name="arrowLeftIcon" slot="prefix"></etools-icon>
          </etools-button>
        `
      : html``;
  }

  protected getRejectBtn(): TemplateResult {
    const transition: ActivityTransition | undefined = this.possibleTransitions.find(
      ({transition}: ActivityTransition) => transition === REJECT || transition === REJECT_REPORT
    );
    return transition
      ? html`
          <etools-button
            class="main-button reject-button"
            @click="${() => this.changeStatus(transition)}"
            ?disabled="${this.disableBtns}"
          >
            ${translate(`ACTIVITY_ITEM.TRANSITIONS.${transition.transition}`)}
          </etools-button>
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
    return mainTransition
      ? html`
          <etools-button-group>
            <etools-button
              variant="success"
              @click="${() => this.changeStatus(mainTransition)}"
              ?disabled="${this.disableBtns}"
            >
              ${this.getMainBtnText(mainTransition.transition)}
            </etools-button>
            ${this.getAdditionalTransitions(otherTransitions)}
          </etools-button-group>
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
      <sl-dropdown placement="bottom-end" @click="${(event: MouseEvent) => event.stopImmediatePropagation()}">
        <etools-button slot="trigger" variant="success" caret></etools-button>
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
      css`
        :host {
          display: flex;
          flex-direction: row;
        }

        etools-button-group {
          --etools-button-group-color: var(--green-color);
        }

        etools-button.sl-button-group__button {
          margin-inline: 0px !important;
          --sl-spacing-medium: 10px;
        }

        etools-button[slot='trigger'] {
          width: 45px;
          min-width: 45px;
          border-inline-start: 1px solid rgba(255, 255, 255, 0.12);
          margin-inline: 0px;
          --sl-spacing-medium: 0;
        }
        etools-button#primary {
          flex: 1;
        }

        etools-button.arrowBtn {
          min-width: 0px;
          --sl-spacing-medium: 0px;
          --sl-spacing-small: 5px;
        }
      `
    ];
  }
}
