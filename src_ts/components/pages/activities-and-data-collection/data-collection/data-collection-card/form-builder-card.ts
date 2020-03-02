import {customElement, TemplateResult, html, property} from 'lit-element';
import {translate} from 'lit-translate';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {clone, equals} from 'ramda';
import {IFormBuilderCard} from '../../../../../types/form-builder.interfaces';
import {FormBuilderGroup} from './form-builder-group';

@customElement('form-builder-card')
export class FormBuilderCard extends FormBuilderGroup implements IFormBuilderCard {
  @property() showSaveButton: boolean = false;

  set groupValue(value: GenericObject) {
    if (equals(this.value, this.originalValue)) {
      this.value = clone(value);
    }
    this.originalValue = value;
  }

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

  valueChanged(event: CustomEvent, name: string): void {
    this.value[name] = event.detail.value;
    event.stopPropagation();
    this.showSaveButton = !equals(this.value, this.originalValue);
  }

  saveChanges(): void {
    if (Object.keys(this.errors).length) {
      fireEvent(this, 'toast', {text: 'Please check all fields and try again'});
      return;
    }
    fireEvent(this, 'value-changed', {value: this.value});
    this.showSaveButton = false;
  }
}
