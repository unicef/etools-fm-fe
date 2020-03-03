import {customElement, TemplateResult, html, property} from 'lit-element';
import {translate} from 'lit-translate';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {clone, equals} from 'ramda';
import {IFormBuilderCard} from '../../../../../types/form-builder.interfaces';
import {FormBuilderGroup} from './form-builder-group';

@customElement('form-builder-card')
export class FormBuilderCard extends FormBuilderGroup implements IFormBuilderCard {
  /**
   * Show save button only if value was changed by user
   */
  @property() private showSaveButton: boolean = false;

  /**
   * Overrides value property. Saves originalValue.
   * We need to update inner _value only if it wasn't change
   * @param value
   */
  set value(value: GenericObject) {
    if (this.showSaveButton) {
      this._value = clone(value);
    }
    this.originalValue = value;
  }
  get value(): GenericObject {
    return this._value;
  }
  @property() private _value: GenericObject = {};
  private originalValue: GenericObject = {};

  /**
   * Extends parent render method,
   * adds card-container html wrapper and dynamic save button
   */
  render(): TemplateResult {
    return html`
      <section class="elevation page-content card-container form-card" elevation="1">
        ${super.render()}

        <iron-collapse ?opened="${this.showSaveButton}">
          <div class="layout horizontal end-justified card-buttons actions-container">
            <paper-button class="save-button" @tap="${() => this.saveChanges()}"
              >${translate('MAIN.BUTTONS.SAVE')}</paper-button
            >
          </div>
        </iron-collapse>
      </section>
    `;
  }

  /**
   * Updates value property, stops event propagation.
   * We need to fire value-changed event only after save button click
   */
  valueChanged(event: CustomEvent, name: string): void {
    this._value[name] = event.detail.value;
    event.stopPropagation();
    this.showSaveButton = !equals(this.value, this.originalValue);
  }

  saveChanges(): void {
    if (Object.keys(this._errors).length) {
      fireEvent(this, 'toast', {text: 'Please check all fields and try again'});
      return;
    }
    fireEvent(this, 'value-changed', {value: this.value});
    this.showSaveButton = false;
  }
}
