import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {fireEvent} from '../../utils/fire-custom-event';
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
  isEditable: boolean = false;

  @property({type: Boolean, attribute: 'is-collapsible'})
  isCollapsible: boolean = false;

  @property({type: Boolean, attribute: 'hide-edit-button'})
  hideEditButton: boolean = false;

  @property({type: Boolean}) collapsed: boolean = false;
  @property({type: Boolean}) edit: boolean = false;

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
        <header class="card-title-box with-bottom-line" ?is-collapsible="${this.isCollapsible}">
          ${this.isCollapsible
            ? html`
                <paper-icon-button
                  @tap="${() => this.toggleCollapse()}"
                  icon="${this.collapsed ? 'expand-more' : 'expand-less'}"
                ></paper-icon-button>
              `
            : ''}
          <div class="card-title">${this.cardTitle}</div>
          <div class="layout horizontal center">
            <slot name="actions"></slot>
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
