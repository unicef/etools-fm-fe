import {CSSResultArray, LitElement, TemplateResult, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/src/fire-event.util';
import {translate, get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import {SEND_REPORT_EMAIL, EMAIL_RECIPIENTS} from '../../../endpoints/endpoints-list';
import {sendRequest} from '@unicef-polymer/etools-utils/src/etools-ajax';
import {SharedStyles} from '../../styles/shared-styles';
import {CardStyles} from '../../styles/card-styles';
import {DialogStyles} from '../../styles/dialog-styles';
import {InputStyles} from '../../styles/input-styles';
import {getEndpoint} from '../../../endpoints/endpoints';
import {parseRequestErrorsAndShowAsToastMsgs} from '@unicef-polymer/etools-utils/src/etools-ajax/ajax-error-parser';

export interface SendReportEmailDialogData {
  activityId: number;
}

export interface SendReportEmailDialogResponse {
  confirmed: boolean;
}

interface RecipientOption {
  id: string | number;
  name: string;
  email: string;
  type: 'user' | 'partner';
}

@customElement('send-report-email-dialog')
export class SendReportEmailDialog extends LitElement {
  @property() protected dialogOpened = true;
  @state() protected activityId: number | null = null;
  @state() protected selectedRecipients: RecipientOption[] = [];
  @state() protected recipientOptions: RecipientOption[] = [];
  @state() protected message: string = '';
  @state() protected isSending = false;
  @state() protected isLoadingRecipients = false;
  @state() protected error: string | null = null;
  @state() protected recipientsError: string | null = null;

  set dialogData({activityId}: SendReportEmailDialogData) {
    this.activityId = activityId;
    this.loadRecipients();
  }

  async loadRecipients(): Promise<void> {
    if (this.isLoadingRecipients) {
      return;
    }

    this.isLoadingRecipients = true;
    try {
      const endpoint = getEndpoint(EMAIL_RECIPIENTS);
      const response = await sendRequest({
        method: 'GET',
        endpoint: endpoint
      });
      this.recipientOptions = response || [];
    } catch (error: any) {
      console.error('Error loading recipients:', error);
      this.recipientOptions = [];
    } finally {
      this.isLoadingRecipients = false;
    }
  }

  render(): TemplateResult | void {
    return html`
      ${InputStyles} ${DialogStyles}
      <style>
        .form-field {
          margin-bottom: 16px;
        }
        .error-message {
          color: var(--error-color, #d32f2f);
          font-size: 14px;
          margin-top: 8px;
        }
        .help-text {
          font-size: 12px;
          color: var(--secondary-text-color, #666);
          margin-top: 4px;
        }
      </style>
      <etools-dialog
        id="dialog"
        size="md"
        keep-dialog-open
        dialog-title="${translate('ACTIVITY_DETAILS.SEND_REPORT_BY_EMAIL')}"
        ?opened="${this.dialogOpened}"
        .okBtnText="${translate('SEND')}"
        .cancelBtnText="${translate('CANCEL')}"
        ?disable-confirm-btn="${this.isSending || !this.isValid()}"
        @close="${this.onClose}"
        @confirm-btn-clicked="${() => this.sendEmail()}"
      >
        <etools-loading
          ?active="${this.isSending}"
          loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
        ></etools-loading>
        <div class="row">
          <div class="form-field">
            <etools-dropdown-multi
              label="${translate('RECIPIENTS')}"
              enable-add-new
              .selectedValues="${this.selectedRecipients.map((r) => r.id)}"
              @etools-selected-items-changed="${(e: CustomEvent) => this.onRecipientsChanged(e.detail.selectedItems)}"
              .options="${this.recipientOptions}"
              option-label="name"
              option-value="id"
              placeholder="${translate('SELECT_RECIPIENTS')}"
              required
              ?invalid="${!!this.recipientsError}"
              .errorMessage="${this.recipientsError}"
              allow-outside-scroll
              dynamic-align
              trigger-value-change-event
            ></etools-dropdown-multi>
          </div>

          <div class="form-field">
            <etools-textarea
              label="${translate('MESSAGE')}"
              .value="${this.message}"
              @value-changed="${(e: any) => (this.message = e.detail.value)}"
              placeholder="${translate('OPTIONAL_MESSAGE_TO_INCLUDE_IN_EMAIL')}"
              rows="4"
            ></etools-textarea>
          </div>
        </div>
      </etools-dialog>
    `;
  }

  onRecipientsChanged(selectedItems: any[]): void {
    this.selectedRecipients = selectedItems;
  }

  isValid(): boolean {
    return this.selectedRecipients.length > 0;
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  async sendEmail(): Promise<void> {
    if (!this.isValid() || !this.activityId || this.isSending) {
      return;
    }

    this.isSending = true;
    this.recipientsError = null;

    // Extract recipient IDs from selected recipients
    const recipientIds = this.selectedRecipients
      .map((recipient) => recipient.id)
      .filter((id: string | number) => id !== null && id !== undefined);

    if (recipientIds.length === 0) {
      this.recipientsError = getTranslation('REQUIRED_FIELD') as any as string;
      this.isSending = false;
      return;
    }

    try {
      const endpoint = getEndpoint(SEND_REPORT_EMAIL, {id: this.activityId});
      await sendRequest({
        method: 'POST',
        endpoint: endpoint,
        body: {
          recipients: recipientIds,
          message: this.message || undefined
        }
      });

      fireEvent(this, 'toast', {
        text: getTranslation('REPORT_SENT_SUCCESSFULLY')
      });
      fireEvent(this, 'dialog-closed', {confirmed: true});
    } catch (error: any) {
      parseRequestErrorsAndShowAsToastMsgs(error, this);
      console.error('Error sending report email:', error);
    } finally {
      this.isSending = false;
    }
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, CardStyles];
  }
}

export interface SendReportEmailDialogData {
  activityId: number;
}

export interface SendReportEmailDialogResponse {
  confirmed: boolean;
}

export function openSendReportEmailDialog(activityId: number): Promise<SendReportEmailDialogResponse> {
  return new Promise((resolve) => {
    const dialog = document.createElement('send-report-email-dialog') as SendReportEmailDialog;
    dialog.dialogData = {activityId};
    document.body.appendChild(dialog);

    const handleClose = (e: CustomEvent) => {
      const response = e.detail as SendReportEmailDialogResponse;
      resolve(response);
      document.body.removeChild(dialog);
      dialog.removeEventListener('dialog-closed', handleClose as any);
    };

    dialog.addEventListener('dialog-closed', handleClose as any);
  });
}
