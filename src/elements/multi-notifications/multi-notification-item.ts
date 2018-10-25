import { RemoveNotification } from '../redux-store/actions/notification.actions';

class MultiNotificationItem extends FMMixins.ReduxMixin(Polymer.Element) {
    public static get is() { return 'multi-notification-item'; }

    public static get properties() {
        return {
            opened: {
                type: Boolean,
                observer: 'openedChanged'
            },
            text: {
                type: String,
                value: ''
            }
        };
    }

    public connectedCallback() {
        super.connectedCallback();
        this.addEventListener('transitionend', (event: AnimationEvent) => this._onTransitionEnd(event));
        this.opened = true;
    }

    public openedChanged(opened: boolean) {
        if (opened) {
            this._renderOpened();
        } else {
            this._renderClosed();
        }
    }

    public close() {
        this.opened = false;
    }

    private _onTransitionEnd(event: AnimationEvent) {
        // @ts-ignore
        if (event && event.target === this && event.propertyName === 'opacity' && !this.opened) {
            this.dispatchOnStore(new RemoveNotification(this.id));
        }
    }

    private _renderOpened() {
        requestAnimationFrame(() => {
            this.classList.add('notification-open');
        });
    }

    private _renderClosed() {
        requestAnimationFrame(() => {
            this.classList.remove('notification-open');
        });
    }

}

window.customElements.define(MultiNotificationItem.is, MultiNotificationItem);
