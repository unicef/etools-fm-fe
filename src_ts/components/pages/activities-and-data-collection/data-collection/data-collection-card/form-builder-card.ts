import {customElement, TemplateResult, html, CSSResultArray, css, property, LitElement} from 'lit-element';
import './finding-types/text-field';
import './finding-types/number-field';
import './finding-types/scale-field';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {FormBuilderCardStyles} from './form-builder-card.styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {buttonsStyles} from '../../../../styles/button-styles';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {IFormBuilderCard} from '../../../../../types/form-builder.interfaces';
import {translate} from 'lit-translate';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {clone, equals} from 'ramda';
import {InputStyles} from '../../../../styles/input-styles';

@customElement('form-builder-card')
export class FormBuilderCard extends LitElement implements IFormBuilderCard {
  @property() cardInvalid: boolean = false;
  @property() groupStructure!: BlueprintGroup;
  @property() set groupValue(value: GenericObject) {
    this.originalValue = value;
    this.value = clone(value);
  }
  @property() metadata!: BlueprintMetadata;
  @property() parentGroupName: string = '';
  @property() showSaveButton: boolean = false;
  @property() readonly: boolean = true;

  protected originalValue: GenericObject = {};
  protected value: GenericObject = {};

  render(): TemplateResult {
    return html`
      ${InputStyles}
      <section class="elevation page-content card-container" elevation="1">
        <form-builder-group
          .groupStructure="${this.groupStructure}"
          .groupValue="${this.value}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.parentGroupName}"
          .readonly="${this.readonly}"
          .isEditMode="${true}"
          @value-changed="${(event: CustomEvent) => this.cardValueChanged(event)}"
        ></form-builder-group>
        <iron-collapse ?opened="${this.showSaveButton && !this.cardInvalid}">
          <div class="layout horizontal end-justified card-buttons actions-container">
            <paper-button class="save-button" @tap="${() => this.saveChanges()}"
              >${translate('MAIN.BUTTONS.SAVE')}</paper-button
            >
          </div>
        </iron-collapse>
      </section>
    `;
  }

  cardValueChanged(event: CustomEvent): void {
    this.value = event.detail.value;
    event.stopPropagation();
    this.showSaveButton = !equals(this.value, this.originalValue);
  }

  saveChanges(): void {
    fireEvent(this, 'value-changed', {value: this.value});
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      SharedStyles,
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

        .actions-container {
          padding: 0 25px 5px 45px;
          box-sizing: border-box;
        }
      `
    ];
  }
}
