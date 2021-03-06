import {css, CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import {fireEvent} from '../../../../../../../utils/fire-custom-event';
import {translate} from 'lit-translate';

@customElement('entries-list')
export class EntriesList extends LitElement {
  @property({type: Boolean, attribute: 'is-readonly'}) isReadonly = true;
  @property() nameList = '';
  @property() items: [] = [];
  @property() formatItem!: (item: any) => void;

  static get styles(): CSSResult {
    // language=CSS
    return css`
      :host {
        flex: 1;
        overflow: hidden;
      }
      .entries-container {
        border: 1px solid #e0e0e0;
        overflow: hidden;
      }
      .entries-header,
      .entries-item,
      .add-entry {
        display: flex;
        align-items: center;
        padding: 14px 25px;
        box-shadow: inset 0 -1px 0 var(--light-divider-color);
      }
      .entries-header {
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
        background-color: var(--secondary-background-color);
      }
      .entries-item {
        display: block;
        position: relative;
      }
      .entries-item,
      .add-entry {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }
      .add-entry:hover,
      .entries-item:hover {
        background-color: var(--secondary-background-color);
      }
      :host([is-readonly]) .entries-item {
        cursor: default;
        pointer-events: none;
      }
      :host([is-readonly]) .entries-item:hover {
        background-color: var(--primary-background-color);
      }
      .hover-block {
        display: none;
        position: absolute;
        right: 10px;
        top: 15px;
        color: var(--secondary-text-color);
      }
      .entries-item:hover > .hover-block {
        display: block;
      }
      .add-entry {
        justify-content: flex-start;
        padding: 14px 25px 14px 18px;
        color: var(--primary-color);
        background: var(--primary-background-color);
        border: none;
        box-shadow: none;
        margin: 0;
        text-transform: uppercase;
      }
    `;
  }

  addEntry(): void {
    fireEvent(this, 'add-entry');
  }

  removeEntry(id: number): void {
    fireEvent(this, 'remove-entry', {id});
  }

  // language=HTML
  render(): TemplateResult {
    return html`
      <div class="entries-container">
        <div class="entries-header">${this.nameList}</div>
        <div>
          ${repeat(
            this.items,
            (item: any) => html`
              <div class="entries-item">
                ${this.formatItem(item)}
                ${!this.isReadonly
                  ? html`
                      <div class="hover-block" @click="${() => this.removeEntry(item.id)}">
                        <iron-icon icon="icons:delete"></iron-icon>
                      </div>
                    `
                  : ''}
              </div>
            `
          )}
          ${!this.isReadonly
            ? html`
                <paper-button class="add-entry" @click="${() => this.addEntry()}">
                  <iron-icon icon="add"></iron-icon>${translate('ACTIVITY_DETAILS.ADD_ENTRY')}
                </paper-button>
              `
            : ''}
        </div>
      </div>
    `;
  }
}
