import {css, LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {translate} from 'lit-translate';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import {buttonsStyles} from '@unicef-polymer/etools-unicef/src/styles/button-styles';

@customElement('entries-list')
export class EntriesList extends LitElement {
  @property({type: Boolean, attribute: 'is-readonly'}) isReadonly = true;
  @property() nameList = '';
  @property() items: [] = [];
  @property() formatItem!: (item: any) => void;

  static get styles(): CSSResultArray {
    // language=CSS
    return [buttonsStyles, css`
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
    `];
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
            this.items || [],
            (item: any) => html`
              <div class="entries-item">
                ${this.formatItem(item)}
                ${!this.isReadonly
                  ? html`
                      <div class="hover-block" @click="${() => this.removeEntry(item.id)}">
                        <etools-icon name="delete"></etools-icon>
                      </div>
                    `
                  : ''}
              </div>
            `
          )}
          ${!this.isReadonly
            ? html`
                <sl-button variant="primary" class="add-entry" @click="${() => this.addEntry()}">
                  <etools-icon name="add" slot="prefix"></etools-icon>${translate('ACTIVITY_DETAILS.ADD_ENTRY')}
                </sl-button>
              `
            : ''}
        </div>
      </div>
    `;
  }
}
