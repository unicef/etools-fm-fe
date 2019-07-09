import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/paper-toast/paper-toast';
import '@polymer/paper-button/paper-button';
import {PaperToastElement} from '@polymer/paper-toast/paper-toast';
import {PaperButtonElement} from '@polymer/paper-button/paper-button';
import {GenericObject} from '../../../types/globals';

/**
 * @polymer
 * @customElement
 */
export class EtoolsToast extends PolymerElement {

  public static get template() {
    // main template
    // language=HTML
    return html`
      <style>
        .toast-dismiss-btn {
          --paper-button: {
            padding: 8px;
            min-width: 16px;
            margin: 0 -8px 0 24px;
          };
        }

        .toast-dismiss-btn-general-style {
          text-transform: uppercase;
          color: var(--primary-color);
        }

        .toast-dismiss-btn-multi-line {
          --paper-button: {
            padding: 8px;
            min-width: 16px;
            margin: 16px -8px -8px 0;
            @apply --layout-self-end;
          };
        }

        .toast-general-style {
          max-width: 568px !important;
          min-height: 40px;
          max-height: 70vh !important;
        }

        .toast {
          @apply --layout-horizontal;
          @apply --layout-center;
          justify-content: space-between;
        }

        .toast-multi-line {
          @apply --layout-vertical;
          text-align: justify;
        }
      </style>
      <paper-toast id="toast"
                   class="toast-general-style"
                   on-iron-overlay-closed="toastClosed">
        <paper-button id="confirmBtn"
                      on-tap="confirmToast"
                      class="toast-dismiss-btn-general-style">
          Ok
        </paper-button>
      </paper-toast>
    `;
  }

  private toast: PaperToastElement | null = null;
  public toastLabelEl: HTMLSpanElement | null = null;
  private _confirmBtn: PaperButtonElement | null = null;

  public fitInto: object | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.toast = this.shadowRoot!.querySelector('#toast') as PaperToastElement;
    this.toastLabelEl = this.toast!.shadowRoot!.querySelector('#label');
    this._confirmBtn = this.shadowRoot!.querySelector('#confirmBtn');
  }

  public show(details: object) {
    if (!this.toast) {
      return;
    }
    return this.toast.show(details);
  }

  public toggle() {
    if (!this.toast) {
      return;
    }
    return this.toast.toggle();
  }

  public confirmToast() {
    this.dispatchEvent(new CustomEvent('toast-confirm', {
      bubbles: true,
      composed: true
    }));
  }

  public toastClosed() {
    this.dispatchEvent(new CustomEvent('toast-closed', {
      bubbles: true,
      composed: true
    }));
  }

  protected _isMultiLine(message: string) {
    return !message ? false : (message.toString().length > 80);
  }

  private applyMultilineStyle() {
    if (this.toast) {
      this.toast.classList.remove('toast');
      this.toast.classList.add('toast-multi-line');
    }

    if (this._confirmBtn) {
      this._confirmBtn.classList.remove('toast-dismiss-btn');
      this._confirmBtn.classList.add('toast-dismiss-btn-multi-line');
    }
  }

  private removeMultilineStyle() {
    if (this.toast) {
      this.toast.classList.remove('toast-multi-line');
      this.toast.classList.add('toast');
    }

    if (this._confirmBtn) {
      this._confirmBtn.classList.remove('toast-dismiss-btn-multi-line');
      this._confirmBtn.classList.add('toast-dismiss-btn');
    }
  }

  public prepareToastAndGetShowProperties(detail: GenericObject) {
    if (this._isMultiLine(detail.text)) {
      this.applyMultilineStyle();
    } else {
      this.removeMultilineStyle();
    }
    if (this._confirmBtn) {
      this._confirmBtn.updateStyles();
    }

    // clone detail obj
    const toastProperties: GenericObject = JSON.parse(JSON.stringify(detail));

    toastProperties.duration = 0;
    if (typeof detail === 'object' && typeof detail.showCloseBtn !== 'undefined') {
      if (detail.showCloseBtn === true) {
        if (this._confirmBtn) {
          this._confirmBtn.removeAttribute('hidden');
        }
      } else {
        if (this._confirmBtn) {
          this._confirmBtn.setAttribute('hidden', '');
        }
        if (!detail.duration) {
          toastProperties.duration = 5000;
        }
      }
      delete toastProperties.showCloseBtn;
    } else {
      if (this._confirmBtn) {
        this._confirmBtn.setAttribute('hidden', '');
      }
    }

    return toastProperties;
  }

}

window.customElements.define('etools-toast', EtoolsToast);
