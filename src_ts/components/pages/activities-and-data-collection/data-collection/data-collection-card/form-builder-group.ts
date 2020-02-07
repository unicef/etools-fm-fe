import {customElement, LitElement, property, TemplateResult, html, CSSResultArray, css} from 'lit-element';
import './finding-types/text-field';
import './finding-types/number-field';
import './finding-types/scale-field';
import '@polymer/paper-input/paper-textarea';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {buttonsStyles} from '../../../../styles/button-styles';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {
  BOOL_TYPE,
  NUMBER_FLOAT_TYPE,
  NUMBER_INTEGER_TYPE,
  NUMBER_TYPE,
  SCALE_TYPE,
  TEXT_TYPE
} from '../../../../common/dropdown-options';
import {clone} from 'ramda';
import {FormBuilderCardStyles} from './form-builder-card.styles';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {IFormBuilderAbstractGroup} from '../../../../../types/form-builder.interfaces';
import {InputStyles} from '../../../../styles/input-styles';

export enum StructureTypes {
  WIDE = 'wide',
  ADDITIONAL = 'additional',
  CARD = 'card',
  ABSTRACT = 'abstract',
  COLLAPSED = 'collapse',
  ATTACHMENTS_BUTTON = 'floating_attachments'
}

@customElement('form-builder-group')
export class FormBuilderGroup extends LitElement implements IFormBuilderAbstractGroup {
  @property() groupStructure!: BlueprintGroup;
  @property() set groupValue(value: GenericObject) {
    this.originalValue = value;
    this.value = clone(value);
  }
  @property() metadata!: BlueprintMetadata;
  @property() parentGroupName: string = '';
  @property() isEditMode: boolean = false;
  @property({type: Boolean, attribute: 'readonly', reflect: true}) readonly: boolean = true;

  protected originalValue: GenericObject = {};
  protected value: GenericObject = {};

  render(): TemplateResult {
    if (!this.groupStructure || !this.metadata) {
      return html``;
    }

    return html`
      ${InputStyles}
      ${this.groupStructure.children.map((child: BlueprintGroup | BlueprintField) => this.renderChild(child))}
    `;
  }

  renderChild(child: BlueprintGroup | BlueprintField): TemplateResult {
    const type: string = child.type;
    switch (child.type) {
      case 'field':
        return this.renderField(child);
      case 'group':
        return this.renderGroup(child);
      default:
        console.warn(`FormBuilderGroup: Unknown group type ${type}. Please, specify rendering method`);
        return html``;
    }
  }

  renderField(blueprintField: BlueprintField): TemplateResult {
    const isWide: boolean = blueprintField.styling.includes(StructureTypes.WIDE);
    const isAdditional: boolean = blueprintField.styling.includes(StructureTypes.ADDITIONAL);
    if (isWide) {
      return html`
        <div class="${isAdditional ? 'additional-field' : ''}">
          ${this.renderWideField(blueprintField)}
        </div>
      `;
    } else {
      return html`
        <div class="${isAdditional ? 'additional-field finding-container' : 'finding-container'}">
          ${this.renderStandardField(blueprintField)}
        </div>
      `;
    }
  }

  renderWideField({name, label, placeholder, required}: BlueprintField): TemplateResult {
    return html`
      <paper-input
        class="wide-input disabled-as-readonly"
        always-float-label
        .value="${this.value[name]}"
        label="${label}"
        placeholder="${placeholder}"
        ?required="${required}"
        ?disabled="${!this.isEditMode || this.readonly}"
        @value-changed="${(event: CustomEvent) => this.valueChanged(event, name)}"
      >
      </paper-input>
    `;
  }

  renderStandardField({input_type, name, label, help_text, options_key}: BlueprintField): TemplateResult {
    switch (input_type) {
      case TEXT_TYPE:
        return html`
          <text-field
            ?is-readonly="${!this.isEditMode || this.readonly}"
            .value="${this.value[name]}"
            @value-changed="${(event: CustomEvent) => this.valueChanged(event, name)}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </text-field>
        `;
      case NUMBER_INTEGER_TYPE:
      case NUMBER_FLOAT_TYPE:
      case NUMBER_TYPE:
        return html`
          <number-field
            ?is-readonly="${!this.isEditMode || this.readonly}"
            .value="${this.value[name]}"
            @value-changed="${(event: CustomEvent) => this.valueChanged(event, name)}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </number-field>
        `;
      case BOOL_TYPE:
      case SCALE_TYPE:
        return html`
          <scale-field
            .options="${this.metadata.options[options_key || '']?.values || []}"
            ?is-readonly="${!this.isEditMode || this.readonly}"
            .value="${this.value[name]}"
            @value-changed="${(event: CustomEvent) => this.valueChanged(event, name)}"
          >
            ${this.renderFieldLabel(label, help_text)}
          </scale-field>
        `;
      default:
        console.warn(`FormBuilderGroup: Unknown field type: ${input_type}`);
        return html``;
    }
  }

  renderFieldLabel(label: string, helperText: string): TemplateResult {
    return html`
      <div class="layout vertical question-container">
        <div class="question-text">${label}</div>
        <div class="question-details">${helperText}</div>
      </div>
    `;
  }

  renderGroup(groupStructure: BlueprintGroup): TemplateResult {
    const isAbstract: boolean = groupStructure.styling.includes(StructureTypes.ABSTRACT);
    const isCard: boolean = groupStructure.styling.includes(StructureTypes.CARD);
    const isCollapsed: boolean = groupStructure.styling.includes(StructureTypes.COLLAPSED);
    if (isAbstract) {
      return html`
        <form-builder-group
          .groupStructure="${groupStructure}"
          .groupValue="${this.value[groupStructure.name]}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .isEditMode="${this.isEditMode}"
          .readonly="${this.readonly}"
          @value-changed="${(event: CustomEvent) => this.valueChanged(event, groupStructure.name)}"
        ></form-builder-group>
      `;
    } else if (isCard && isCollapsed) {
      return html`
        <form-builder-collapsed-card
          .groupStructure="${groupStructure}"
          .groupValue="${this.value[groupStructure.name]}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .readonly="${this.readonly}"
          @value-changed="${(event: CustomEvent) => this.valueChanged(event, groupStructure.name)}"
        ></form-builder-collapsed-card>
      `;
    } else if (isCard) {
      return html`
        <form-builder-card
          .groupStructure="${groupStructure}"
          .groupValue="${this.value[groupStructure.name]}"
          .metadata="${this.metadata}"
          .parentGroupName="${this.groupStructure.name}"
          .readonly="${this.readonly}"
          @value-changed="${(event: CustomEvent) => this.valueChanged(event, groupStructure.name)}"
        ></form-builder-card>
      `;
    } else {
      console.warn(`FormBuilderGroup: Unknown group type: ${groupStructure.styling}`);
      return html``;
    }
  }

  valueChanged(event: CustomEvent, name: string): void {
    this.value[name] = event.detail.value;
    event.stopPropagation();
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

        .information-source {
          padding: 0.5% 2% 0.5% 1%;
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
