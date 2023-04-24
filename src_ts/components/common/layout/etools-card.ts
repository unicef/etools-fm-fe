import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {CardStyles} from '../../styles/card-styles';
import {elevationStyles} from '../../styles/elevation-styles';
import '@polymer/iron-icons/iron-icons';
import {FlexLayoutClasses} from '../../styles/flex-layout-classes';
import {translate} from 'lit-translate';

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
      FlexLayoutClasses,
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
          font-size: 18px;
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
                <paper-icon-button
                  class="flex-header__collapse"
                  @tap="${() => this.toggleCollapse()}"
                  icon="${this.collapsed ? 'expand-more' : 'expand-less'}"
                ></paper-icon-button>
              `
            : ''}
          <div class="flex-header__title">${this.cardTitle}</div>
          <div class="layout horizontal center flex-header__edit">
            ${this.isEditable
              ? html`
                  <paper-icon-button
                    icon="create"
                    ?edit=${this.edit}
                    ?hidden="${this.hideEditButton}"
                    class="edit-button"
                    @tap="${() => this.startEdit()}"
                  ></paper-icon-button>
                `
              : ''}
          </div>
          <div class="flex-header__actions"><slot name="actions"></slot></div>
        </header>
        <iron-collapse ?opened="${!this.collapsed}">
          <section class="card-content-block">
            <slot name="content"></slot>

            ${this.isEditable && this.edit
              ? html`
                  <div class="layout horizontal end-justified card-buttons">
                    <paper-button @tap="${() => this.cancel()}">${translate('MAIN.BUTTONS.CANCEL')}</paper-button>
                    <paper-button class="save-button" @tap="${() => this.save()}"
                      >${translate('MAIN.BUTTONS.SAVE')}</paper-button
                    >
                  </div>
                `
              : ''}
          </section>
        </iron-collapse>
      </div>
    `;
  }
}
