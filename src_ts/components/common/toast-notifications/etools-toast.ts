import { customElement, html, LitElement, TemplateResult } from 'lit-element';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/paper-toast/paper-toast';
import '@polymer/paper-button/paper-button';
import { PaperToastElement } from '@polymer/paper-toast/paper-toast';
import { PaperButtonElement } from '@polymer/paper-button/paper-button';

/**
 * @LitElement
 * @customElement
 */
@customElement('etools-toast')
export class EtoolsToast extends LitElement {
    public toastLabelEl: HTMLSpanElement | null = null;

    public fitInto: object | null = null;

    private toast: PaperToastElement | null = null;
    private confirmBtn: PaperButtonElement | null = null;

    public render(): TemplateResult {
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
                   @iron-overlay-closed="${() => this.toastClosed()}">
        <paper-button id="confirmBtn"
                      @tap="${() => this.confirmToast()}"
                      class="toast-dismiss-btn-general-style">
          Ok
        </paper-button>
      </paper-toast>
    `;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        setTimeout(() => {
            this.toast = this.shadowRoot!.querySelector('#toast') as PaperToastElement;
            if (this.toast) {
                this.toastLabelEl = this.toast!.shadowRoot!.querySelector('#label');
            }
            this.confirmBtn = this.shadowRoot!.querySelector('#confirmBtn');
        }, 200);
    }

    public show(details: object): void {
        if (!this.toast) {
            return;
        }
        return this.toast.show(details);
    }

    public toggle(): void {
        if (!this.toast) {
            return;
        }
        return this.toast.toggle();
    }

    public confirmToast(): void {
        this.dispatchEvent(new CustomEvent('toast-confirm', {
            bubbles: true,
            composed: true
        }));
    }

    public toastClosed(): void {
        this.dispatchEvent(new CustomEvent('toast-closed', {
            bubbles: true,
            composed: true
        }));
    }

    public prepareToastAndGetShowProperties(detail: GenericObject): GenericObject {
        if (this.isMultiLine(detail.text)) {
            this.applyMultilineStyle();
        } else {
            this.removeMultilineStyle();
        }
        if (this.confirmBtn) {
            this.confirmBtn.updateStyles();
        }

        // clone detail obj
        const toastProperties: GenericObject = JSON.parse(JSON.stringify(detail));

        toastProperties.duration = 0;
        if (detail) {
            if (detail.showCloseBtn === true) {
                if (this.confirmBtn) {
                    this.confirmBtn.removeAttribute('hidden');
                }
            } else {
                if (this.confirmBtn) {
                    this.confirmBtn.setAttribute('hidden', '');
                }
                if (!detail.duration) {
                    toastProperties.duration = 5000;
                }
            }
            delete toastProperties.showCloseBtn;
        } else {
            if (this.confirmBtn) {
                this.confirmBtn.setAttribute('hidden', '');
            }
        }

        return toastProperties;
    }

    protected isMultiLine(message: string): boolean {
        return !message ? false : (message.toString().length > 80);
    }

    private applyMultilineStyle(): void {
        if (this.toast) {
            this.toast.classList.remove('toast');
            this.toast.classList.add('toast-multi-line');
        }

        if (this.confirmBtn) {
            this.confirmBtn.classList.remove('toast-dismiss-btn');
            this.confirmBtn.classList.add('toast-dismiss-btn-multi-line');
        }
    }

    private removeMultilineStyle(): void {
        if (this.toast) {
            this.toast.classList.remove('toast-multi-line');
            this.toast.classList.add('toast');
        }

        if (this.confirmBtn) {
            this.confirmBtn.classList.remove('toast-dismiss-btn-multi-line');
            this.confirmBtn.classList.add('toast-dismiss-btn');
        }
    }

}
