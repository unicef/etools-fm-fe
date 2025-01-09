import {LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {DataMixin} from '../../../../common/mixins/data-mixin';
import {getDifference} from '../../../../utils/objects-diff';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';

@customElement('data-collect-popup')
export class DataCollectPopup extends DataMixin()<DataCollectionChecklist>(LitElement) {
  @property() dialogOpened = true;
  @property({type: Boolean}) isNew = true;

  static get styles(): CSSResultArray {
    return [layoutStyles];
  }

  set dialogData(data: DataCollectionChecklist) {
    this.isNew = !data;
    this.data = data;
  }

  render(): TemplateResult {
    return html`
      ${InputStyles} ${DialogStyles}
      <style>
        .container {
          margin-bottom: 14px;
        }
      </style>
      <etools-dialog
        id="dialog"
        size="md"
        keep-dialog-open
        .okBtnText="${this.isNew ? translate('MAIN.BUTTONS.ADD') : translate('MAIN.BUTTONS.SAVE')}"
        .cancelBtnText="${translate('CANCEL')}"
        dialog-title="${this.isNew
          ? translate('ACTIVITY_COLLECT.ADD_CHECKLIST')
          : translate('ACTIVITY_COLLECT.EDIT_CHECKLIST')}"
        ?opened="${this.dialogOpened}"
        @confirm-btn-clicked="${() => this.createChecklist()}"
        @close="${() => this.onClose()}"
      >
        <div class="container-dialog layout-vertical">
          <etools-textarea
            required
            maxlength="100"
            always-float-label
            placeholder="Enter ${translate('ACTIVITY_COLLECT.LABELS.INFO_SOURCE')}"
            label="${translate('ACTIVITY_COLLECT.LABELS.INFO_SOURCE')}"
            .value="${this.editedData.information_source}"
            ?invalid="${this.errors.information_source}"
            .errorMessage="${this.errors.information_source}"
            @focus="${() => this.resetFieldError('information_source')}"
            @click="${() => this.resetFieldError('information_source')}"
            @value-changed="${({detail}: CustomEvent) => this.updateModelValue('information_source', detail.value)}"
          >
          </etools-textarea>
        </div>
      </etools-dialog>
    `;
  }

  validate(): boolean {
    let isValid = true;
    if (!this.editedData.information_source) {
      this.errors = {...this.errors, information_source: 'Information source is required'};
      isValid = false;
    }
    return isValid;
  }

  createChecklist(): void {
    if (!this.validate()) {
      return;
    }
    const origin: Partial<DataCollectionChecklist> = this.originalData ? this.originalData : {};
    const diff: Partial<DataCollectionChecklist> = getDifference<DataCollectionChecklist>(origin, this.editedData, {
      toRequest: true
    });
    fireEvent(this, 'dialog-closed', {
      confirmed: true,
      response: diff
    });
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }
}
