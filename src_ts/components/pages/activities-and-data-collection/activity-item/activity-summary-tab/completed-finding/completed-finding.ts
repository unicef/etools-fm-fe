import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import '@polymer/paper-tooltip';
import {updateAppLocation} from '../../../../../../routing/routes';
import {ROOT_PATH} from '../../../../../../config/config';
import {ACTIVITIES_PAGE, DATA_COLLECTION_PAGE} from '../../../activities-page';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

@customElement('completed-finding')
export class CompletedFindingComponent extends LitElement {
  @property() completedFinding!: CompletedFinding | CompletedOverallFinding;
  @property() completedFindingTitle = '';
  @property() completedFindingMethod = '';
  @property() activityId: number | null = null;
  @property({type: Boolean, attribute: 'show-copy-arrow'}) showCopyArrow = false;

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
      <div class="completed-finding__content" @click="${() => this.goToDataCollection()}">
        <label class="method-name-label">${this.completedFindingMethod}</label>
        <label class="author-label">
          ${this.completedFinding.author.first_name[0]}${this.completedFinding.author.last_name[0]}
        </label>
        ${this.completedFindingTitle.toString().length < 4
          ? html` <label class="completed-finding-title">${this.completedFindingTitle}</label> `
          : html`
              <label class="completed-finding-title shorted-title">
                <span id="ellipsis">...</span>
                <paper-tooltip position="right" offset="5" for="ellipsis">
                  <div>${this.completedFindingTitle}</div>
                </paper-tooltip>
              </label>
            `}
        ${this.showCopyArrow
          ? html`<iron-icon icon="arrow-forward" @click="${this.copyAnswer}" id="icon"></iron-icon>
              <paper-tooltip position="right" offset="5" for="icon">
                <div>Click to copy answer</div>
              </paper-tooltip>`
          : ''}
      </div>
    `;
  }

  goToDataCollection(): void {
    updateAppLocation(
      `${ROOT_PATH}${ACTIVITIES_PAGE}/${this.activityId}/${DATA_COLLECTION_PAGE}/${this.completedFinding.checklist}/`
    );
  }

  copyAnswer(event: MouseEvent): void {
    event.stopPropagation();
    fireEvent(this, 'copy-answer');
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      css`
        :host([show-copy-arrow]) .completed-finding__content {
          width: 146px;
        }
        iron-icon {
          margin-right: 3px;
        }
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

        .completed-finding__content > *,
        .completed-finding__content:hover {
          cursor: pointer;
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
