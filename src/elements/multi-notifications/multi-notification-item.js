import { RemoveNotification } from '../redux-store/actions/notification.actions';

class MultiNotificationItem extends FMMixins.ReduxMixin(Polymer.Element) {
    static get is() {return 'multi-notification-item';}

    static get properties() {
        return {
            opened: {
                type: Boolean,
                observer: '_openedChanged'
            },
            text: {
                type: String,
                value: ''
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('transitionend', e => this._onTransitionEnd(e));
        this.opened = true;
    }

    _onTransitionEnd(e) {
        if (e && e.target === this && e.propertyName === 'opacity' && !this.opened) {
            this.dispatchOnStore(new RemoveNotification(this.id));
        }
    }

    _renderOpened() {
        requestAnimationFrame(() => {
            this.classList.add('notification-open');
        });
    }

    _renderClosed() {
        requestAnimationFrame(() => {
            this.classList.remove('notification-open');
        });
    }

    _openedChanged(opened) {
        if (opened) {
            this._renderOpened();
        } else {
            this._renderClosed();
        }
    }

    close() {
        this.opened = false;
    }
}

window.customElements.define(MultiNotificationItem.is, MultiNotificationItem);

