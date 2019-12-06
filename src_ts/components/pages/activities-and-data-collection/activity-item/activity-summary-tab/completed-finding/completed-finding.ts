import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {MethodsMixin} from '../../../../../common/mixins/methods-mixin';

@customElement('completed-finding')
export class CompletedFindingComponent extends MethodsMixin(LitElement) {
  @property() completedFinding!: CompletedFinding | CompletedOverallFinding;
  @property() completedFindingTitle: string = '';

  render(): TemplateResult {
    return html`
      <div class="completed-finding">
        <div title="${this.completedFindingTitle}">
          <label class="method-name-label">${this.getMethodName(this.completedFinding.method, true)}</label>
          <label class="author-label">
            ${this.completedFinding.author.first_name[0]}${this.completedFinding.author.last_name[0]}
          </label>
          <label class="title-label">
            ${this.completedFindingTitle.toString().length < 4 ? this.completedFindingTitle : '...'}
          </label>
        </div>
      </div>
    `;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      css`
        .completed-finding {
          width: 50%;
        }
        .completed-finding div {
          position: relative;
          width: 120px;
          height: 48px;
          margin: 12px 0;
          background-color: var(--gray-light-background);
          line-height: 48px;
          display: flex;
          justify-content: center;
        }

        .method-name-label {
          width: 34px;
          text-align: center;
        }

        .author-label {
          width: 34px;
          text-align: center;
          border-left: 1px solid lightgray;
          border-right: 1px solid lightgray;
        }

        .title-label {
          width: 52px;
          text-align: center;
        }
      `
    ];
  }
}
