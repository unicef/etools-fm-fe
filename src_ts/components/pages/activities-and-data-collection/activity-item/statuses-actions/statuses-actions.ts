import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button-group';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import './reason-popup';
import './report-reviewer-popup';
import './confirm-submit-popup';
import {css, LitElement, TemplateResult, html, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {
  ASSIGN,
  BACK_TRANSITIONS,
  REASON_FIELDS,
  REJECT,
  REJECT_REPORT,
  SEPARATE_TRANSITIONS,
  TRANSITIONS_ORDER,
  SUBMITTED,
  REPORT_FINALIZATION,
  COMPLETED
} from './activity-statuses';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {store} from '../../../../../redux/store';
import {changeActivityStatus} from '../../../../../redux/effects/activity-details.effects';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import {updateAppLocation} from '../../../../../routing/routes';
import {ACTIVITIES_PAGE} from '../../activities-page';
import {translate, get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {SharedStyles} from '../../../../styles/shared-styles';
import {getErrorText} from '../../../../utils/utils';
import {waitForCondition} from '@unicef-polymer/etools-utils/dist/wait.util';
import '@unicef-polymer/etools-modules-common/dist/layout/are-you-sure';
import {Unsubscribe} from 'redux';
import {summaryFindingsOverall} from '../../../../../redux/selectors/activity-summary.selectors';

@customElement('statuses-actions')
export class StatusesActionsComponent extends LitElement {
  @property({type: Number}) activityId: number | null = null;
  @property({type: String}) possibleTransitions: ActivityTransition[] = [];
  @property({type: Boolean, attribute: 'is-staff'}) isStaff = false;
  @property({type: Boolean}) disableBtns = false;
  @property() protected findingsOverall: SummaryOverall[] | null | undefined = undefined;
  private findingsOverallUnsubscribe!: Unsubscribe;

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
            variant="danger"
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

  connectedCallback(): void {
    super.connectedCallback();

    // load activitySummary.findingsAndOverall.overall
    this.findingsOverallUnsubscribe = store.subscribe(
      summaryFindingsOverall((overall) => {
        this.findingsOverall = overall;
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.findingsOverallUnsubscribe();
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

    let storeState = store.getState();
    const activityDetails = storeState.activityDetails.data;

    // for these statuses must check findingsAndOverall and actionPoints data and show confirm if missing
    const isReportFinalization = newStatusData.status === SUBMITTED && activityDetails.status === REPORT_FINALIZATION;
    if (newStatusData.status === COMPLETED || isReportFinalization) {
      // wait until  findingsOverall are loaded
      await this.findingsOverallLoaded();
      const summaryIsNotCompleted = (this.findingsOverall || []).some((x: SummaryOverall) => x.on_track === null);
      let confirmText = '';
      let actionPointReminder = '';
      if (summaryIsNotCompleted) {
        // must confirm if want to Complete OR Submit from REPORT_FINALIZATION status, if not all summary completed
        confirmText = getTranslation(
          newStatusData.status === SUBMITTED
            ? 'CONFIRM_SUBMIT_SUMMARY_NOT_COMPLETE'
            : 'CONFIRM_COMPLETE_SUMMARY_NOT_COMPLETE'
        );
      }
      if (activityDetails.permissions.edit.action_points && !(storeState.actionPointsList?.data || []).length) {
        // if can add Action Point and doesn't have any, display reminder
        actionPointReminder = getTranslation('ACTION_POINT_REMINDER');
      }

      if (
        (confirmText || actionPointReminder) &&
        !(await this.confirmSubmitSummaryNotCompleted(confirmText, actionPointReminder))
      ) {
        return;
      }

      if (isReportFinalization && storeState.user.data?.is_unicef_user) {
        const reviewResponse = await this.getReportReviewer(activityDetails);
        if (!reviewResponse) {
          return;
        }
        newStatusData.report_reviewers = reviewResponse.reviewers;
      }
    }
    store.dispatch<AsyncEffect>(changeActivityStatus(this.activityId, newStatusData)).then(() => {
      storeState = store.getState();
      const errors: any = storeState.activityDetails.error;
      if (errors) {
        const backendMessage = getErrorText(errors);
        const errorText: string = backendMessage || getTranslation('PLEASE_TRY_AGAIN');
        fireEvent(this, 'toast', {text: `${getTranslation('ERROR_CHANGE_ACTIVITY_STATUS')}: ${errorText}`});
      } else if (transition.transition === REJECT) {
        updateAppLocation(`${ACTIVITIES_PAGE}`);
      }
    });
  }

  async findingsOverallLoaded() {
    return await waitForCondition(() => this.findingsOverall !== undefined, 50).then(() => true);
  }

  async confirmSubmitSummaryNotCompleted(confirmText: string, actionPointReminder: string): Promise<boolean> {
    return await openDialog({
      dialog: 'confirm-submit-popup',
      dialogData: {
        confirmText: confirmText,
        actionPointReminder: actionPointReminder
      }
    }).then(({confirmed}) => confirmed);
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

  private getReportReviewer(activity: IActivityDetails): Promise<ReportReviewerPopupResponse | null> {
    return openDialog<ReportReviewerPopupData, ReportReviewerPopupResponse>({
      dialog: 'report-reviewer-popup',
      dialogData: {activity: activity}
    }).then(({confirmed, response}: IDialogResponse<ReportReviewerPopupResponse>) => {
      if (!confirmed || !response) {
        return null;
      }
      return response;
    });
  }

  static get styles(): CSSResult[] {
    // language=CSS
    return [
      layoutStyles,
      SharedStyles,
      css`
        :host {
          display: flex;
          flex-direction: row;
        }

        etools-button-group {
          --etools-button-group-color: var(--green-color);
          height: fit-content;
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

        sl-menu-item::part(label) {
          text-transform: uppercase;
        }

        .reject-button::part(base) {
          background-color: var(--reject-color);
        }
      `
    ];
  }
}
