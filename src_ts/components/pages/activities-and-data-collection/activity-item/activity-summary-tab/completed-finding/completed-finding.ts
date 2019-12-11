import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import '@polymer/paper-tooltip';

@customElement('completed-finding')
export class CompletedFindingComponent extends LitElement {
  @property() completedFinding!: CompletedFinding | CompletedOverallFinding;
  @property() completedFindingTitle: string = '';
  @property() completedFindingMethod: string = '';

  render(): TemplateResult {
    return html`
      <style>
        paper-tooltip {
          --paper-tooltip-background: white;
          --paper-tooltip-text-color: black;
          --paper-tooltip-opacity: 1;
          --paper-tooltip-delay-in: 0ms;
          --paper-tooltip-duration-in: 0ms;
          --paper-tooltip: {
            font-size: 13px;
            box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px,
              rgba(0, 0, 0, 0.2) 0px 3px 1px -2px;
            width: max-content;
            max-width: 600px;
            text-align: left;
          }
        }
      </style>
      <div class="completed-finding__content">
        <label class="method-name-label">${this.completedFindingMethod}</label>
        <label class="author-label">
          ${this.completedFinding.author.first_name[0]}${this.completedFinding.author.last_name[0]}
        </label>
        ${this.completedFindingTitle.toString().length < 4
          ? html`
              <label class="completed-finding-title">${this.completedFindingTitle}</label>
            `
          : html`
              <label class="completed-finding-title shorted-title">
                <span id="ellipsis">...</span>
                <paper-tooltip position="right" offset="5" for="ellipsis">
                  <div>${this.completedFindingTitle}</div>
                </paper-tooltip>
              </label>
            `}
      </div>
    `;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      css`
        .completed-finding__content {
          position: relative;
          width: 120px;
          height: 48px;
          margin: 12px 0;
          background-color: var(--gray-light-background);
          line-height: 28px;
          display: flex;
          justify-content: center;
          align-items: center;
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
          height: 28px;
        }

        .completed-finding-title {
          width: 52px;
          text-align: center;
          position: relative;
        }

        .shorted-title {
          display: flex;
          max-height: 10px;
          justify-content: center;
          align-content: center;
          line-height: 5px;
        }

        .shorted-title #ellipsis {
          cursor: pointer;
        }
      `
    ];
  }
}
