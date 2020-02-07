import {css, CSSResultArray, html, LitElement, property, TemplateResult} from 'lit-element';
import {fireEvent} from '../../../../../utils/fire-custom-event';
import {FlexLayoutClasses} from '../../../../../styles/flex-layout-classes';
import {InputStyles} from '../../../../../styles/input-styles';

export abstract class BaseField<T> extends LitElement {
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
          display: flex;
        }
        .flex-wrapping {
          flex-wrap: wrap;
        }

        .question-control,
        .question {
          min-height: 48px;
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
