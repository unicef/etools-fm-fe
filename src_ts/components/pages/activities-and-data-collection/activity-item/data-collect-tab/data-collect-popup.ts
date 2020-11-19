import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {InputStyles} from '../../../../styles/input-styles';
import {DataMixin} from '../../../../common/mixins/data-mixin';
import {getDifference} from '../../../../utils/objects-diff';
import '@polymer/paper-input/paper-textarea';
import {translate} from 'lit-translate';

@customElement('data-collect-popup')
export class DataCollectPopup extends DataMixin()<DataCollectionChecklist>(LitElement) {
  @property() dialogOpened = true;
  @property({type: Boolean}) isNew = true;

  set dialogData(data: DataCollectionChecklist) {
    this.isNew = !data;
    this.data = data;
  }

  render(): TemplateResult {
    return html`
      ${InputStyles}
      <etools-dialog
        id="dialog"
        size="md"
        no-padding
        keep-dialog-open
        .okBtnText="${this.isNew ? translate('MAIN.BUTTONS.ADD') : translate('MAIN.BUTTONS.SAVE')}"
        dialog-title="${this.isNew
          ? translate('ACTIVITY_COLLECT.ADD_CHECKLIST')
          : translate('ACTIVITY_COLLECT.EDIT_CHECKLIST')}"
        ?opened="${this.dialogOpened}"
        @confirm-btn-clicked="${() => this.createChecklist()}"
        @close="${() => this.onClose()}"
      >
        <div class="container layout vertical">
          <paper-textarea
            class="without-border"
            required
            maxlength="100"
            always-float-label
            placeholder="Enter ${translate('ACTIVITY_COLLECT.LABELS.INFO_SOURCE')}"
            label="${translate('ACTIVITY_COLLECT.LABELS.INFO_SOURCE')}"
            .value="${this.editedData.information_source}"
            ?invalid="${this.errors.information_source}"
            .errorMessage="${this.errors.information_source}"
            @focus="${() => this.resetFieldError('information_source')}"
            @tap="${() => this.resetFieldError('information_source')}"
            @value-changed="${({detail}: CustomEvent) => this.updateModelValue('information_source', detail.value)}"
          >
          </paper-textarea>
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
    fireEvent(this, 'response', {
      confirmed: true,
      response: diff
    });
  }

  onClose(): void {
    fireEvent(this, 'response', {confirmed: false});
  }
}
