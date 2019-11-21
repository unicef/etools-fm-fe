import {CSSResult, customElement, css, html, LitElement, TemplateResult, property} from 'lit-element';
import {elevationStyles} from '../../../../../styles/elevation-styles';
import {ROOT_PATH} from '../../../../../../config/config';
import {store} from '../../../../../../redux/store';
import {activityDetailsData} from '../../../../../../redux/selectors/activity-details.selectors';
import {Unsubscribe} from 'redux';
import {translate} from '../../../../../../localization/localisation';

@customElement('details-note-card')
export class DetailsNoteCard extends LitElement {
  private activityDetailsUnsubscribe!: Unsubscribe;
  @property() private activityDetails: IActivityDetails | null = null;

  protected get noteInfo(): NoteInfo | null {
    if (
      this.activityDetails &&
      this.activityDetails.cancel_reason &&
      this.activityDetails.permissions.view.cancel_reason
    ) {
      return {
        titleKey: 'ACTIVITY_DETAILS.CANCELLATION_NOTE',
        text: this.activityDetails.cancel_reason
      };
    } else if (
      this.activityDetails &&
      this.activityDetails.reject_reason &&
      this.activityDetails.permissions.view.reject_reason
    ) {
      return {
        titleKey: 'ACTIVITY_DETAILS.REJECTION_NOTE',
        text: this.activityDetails.reject_reason
      };
    } else {
      return null;
    }
  }

  render(): TemplateResult {
    return this.noteInfo
      ? html`
          <section class="elevation note-container" elevation="1">
            <img class="flag-icon" src="${ROOT_PATH}/images/flag-icon.svg" />

            <div class="title">${translate(this.noteInfo.titleKey)}</div>
            <div>${this.noteInfo.text}</div>
          </section>
        `
      : html``;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.activityDetailsUnsubscribe = store.subscribe(
      activityDetailsData((data: IActivityDetails | null) => {
        this.activityDetails = data;
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.activityDetailsUnsubscribe();
  }

  protected getNoteInfo(): GenericObject | null {
    if (this.activityDetails && this.activityDetails.reject_reason) {
      return {
        titleKey: 'ACTIVITY_DETAILS.CANCELLATION_NOTE',
        text: this.activityDetails.reject_reason
      };
    } else if (this.activityDetails && this.activityDetails.cancel_reason) {
      return {
        titleKey: 'ACTIVITY_DETAILS.REJECTION_NOTE',
        text: this.activityDetails.cancel_reason
      };
    } else {
      return null;
    }
  }

  protected getTitleKey(): string {
    if (this.activityDetails && this.activityDetails.reject_reason) {
      return '';
    } else if (this.activityDetails && this.activityDetails.cancel_reason) {
      return 'ACTIVITY_DETAILS.REJECTION_NOTE';
    } else {
      return '';
    }
  }

  static get styles(): CSSResult[] {
    // language=CSS
    return [
      elevationStyles,
      css`
        .note-container {
          padding: 24px 60px;
          margin: 24px 24px 0;
          background-color: var(--primary-background-color);
          border-top: 4px solid var(--note-color);
          border-top-left-radius: 4px;
        }

        .flag-icon {
          position: absolute;
          top: -5px;
          left: 16px;
          width: 24px;
        }

        .title {
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 15px;
        }
      `
    ];
  }
}