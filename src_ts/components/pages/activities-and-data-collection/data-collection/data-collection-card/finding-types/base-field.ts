import {css, CSSResultArray, html, LitElement, property, TemplateResult} from 'lit-element';
import {fireEvent} from '../../../../../utils/fire-custom-event';
import {FlexLayoutClasses} from '../../../../../styles/flex-layout-classes';
import {InputStyles} from '../../../../../styles/input-styles';
import {FieldValidator, validate} from '../../../../../utils/validations.helper';

export abstract class BaseField<T> extends LitElement {
  @property({type: String}) questionText: string = '';
  @property({type: Boolean, attribute: 'is-readonly'}) isReadonly: boolean = false;
  @property({type: Boolean, attribute: 'required', reflect: true}) required: boolean = false;
  @property() value: T | null = null;
  validators: FieldValidator[] = [];
  set errorMessage(message: string | null) {
    this._errorMessage = message;
  }
  get errorMessage(): string | null {
    return this.isReadonly ? null : this._errorMessage;
  }

  @property() protected _errorMessage: string | null = null;

  protected render(): TemplateResult {
    return html`
      ${InputStyles}
      <style>
        paper-textarea {
          --paper-input-container-input: {
            font-size: 13px;
          }
        }
        paper-input {
          --paper-input-container-shared-input-style: {
            font-size: 13px;
            width: 100%;
          }
        }
      </style>

      <div class="finding-container">
        <div class="question"><slot>${this.questionTemplate()}</slot></div>
        <div class="question-control">${this.controlTemplate()}</div>
      </div>
    `;
  }

  protected questionTemplate(): TemplateResult {
    return html`
      <span class="question-text">${this.questionText}</span>
    `;
  }

  protected valueChanged(newValue: T): void {
    this.validateField(newValue);
    if (newValue !== this.value) {
      this.value = newValue;
      fireEvent(this, 'value-changed', {value: newValue});
    }
  }

  protected validateField(value: T): void {
    let errorMessage: string | null;
    if (this.required && !value) {
      errorMessage = 'This field is required!';
    } else {
      errorMessage = this.metaValidation(value);
    }
    if (this._errorMessage !== errorMessage) {
      fireEvent(this, 'error-changed', {error: errorMessage});
      this._errorMessage = errorMessage;
    }
  }

  protected metaValidation(value: T): string | null {
    const message: string | null = validate(this.validators, value);
    return message ? message : this.customValidation(value);
  }

  protected abstract customValidation(value: T): string | null;

  protected abstract controlTemplate(): TemplateResult;

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      FlexLayoutClasses,
      css`
        :host {
          display: block;
          width: 100%;
          padding: 0 25px 0 45px;
          box-sizing: border-box;
        }

        .finding-container {
          width: 100%;
          display: flex;
        }
        .flex-wrapping {
          flex-wrap: wrap;
        }

        .question-control,
        .question {
          min-height: 57px;
          display: flex;
          align-items: center;
        }
        .question {
          flex: 2;
        }
        .question-control {
          flex: 3;
        }

        paper-input,
        paper-textarea {
          width: 100%;
        }

        .question-text {
          font-weight: 500;
          font-size: 13px;
          color: var(--primary-text-color);
        }

        @media (max-width: 1080px) {
          :host {
            padding: 0 15px;
          }
          .finding-container {
            flex-direction: column;
          }
          .question,
          .question-control {
            flex: 0 1 auto;
          }
        }
      `
    ];
  }
}
