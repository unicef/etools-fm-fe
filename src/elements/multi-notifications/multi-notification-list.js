(function() {
    class MultiNotificationList extends FMMixins.ReduxMixin(Polymer.Element) {
        static get is() {return 'multi-notification-list';}

        static get properties() {
            return {
                notifications: {
                    type: Array,
                    value() {return [];}
                },
                limit: {
                    type: Number,
                    value: 3
                }
            };
        }

        connectedCallback() {
            super.connectedCallback();
            this.subscribeOnStore(
                store => store.notifications,
                notifications => this._onNotificationsChange(notifications)
            );
        }

        _onNotificationsChange(notifications = []) {
            const newNotifications = notifications.slice(0, this.limit);

            let i = 0;
            while (i < this.notifications.length) {
                const id = this.notifications[i].id;
                const index = _.findIndex(newNotifications, notification => notification.id === id);

                if (index > -1) {
                    newNotifications.splice(index, 1);
                    i++;
                } else {
                    this.splice('notifications', index);
                }
            }

            Polymer.dom.flush();
            this.push('notifications', ...newNotifications);
        }
    }

    window.customElements.define(MultiNotificationList.is, MultiNotificationList);
})();
