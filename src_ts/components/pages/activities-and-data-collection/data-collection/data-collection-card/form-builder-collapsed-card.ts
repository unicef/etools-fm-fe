import {customElement, TemplateResult, html, property} from 'lit-element';
import {clone} from 'ramda';
import {get, translate} from 'lit-translate';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {openDialog} from '../../../../utils/dialog';
import {IFormBuilderCard, IFormBuilderCollapsedCard} from '../../../../../types/form-builder.interfaces';
import {FormBuilderGroup, StructureTypes} from './form-builder-group';
import '../../../../common/layout/etools-card';

const PARTNER_KEY: string = 'partner';
const OUTPUT_KEY: string = 'output';
const INTERVENTION_KEY: string = 'intervention';

@customElement('form-builder-collapsed-card')
export class FormBuilderCollapsedCard extends FormBuilderGroup implements IFormBuilderCollapsedCard, IFormBuilderCard {
  set readonly(state: boolean) {
    this._readonly = state;
  }
  get readonly(): boolean {
    return this._readonly || this.isEditMode;
  }
  @property() private isEditMode: boolean = false;

  @property({type: Boolean, attribute: 'readonly', reflect: true}) private _readonly: boolean = true;

  set errors(errors: GenericObject | string[] | null) {
    if (Array.isArray(errors)) {
      fireEvent(this, 'toast', {text: errors[0]});
      fireEvent(this, 'error-changed', {error: null});
    } else if (errors) {
      this._errors = errors;
    }
    if (errors) {
      this.isEditMode = true;
    }
  }

  set groupValue(value: GenericObject) {
    this.originalValue = value;
    if (!this.isEditMode) {
      this.value = clone(value);
    }
  }

  render(): TemplateResult {
    return html`
      ${this.renderInlineStyles()}
      <section class="elevation page-content card-container" elevation="1">
        <etools-card
          card-title="${this.retrieveTitle(this.parentGroupName) + ': ' + this.groupStructure.title}"
          is-collapsible
          ?is-editable="${!this._readonly}"
          ?edit="${this.isEditMode}"
          @start-edit="${() => this.startEdit()}"
          @save="${() => this.saveChanges()}"
          @cancel="${() => this.cancelEdit()}"
        >
          <!-- Open Attachments popup button -->
          <div slot="actions" class="layout horizontal center">
            ${this.getAdditionalButtons()}
          </div>
          <div slot="content">
            ${this.renderGroupChildren()}
          </div>
        </etools-card>
      </section>
    `;
  }

  renderGroupChildren(): TemplateResult[] {
    return this.groupStructure.children
      .filter(({styling}: BlueprintGroup | BlueprintField) => !styling.includes(StructureTypes.ATTACHMENTS_BUTTON))
      .map((child: BlueprintGroup | BlueprintField) => super.renderChild(child));
  }

  /**
   * Generate open Attachments popup button.
   * It is hidden if tab is readonly and no attachments uploaded
   */
  getAdditionalButtons(): TemplateResult {
    const showAttachmentsButton: boolean = this.groupStructure.children.some(
      ({styling}: BlueprintGroup | BlueprintField) => styling.includes(StructureTypes.ATTACHMENTS_BUTTON)
    );
    return showAttachmentsButton
      ? html`
          <paper-button @click="${() => this.openAttachmentsPopup()}" class="attachments-button">
            <iron-icon icon="${this.value.attachments.length ? 'file-download' : 'file-upload'}"></iron-icon>
            ${this.getAttachmentsBtnText(this.value.attachments.length)}
          </paper-button>
        `
      : html``;
  }

  retrieveTitle(target: string): string {
    switch (target) {
      case PARTNER_KEY:
        return `${get('LEVELS_OPTIONS.PARTNER')}`;
      case OUTPUT_KEY:
        return `${get('LEVELS_OPTIONS.OUTPUT')}`;
      case INTERVENTION_KEY:
        return `${get('LEVELS_OPTIONS.INTERVENTION')}`;
      default:
        return '';
    }
  }

  startEdit(): void {
    if (this._readonly) {
      return;
    }
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.requestUpdate().then(() => {
      this.value = clone(this.originalValue);
      this.isEditMode = false;
    });
  }

  valueChanged(event: CustomEvent, name: string): void {
    event.stopPropagation();
    if (this.value[name] !== event.detail.value) {
      this.value[name] = event.detail.value;
    }
  }

  saveChanges(): void {
    if (Object.keys(this._errors).length) {
      fireEvent(this, 'toast', {text: 'Please check all fields and try again'});
      return;
    }
    this.isEditMode = false;
    fireEvent(this, 'value-changed', {value: this.value});
  }

  openAttachmentsPopup(): void {
    openDialog<FormBuilderAttachmentsPopupData>({
      dialog: 'checklist-attachments-popup',
      dialogData: {
        attachments: this.value.attachments,
        metadata: this.metadata,
        title: `${get('ACTIVITY_ITEM.DATA_COLLECTION.ATTACHMENTS_POPUP_TITLE')} ${this.retrieveTitle(
          this.parentGroupName
        ) +
          ': ' +
          this.groupStructure.title}`
      },
      readonly: this._readonly
    }).then((response: GenericObject) => {
      if (!response.confirmed) {
        return;
      }
      this.value.attachments = response.attachments;
      if (this.isEditMode) {
        const tmp: GenericObject = clone(this.originalValue);
        tmp.attachments = response.attachments;
        fireEvent(this, 'value-changed', {value: tmp});
      } else {
        this.saveChanges();
      }
    });
  }

  protected getAttachmentsBtnText(attachmentsCount: number): Callback {
    if (attachmentsCount === 1) {
      return translate('ACTIVITY_ITEM.DATA_COLLECTION.ATTACHMENTS_BUTTON_TEXT.SINGLE', {count: attachmentsCount});
    } else if (attachmentsCount > 1) {
      return translate('ACTIVITY_ITEM.DATA_COLLECTION.ATTACHMENTS_BUTTON_TEXT.MULTIPLE', {count: attachmentsCount});
    } else {
      return translate('ACTIVITY_ITEM.DATA_COLLECTION.ATTACHMENTS_BUTTON_TEXT.DEFAULT');
    }
  }
}
