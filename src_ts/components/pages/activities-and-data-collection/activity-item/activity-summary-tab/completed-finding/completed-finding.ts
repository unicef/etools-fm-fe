import {css, LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import {updateAppLocation} from '../../../../../../routing/routes';
import {ACTIVITIES_PAGE, DATA_COLLECTION_PAGE} from '../../../activities-page';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';

@customElement('completed-finding')
export class CompletedFindingComponent extends LitElement {
  @property() completedFinding!: CompletedFinding | CompletedOverallFinding;
  @property() completedFindingTitle = '';
  @property() completedFindingMethod = '';
  @property() activityId: number | null = null;
  @property({type: Boolean, attribute: 'show-copy-arrow'}) showCopyArrow = false;

  render(): TemplateResult {
    return html`
      <div class="completed-finding__content" @click="${() => this.goToDataCollection()}">
        <label class="method-name-label">${this.completedFindingMethod}</label>
        <label class="author-label">
          ${this.completedFinding.author.first_name[0]}${this.completedFinding.author.last_name[0]}
        </label>
        ${this.completedFindingTitle.toString().length < 4
          ? html` <label class="completed-finding-title">${this.completedFindingTitle}</label> `
          : html`
              <label class="completed-finding-title shorted-title">
                <sl-tooltip placement="right" offset="5" content="${this.completedFindingTitle}">
                  <span id="ellipsis">...</span>
                </sl-tooltip>
              </label>
            `}
        ${this.showCopyArrow
          ? html`<sl-tooltip placement="right" offset="5" content="Click to copy answer">
              <etools-icon name="arrow-forward" @click="${this.copyAnswer}" id="icon"></etools-icon>
            </sl-tooltip>`
          : ''}
      </div>
    `;
  }

  goToDataCollection(): void {
    /* eslint-disable max-len */
    updateAppLocation(
      `${Environment.basePath}${ACTIVITIES_PAGE}/${this.activityId}/${DATA_COLLECTION_PAGE}/${this.completedFinding.checklist}/`
    );
    /* eslint-enable max-len */
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
        etools-icon {
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
