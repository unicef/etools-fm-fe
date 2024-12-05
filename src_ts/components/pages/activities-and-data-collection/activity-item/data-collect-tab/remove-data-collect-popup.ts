import {LitElement, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {store} from '../../../../../redux/store';
import {deleteDataCollectionChecklistItem} from '../../../../../redux/effects/data-collection.effects';
import {Unsubscribe} from 'redux';
import {removalInProgress} from '../../../../../redux/selectors/data-collection.selectors';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';

@customElement('remove-data-collect-popup')
export class RemoveDataCollectPopup extends LitElement {
  @property() activityId!: number;
  @property() checklistId!: number;
  @property() dialogOpened = false;

  private readonly updateInProgressUnsubscribe: Unsubscribe;

  constructor() {
    super();
    this.updateInProgressUnsubscribe = store.subscribe(
      removalInProgress((removalInProgress: boolean | null) => {
        if (removalInProgress) {
          return;
        }

        // check errors on request complete
        const errors: GenericObject = store.getState().dataCollection.errors.dataCollectionChecklistItemRemovalFailure;
        if (errors && Object.keys(errors).length) {
          fireEvent(this, 'toast', {text: errors.data.detail});
          return;
        }

        // close popup if delete was successful
        this.dialogOpened = false;
        fireEvent(this, 'dialog-closed', {confirmed: true});
      }, false)
    );
  }

  set dialogData({activityId, checklistId, dialogOpened}: DataCollectionItemRemoval) {
    this.activityId = activityId;
    this.checklistId = checklistId;
    this.dialogOpened = dialogOpened;
  }

  render(): TemplateResult {
    return html`
      ${InputStyles} ${DialogStyles}
      <etools-dialog
        size="md"
        keep-dialog-open
        theme="confirmation"
        ?opened="${this.dialogOpened}"
        ok-btn-text="${translate('MAIN.BUTTONS.DELETE')}"
        .cancelBtnText="${translate('CANCEL')}"
        @confirm-btn-clicked="${() => this.processRequest()}"
        @close="${this.onClose}"
      >
        <div class="container-dialog layout-horizontal">
          <div>${translate('ACTIVITY_ITEM.DATA_COLLECTION.DELETE_ITEM')}</div>
        </div>
      </etools-dialog>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.updateInProgressUnsubscribe();
  }

  processRequest(): void {
    store.dispatch<AsyncEffect>(deleteDataCollectionChecklistItem(this.activityId, this.checklistId));
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }
}
