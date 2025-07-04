import {CSSResultArray, LitElement, PropertyValues, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {SharedStyles} from '../../../../styles/shared-styles';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import {get as getTranslation, translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {CardStyles} from '../../../../styles/card-styles';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import {store} from '../../../../../redux/store';
import {usersDataSelectors} from '../../../../../redux/selectors/static-data.selectors';
import {simplifyValue} from '@unicef-polymer/etools-utils/dist/equality-comparisons.util';
const USER_STAFF: UserType = 'staff';

@customElement('report-reviewer-popup')
export class ReportReviewerPopup extends LitElement {
  @property() protected dialogOpened = true;
  @property() protected reviewerInfoText: string | Callback = '';
  @property() protected reason = '';
  @property() protected error = '';
  @property() activity!: IActivityDetails;
  @property() users: User[] = [];
  private userUnsubscribe!: Callback;

  set dialogData({activity}: ReportReviewerPopupData) {
    this.activity = activity;
    this.reviewerInfoText =
      this.activity.report_reviewers && this.activity.report_reviewers.length
        ? getTranslation('ACTIVITY_DETAILS.REPORT_REVIEWER_CONFIRM')
        : getTranslation('ACTIVITY_DETAILS.REPORT_REVIEWER_SELECT');
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.userUnsubscribe = store.subscribe(
      usersDataSelectors((users: User[] | undefined) => {
        if (!users) {
          return;
        }
        this.users = users.filter((user: User) => {
          return user.user_type === USER_STAFF;
        });
      })
    );
  }

  render(): TemplateResult | void {
    return html`
      ${InputStyles} ${DialogStyles}
      <style>
        .confirm-panel {
          padding: 20px;
          background: var(--secondary-background-color);
          font-weight: 700;
        }
        .horizontal {
          margin-bottom: 20px;
        }
      </style>
      <etools-dialog
        id="dialog"
        size="md"
        keep-dialog-open
        ?opened="${this.dialogOpened}"
        .okBtnText="${translate('MAIN.BUTTONS.CONFIRM')}"
        .cancelBtnText="${translate('CANCEL')}"
        dialog-title="${translate('ACTIVITY_DETAILS.REPORT_REVIEWERS')}"
        @close="${this.onClose}"
        @confirm-btn-clicked="${() => this.confirmReviewer()}"
      >
        <div class="container-dialog">
          <div class="layout horizontal confirm-panel">
            <span>${this.reviewerInfoText}</span>
          </div>
          <div class="layout horizontal">
            <etools-dropdown-multi
              class="flex-6"
              id="reportReviewerPreliminary"
              .selectedValues="${simplifyValue(this.activity?.report_reviewers)}"
              @etools-selected-items-changed="${({detail}: CustomEvent) => {
                this.activity.report_reviewers = detail.selectedItems;
                this.requestUpdate();
              }}"
              trigger-value-change-event
              label="${translate('ACTIVITY_DETAILS.REPORT_REVIEWERS')}"
              .options="${this.users}"
              @focus="${() => (this.error = '')}"
              ?invalid="${Boolean(this.error)}"
              error-message="${this.error}"
              option-label="name"
              option-value="id"
              allow-outside-scroll
              dynamic-align
            ></etools-dropdown-multi>
          </div>
        </div>
      </etools-dialog>
    `;
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  confirmReviewer(): void {
    if (!this.activity.report_reviewers || !this.activity.report_reviewers.length) {
      this.error = getTranslation('THIS_FIELD_IS_REQUIRED');
      return;
    }
    fireEvent(this, 'dialog-closed', {
      confirmed: true,
      response: {reviewers: simplifyValue(this.activity.report_reviewers)}
    });
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.userUnsubscribe();
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, CardStyles];
  }
}
