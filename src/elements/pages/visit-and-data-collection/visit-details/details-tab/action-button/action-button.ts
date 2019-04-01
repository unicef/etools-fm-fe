type IconsCollection = { [actionName: string]: string };

class ActionButton extends Polymer.Element {
    public statusBtnMenuOpened!: boolean;
    public actions!: TransitionObject[];
    public static get is() { return 'action-button'; }

    public static get properties() {
        return {
            actions: {
                type: Array,
                value: () => []
            },
            icons: {
                type: Object,
                value: () => ({
                        'cancel': 'cancel',
                        'save': 'save',
                        'submit': 'assignment-turned-in',
                        'finalize': 'assignment-turned-in',
                        'activate': 'check',
                        'confirm': 'check',
                        'assign': 'check',
                        'approve': 'assignment-turned-in',
                        'reject_report': 'cancel',
                        'send_report': 'assignment-turned-in',
                        'accept': 'check',
                        'reject': 'cancel'
                    })
            }
        };
    }

    public closeMenu() {
        this.statusBtnMenuOpened = false;
    }

    public setButtonText(action: TransitionObject | undefined) {
        if (!action) { return ''; }
        return action.display_name.toUpperCase();
    }

    public btnClicked({ target }: HTMLElementEvent<HTMLElement>) {
        if (!target) { return; }
        const isMainAction = target.classList.contains('main-action');
        const isOtherOption = target.classList.contains('other-options');
        const parent = target.parentElement || target;
        const element = !isOtherOption ? parent : target;

        const action = isMainAction ?
            this.actions[0].code :
            element.getAttribute('action-code');

        if (!action) { return; }
        this.dispatchEvent(new CustomEvent('action-activated', {
            bubbles: true,
            composed: true,
            detail: action
        }));
    }

    public showOtherActions(length: number) {
        return length > 1;
    }

    public filterActions(action: TransitionObject) {
        return !R.equals(action, this.actions[0]);
    }

    public setIcon(action: TransitionObject, icons: IconsCollection) {
        if (!icons || !action) { return ''; }
        return icons[action.code] || '';
    }

}

customElements.define(ActionButton.is, ActionButton);
