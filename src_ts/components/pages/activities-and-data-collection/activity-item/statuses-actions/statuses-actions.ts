import '@polymer/paper-button';
import '@polymer/paper-menu-button';
import '@polymer/paper-icon-button';
import {css, CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {BACK_TO_CHECKLIST, BACK_TO_DRAFT, REJECT, SEPARATE_TRANSITIONS, TRANSITIONS_ORDER} from './activity-statuses';
import {arrowLeftIcon} from '../../../../styles/app-icons';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {translate} from '../../../../../localization/localisation';
import {store} from '../../../../../redux/store';
import {changeActivityStatus} from '../../../../../redux/effects/activity-details.effects';
import {fireEvent} from '../../../../utils/fire-custom-event';

@customElement('statuses-actions')
export class StatusesActionsComponent extends LitElement {
  @property({type: Number}) activityId: number | null = null;
  @property({type: String}) possibleTransitions: ActivityTransition[] = [];

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
      ({transition}: ActivityTransition) => transition === BACK_TO_CHECKLIST || transition === BACK_TO_DRAFT
    );
    return transition
      ? html`
          <paper-button class="back-button" @tap="${() => this.changeStatus(transition.target)}">
            ${arrowLeftIcon}
          </paper-button>
        `
      : html``;
  }

  protected getRejectBtn(): TemplateResult {
    const transition: ActivityTransition | undefined = this.possibleTransitions.find(
      ({transition}: ActivityTransition) => transition === REJECT
    );
    return transition
      ? html`
          <paper-button class="reject-button" @tap="${() => this.changeStatus(transition.target)}">
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
    const className: string = `main-button${otherTransitions.length ? ' with-additional' : ''}`;
    return mainTransition
      ? html`
          <paper-button class="${className}" @tap="${() => this.changeStatus(mainTransition.target)}">
            ${translate(`ACTIVITY_ITEM.TRANSITIONS.${mainTransition.transition}`)}
            ${this.getAdditionalTransitions(otherTransitions)}
          </paper-button>
        `
      : html``;
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
              <div class="other-options" @tap="${() => this.changeStatus(transition.target)}">
                ${translate(`ACTIVITY_ITEM.TRANSITIONS.${transition.transition}`)}
              </div>
            `
          )}
        </div>
      </paper-menu-button>
    `;
  }

  private changeStatus(nextStatus: ActivityStatus): void {
    if (!this.activityId) {
      return;
    }
    console.log(nextStatus);
    store.dispatch<AsyncEffect>(changeActivityStatus(this.activityId, nextStatus)).then(() => {
      const errors: any = store.getState().activityDetails.error;
      if (!errors) {
        return;
      }

      const errorText: string = (errors.data && errors.data[0]) || 'please try again later';
      fireEvent(this, 'toast', {text: `Can not change activity status: ${errorText}`});
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
