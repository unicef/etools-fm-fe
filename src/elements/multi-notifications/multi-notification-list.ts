(function() {
    class MultiNotificationList extends FMMixins.ReduxMixin(Polymer.Element) {
        public static get is() { return 'multi-notification-list'; }

        public static get properties() {
            return {
                notifications: {
                    type: Array,
                    value() { return []; }
                },
                limit: {
                    type: Number,
                    value: 3
                }
            };
        }

        public connectedCallback() {
            super.connectedCallback();
            this.subscribeOnStore(
                (store: FMStore) => store.notifications,
                (notifications: Toast[]) => this.onNotificationsChange(notifications)
            );
        }

        private onNotificationsChange(notifications: Toast[] = []) {
            const newNotifications: Toast[] = notifications.slice(0, this.limit);

            let i = 0;
            while (i < this.notifications.length) {
                const id = this.notifications[i].id;
                const index = _.findIndex(newNotifications, (notification: Toast) => notification.id === id);

                if (index > -1) {
                    newNotifications.splice(index, 1);
                    i++;
                } else {
                    this.splice('notifications', index);
                }
            }

            // @ts-ignore
            Polymer.dom.flush();
            this.push('notifications', ...newNotifications);
        }
    }

    window.customElements.define(MultiNotificationList.is, MultiNotificationList);
})();
