import {CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {PartnersMixin} from '../../../../../../../common/mixins/partners-mixin';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import '@unicef-polymer/etools-dialog/etools-dialog.js';
import {simplifyValue} from '../../../../../../../utils/objects-diff';
import {InputStyles} from '../../../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../../../styles/dialog-styles';
import {SharedStyles} from '../../../../../../../styles/shared-styles';
import {FlexLayoutClasses} from '../../../../../../../styles/flex-layout-classes';
import {translate} from 'lit-translate';

@customElement('partner-popup')
export class PartnerPopup extends PartnersMixin(LitElement) {
  @property() dialogOpened = true;
  @property() partner: EtoolsPartner | null = null;

  static get styles(): CSSResultArray {
    return [SharedStyles, FlexLayoutClasses];
  }

  selectPartner(item: EtoolsPartner): void {
    this.partner = item;
  }

  addPartner(): void {
    fireEvent(this, 'dialog-closed', {confirmed: true, response: this.partner});
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  // language=HTML
  render(): TemplateResult {
    return html`
      ${InputStyles} ${DialogStyles}
      <etools-dialog
        id="dialog"
        size="md"
        no-padding
        keep-dialog-open
        .okBtnText="${translate('MAIN.BUTTONS.ADD')}"
        .cancelBtnText="${translate('CANCEL')}"
        dialog-title="${translate('ACTIVITY_DETAILS.ADD_PARTNER')}"
        ?opened="${this.dialogOpened}"
        @confirm-btn-clicked="${() => this.addPartner()}"
        @close="${this.onClose}"
      >
        <div class="container layout vertical">
          <etools-dropdown
            .selected="${simplifyValue(this.partner)}"
            .options="${this.partners}"
            @etools-selected-item-changed="${({detail}: CustomEvent) => this.selectPartner(detail.selectedItem)}"
            trigger-value-change-event
            label="${translate('ACTIVITY_DETAILS.PARTNER')}"
            horizontal-align="left"
            no-dynamic-align
            option-label="name"
            option-value="id"
          ></etools-dropdown>
        </div>
      </etools-dialog>
    `;
  }
}
