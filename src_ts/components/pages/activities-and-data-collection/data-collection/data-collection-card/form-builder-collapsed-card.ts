import {customElement, TemplateResult, html, CSSResultArray, css} from 'lit-element';
import './finding-types/text-field';
import './finding-types/number-field';
import './finding-types/scale-field';
import {FormBuilderGroup, StructureTypes} from './form-builder-group';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {FormBuilderCardStyles} from './form-builder-card.styles';
import {get, translate} from 'lit-translate';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {buttonsStyles} from '../../../../styles/button-styles';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {clone} from 'ramda';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {IFormBuilderCollapsedCard} from '../../../../../types/form-builder.interfaces';
import {InputStyles} from '../../../../styles/input-styles';
import {openDialog} from '../../../../utils/dialog';
import '../../../../common/layout/etools-card';

const PARTNER_KEY: string = 'partner';
const OUTPUT_KEY: string = 'output';
const INTERVENTION_KEY: string = 'intervention';

@customElement('form-builder-collapsed-card')
export class FormBuilderCollapsedCard extends FormBuilderGroup implements IFormBuilderCollapsedCard {
  render(): TemplateResult {
    return html`
      ${InputStyles}
      <section class="elevation page-content card-container" elevation="1">
        <etools-card
          card-title="${this.retrieveTitle(this.parentGroupName) + ': ' + this.groupStructure.title}"
          is-collapsible
          ?is-editable="${!this.readonly}"
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

  renderGroupChildren(): TemplateResult[] {
    return this.groupStructure.children
      .filter(({styling}: BlueprintGroup | BlueprintField) => !styling.includes(StructureTypes.ATTACHMENTS_BUTTON))
      .map((child: BlueprintGroup | BlueprintField) => super.renderChild(child));
  }

  cancelEdit(): void {
    this.value = clone(this.originalValue);
    this.isEditMode = false;
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
      readonly: this.readonly
    }).then((response: GenericObject) => {
      if (!response.confirmed) {
        return;
      }
      this.value.attachments = response.attachments;
      if (this.isEditMode) {
        const tmp: GenericObject = clone(this.originalValue);
        tmp.attachments = response.attachments;
        fireEvent(this, 'value-changed', this.value);
      } else {
        this.saveChanges();
      }
    });
  }

  valueChanged(event: CustomEvent, name: string): void {
    this.value[name] = event.detail.value;
    event.stopPropagation();
  }

  saveChanges(): void {
    this.isEditMode = false;
    fireEvent(this, 'value-changed', {value: this.value});
  }

  startEdit(): void {
    if (this.readonly) {
      return;
    }
    this.isEditMode = true;
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

  /**
   * Open Attachments popup button. Is Hidden if OverallInfo property is null or if tab is readonly and no attachments uploaded
   */
  protected getAdditionalButtons(): TemplateResult {
    const showAttachmentsButton:
      | BlueprintGroup
      | undefined = this.groupStructure.children.find(({styling}: BlueprintGroup | BlueprintField) =>
      styling.includes(StructureTypes.ATTACHMENTS_BUTTON)
    ) as BlueprintGroup | undefined;
    return showAttachmentsButton
      ? html`
          <paper-button @click="${() => this.openAttachmentsPopup()}" class="attachments-button">
            <iron-icon icon="${this.value.attachments.length ? 'file-download' : 'file-upload'}"></iron-icon>
            ${this.getAttachmentsBtnText(this.value.attachments.length)}
          </paper-button>
        `
      : html``;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      pageLayoutStyles,
      buttonsStyles,
      elevationStyles,
      CardStyles,
      FlexLayoutClasses,
      FormBuilderCardStyles,
      css`
        .save-button {
          color: var(--primary-background-color);
          background-color: var(--primary-color);
        }

        .additional-field {
          padding-top: 15px;
          padding-bottom: 20px;
          background-color: var(--secondary-background-color);
        }

        .wide-input {
          display: block;
          width: 100%;
          padding: 0 25px 0 45px;
          box-sizing: border-box;
        }
      `
    ];
  }
}
