import {html, LitElement, TemplateResult, CSSResultArray, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import '@unicef-polymer/etools-unicef/src/etools-collapse/etools-collapse';
import {CardStyles} from '../../styles/card-styles';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';

import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {translate} from 'lit-translate';
import {FormBuilderCardStyles} from '@unicef-polymer/etools-form-builder/dist/lib/styles/form-builder-card.styles';

@customElement('etools-card')
export class EtoolsCard extends LitElement {
  @property({attribute: 'card-title'})
  cardTitle!: string;

  @property({type: Boolean, attribute: 'is-editable'})
  isEditable = false;

  @property({type: Boolean, attribute: 'is-collapsible'})
  isCollapsible = false;

  @property({type: Boolean, attribute: 'hide-edit-button'})
  hideEditButton = false;

  @property({type: Boolean}) collapsed = false;
  @property({type: Boolean}) edit = false;

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      elevationStyles,
      CardStyles,
      layoutStyles,
      FormBuilderCardStyles,
      css`
        :host {
          display: block;
        }

        .card-container {
          background-color: var(--primary-background-color);
        }

        .card-title-box[is-collapsible] {
          padding-left: 17px;
          padding-right: 25px;
        }

        .card-content {
          padding: 0;
        }

        .card-buttons {
          padding: 12px 24px;
        }

        .save-button {
          color: var(--primary-background-color);
          background-color: var(--primary-color);
        }

        .edit-button {
          color: var(--gray-mid);
        }

        .edit-button[edit] {
          color: var(--primary-color);
        }

        .flex-header {
          display: flex;
          align-items: center;
          padding-top: auto;
          flex-wrap: nowrap;
        }
        .flex-header__collapse {
          flex-basis: auto;
        }
        .flex-header__title {
          font-size: var(--etools-font-size-18, 18px);
          flex-basis: auto;
          flex-grow: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .flex-header__actions {
          order: 1;
          width: auto;
          display: flex;
          flex-basis: auto;
        }
        .flex-header__edit {
          order: 2;
        }
        .end-justified {
          justify-content: end;
        }
        @media (max-width: 380px) {
          .card-title-box[is-collapsible] {
            padding-left: 0;
            padding-right: 0;
          }
          .flex-header {
            align-items: baseline;
            padding-top: 10px;
            flex-wrap: wrap;
          }
          .flex-header__collapse {
            flex-basis: 20%;
          }
          .flex-header__title {
            flex-basis: 60%;
            overflow: unset;
            white-space: unset;
            text-overflow: unset;
          }
          .flex-header__actions {
            order: 2;
            width: 100%;
            border-top: 1px solid lightgrey;
            justify-content: flex-end;
          }
          .flex-header__edit {
            order: 1;
            flex-basis: 20%;
          }
        }
      `
    ];
  }

  save(): void {
    fireEvent(this, 'save');
  }

  cancel(): void {
    this.edit = false;
    fireEvent(this, 'cancel');
  }

  startEdit(): void {
    if (this.edit) {
      return;
    }
    this.edit = true;
    fireEvent(this, 'start-edit');
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  // language=HTML
  protected render(): TemplateResult {
    return html`
      <div class="elevation card-container" elevation="1">
        <header class="card-title-box with-bottom-line flex-header" ?is-collapsible="${this.isCollapsible}">
          ${this.isCollapsible
            ? html`
                <etools-icon-button
                  class="flex-header__collapse"
                  @click="${() => this.toggleCollapse()}"
                  name="${this.collapsed ? 'expand-more' : 'expand-less'}"
                >
                </etools-icon-button>
              `
            : ''}
          <div class="flex-header__title">${this.cardTitle}</div>
          <div class="layout-horizontal align-items-center flex-header__edit">
            ${this.isEditable
              ? html`
                  <etools-icon-button
                    class="edit-button"
                    ?edit=${this.edit}
                    @click="${() => this.startEdit()}"
                    ?hidden="${this.hideEditButton}"
                    name="create"
                  >
                  </etools-icon-button>
                `
              : ''}
          </div>
          <div class="flex-header__actions"><slot name="actions"></slot></div>
        </header>
        <etools-collapse ?opened="${!this.collapsed}">
          <section class="card-content-block">
            <slot name="content"></slot>

            ${this.isEditable && this.edit
              ? html`
                  <div class="layout-horizontal end-justified card-buttons">
                    <etools-button variant="neutral" @click="${() => this.cancel()}"
                      >${translate('MAIN.BUTTONS.CANCEL')}</etools-button
                    >
                    <etools-button variant="primary" class="save-button" @click="${() => this.save()}">
                      ${translate('MAIN.BUTTONS.SAVE')}
                    </etools-button>
                  </div>
                `
              : ''}
          </section>
        </etools-collapse>
      </div>
    `;
  }
}
