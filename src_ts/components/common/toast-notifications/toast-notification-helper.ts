import {EtoolsToast} from './etools-toast';
import './etools-toast'; // element loaded (if not, etools-toast will not render)

/**
 * Toasts notification messages queue utility class
 */
export class ToastNotificationHelper {
  private readonly _toast: EtoolsToast;
  private _toastQueue: GenericObject[] = [];
  private TOAST_EL_ID = 'toastNotificationQueueEl';

  constructor() {
    const toast: EtoolsToast = document.querySelector(this.TOAST_EL_ID) as EtoolsToast;
    this._toast = toast ? toast : this.createToastNotificationElement();
  }

  addToastNotificationListeners(): void {
    this.queueToast = this.queueToast.bind(this);
    document.body.addEventListener('toast', this.queueToast);
  }

  removeToastNotificationListeners(): void {
    document.body.removeEventListener('toast', this.queueToast);
    if (this._toast) {
      this._toast.removeEventListener('toast-confirm', this._toggleToast);
      this._toast.removeEventListener('toast-closed', this.dequeueToast);
    }
  }

  queueToast(event: GenericObject): void {
    event.stopPropagation();
    const detail: GenericObject = event.detail;

    if (!this._toastQueue.length) {
      this._toastQueue.push(detail);
      const toastProperties: GenericObject = this._toast.prepareToastAndGetShowProperties(detail);
      this._showToast(toastProperties);
    } else {
      const alreadyInQueue: GenericObject[] = this._toastQueue.filter((toastDetail: GenericObject) => {
        return JSON.stringify(toastDetail) === JSON.stringify(detail);
      });
      if (alreadyInQueue.length === 0) {
        this._toastQueue.push(detail);
      } // else already in the queue
    }
  }

  createToastNotificationElement(): EtoolsToast {
    const toast: EtoolsToast = document.createElement('etools-toast') as EtoolsToast;
    toast.setAttribute('id', this.TOAST_EL_ID);
    this._toggleToast = this._toggleToast.bind(this);
    toast.addEventListener('toast-confirm', this._toggleToast);
    document.querySelector('body')!.appendChild(toast);
    this._toastAfterRenderSetup(toast);
    return toast;
  }

  dequeueToast(): void {
    this._toastQueue.shift();
    if (this._toastQueue.length) {
      const toastProperties: GenericObject = this._toast.prepareToastAndGetShowProperties(this._toastQueue[0]);
      this._showToast(toastProperties);
    }
  }

  protected _toastAfterRenderSetup(toast: EtoolsToast): void {
    if (toast) {
      // alter message wrapper css
      setTimeout(() => {
        if (toast.toastLabelEl) {
          toast.toastLabelEl.style.whiteSpace = 'pre-wrap';
        }
      }, 0);
    }
    // add close listener
    this.dequeueToast = this.dequeueToast.bind(this);
    toast.addEventListener('toast-closed', this.dequeueToast);
  }

  protected _toggleToast(): void {
    if (this._toast) {
      this._toast.toggle();
    }
  }

  protected _showToast(toastProperties: GenericObject): void {
    // TODO: currentToastMessage is used by piwik elem; use it or remove it :)
    // this.appShellEl.set('currentToastMessage', toastProperties.text);
    this._toast.show(toastProperties);
  }
}
