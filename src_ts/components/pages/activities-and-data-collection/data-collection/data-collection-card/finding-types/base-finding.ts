import {css, CSSResultArray, html, LitElement, property, TemplateResult} from 'lit-element';
import {fireEvent} from '../../../../../utils/fire-custom-event';
import {FlexLayoutClasses} from '../../../../../styles/flex-layout-classes';
import {InputStyles} from '../../../../../styles/input-styles';

export abstract class BaseFinding<T> extends LitElement {
  @property({type: String}) questionText: string = '';
  @property({type: Boolean, attribute: 'is-readonly'}) isReadonly: boolean = false;
  @property() value: T | null = null;

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

      <div class="finding-container layout horizontal start center-justified">
        <div class="question flex-2 layout horizontal center">${this.questionTemplate()}</div>
        <div class="question-control flex-3 layout horizontal center">${this.controlTemplate()}</div>
      </div>
    `;
  }

  protected questionTemplate(): TemplateResult {
    return html`
      <span class="question-text">${this.questionText}</span>
    `;
  }

  protected valueChanged(newValue: T): void {
    if (newValue !== this.value) {
      this.value = newValue;
      fireEvent(this, 'value-changed', {value: newValue});
    }
  }

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
          min-height: 48px;
        }

        .question-control,
        .question {
          min-height: 48px;
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
      `
    ];
  }
}
