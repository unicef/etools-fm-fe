import {css, CSSResultArray, html, LitElement, property, TemplateResult} from 'lit-element';
import {fireEvent} from '../../../../../utils/fire-custom-event';
import {FlexLayoutClasses} from '../../../../../styles/flex-layout-classes';
import {InputStyles} from '../../../../../styles/input-styles';

export abstract class BaseFinding<T> extends LitElement {
  @property({type: String}) questionText: string = '';
  @property({type: Boolean}) isReadonly: boolean = false;
  @property() value: T | null = null;

  protected render(): TemplateResult {
    return html`
      ${InputStyles}
      <style>
        paper-input {
          --paper-input-container-shared-input-style: {
            font-size: 13px;
          }
        }
      </style>

      <div class="finding-container layout horizontal start-justified center">
        <div class="question flex-2">${this.questionTemplate()}</div>
        <div class="question-control flex-3">${this.controlTemplate()}</div>
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

        .question-text {
          font-weight: 500;
          font-size: 13px;
          color: var(--primary-text-color);
        }
      `
    ];
  }
}
