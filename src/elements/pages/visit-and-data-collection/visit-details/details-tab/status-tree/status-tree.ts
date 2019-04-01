import DomRepeat = Polymer.DomRepeat;

class StatusTree extends Polymer.Element {
    public visitData!: Visit;
    public static get is() { return 'status-tree'; }

    public static get properties() {
        return {
            statuses: {
                type: Array,
                value: () => []
            },
            visitData: {
                type: Object,
                value: () => ({}),
                observer: 'dataChanged'
            }
        };
    }

    public connectedCallback() {
        super.connectedCallback();
    }

    public filterStatuses({ value: status }: StatusOption) {
        const isConditionalStatus = ['report_rejected', 'cancelled', 'rejected', 'accepted'].indexOf(status) !== -1;

        const acceptedCondition = status === 'accepted' && this.visitData.status !== 'rejected';
        const conditionForOther = status === this.visitData.status;

        return !isConditionalStatus || acceptedCondition || conditionForOther;
    }

    public getStatusClass({ value }: StatusOption, visitData: Visit) {
        const date = R.path([`date_${value}`], visitData);
        const isRejectStatus = ['report_rejected', 'cancelled', 'rejected'].indexOf(value) !== -1;
        const isActive = value === 'draft' || !!date;
        return `${isRejectStatus ? 'cancelled' : ''} ${isActive ? 'active' : ''}`;
    }

    public getStatusIndex(index: number) {
        return index + 1;
    }

    public dataChanged() {
        (this.$.statuses as DomRepeat).render();
    }
}

customElements.define(StatusTree.is, StatusTree);
