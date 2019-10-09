import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import '@polymer/iron-icons/iron-icons';
import { completedStatusIcon } from './status-icons';

export interface IEtoolsStatusItem {
    status?: string;
    label?: string;
}

export interface IEtoolsStatusModel extends IEtoolsStatusItem {
    // some statuses may share the same position
    statusOptions?: IEtoolsStatusItem[];
}

/**
 * @LitElement
 * @customElement
 */

@customElement('etools-status')
export class EtoolsStatus extends LitElement {

    public get filteredStatuses(): IEtoolsStatusItem[] {
        return this.filterStatuses(this.statuses, this.activeStatus);
    }

    @property({ type: String })
    public activeStatus!: string;

    @property({ type: Number })
    public activeStatusIndex: number = 0;

    // init with a default list of statuses (for testing)
    @property({ type: Array })
    public statuses: IEtoolsStatusModel[] = [];

    public render(): TemplateResult {
        // language=HTML
        return html`
        <style>
            :host {
                display: flex;
                flex-flow: row wrap;
                align-items: center;
                border-bottom: 1px solid var(--dark-divider-color);
                padding: 24px 24px 0;
                background-color: var(--primary-background-color);
            }

            .status {
                display: flex;
                align-items: center;
                flex: auto;
                color: var(--secondary-text-color);
                font-size: 16px;
                padding-bottom: 24px;
                max-width: 260px;
            }

            .status:not(:last-of-type)::after {
                content: '';
                display: flex;
                flex: auto;
                height: 0;
                margin: 0 24px;
                border-top: 1px solid var(--secondary-text-color);
            }

            .status .icon {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 24px;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                color: #fff;
                background-color: var(--secondary-text-color);
                margin-right: 8px;
                font-size: 14px;
            }

            .status.active .icon {
                background-color: var(--primary-color);
            }

            .status.completed .icon {
                background-color: var(--success-color);
                fill: #ffffff;
            }
       </style>
       ${this.filteredStatuses.map((item: any, index: number) => this.getStatusHtml(item, index))}
    `;
    }

    public getStatusHtml(item: any, index: number): TemplateResult {
        const completed: boolean = this.isCompleted(index, this.activeStatusIndex);
        // language=HTML
        return html`
    <div class="status ${this.getStatusClasses(index, this.activeStatusIndex)}">
      <span class="icon">
          ${completed ? html`${completedStatusIcon}` : html`${this.getBaseOneIndex(index)}`}
      </span>
      <span class="label">${item.label}</span>
    </div>
    `;
    }

    /**
     * Filter statuses list and prepare the ones that will be displayed
     * @param statuses
     * @param activeStatus
     */
    public filterStatuses(statuses: IEtoolsStatusModel[], activeStatus: string): IEtoolsStatusItem[] {
        let displayStatuses: IEtoolsStatusItem[] = [];
        if (statuses.length > 0) {
            displayStatuses = statuses.map((s: IEtoolsStatusModel, index: number) => {
                if (s.statusOptions && s.statusOptions.length > 0) {
                    const aStatus: IEtoolsStatusModel | undefined = s.statusOptions
                        .find((st: IEtoolsStatusModel) => st.status === activeStatus);
                    // return the active status from a list of statuses that can share the same position
                    // if active status is not in this list, return first IEtoolsStatusItem
                    if (aStatus) {
                        // set active status index
                        this.activeStatusIndex = index;
                    }
                    return aStatus ? aStatus : s.statusOptions[0];
                } else {
                    if (s.status === activeStatus) {
                        this.activeStatusIndex = index;
                    }
                    return s;
                }
            });
        }
        return displayStatuses;
    }

    /**
     * Get status icon or icon placeholder
     * @param index
     */
    public getBaseOneIndex(index: number): number | string {
        return (index + 1);
    }

    public isCompleted(index: number, activeStatusIndex: number): boolean {
        return index < activeStatusIndex;
    }

    public getStatusClasses(index: number, activeStatusIndex: number): string {
        const classes: string[] = [];
        if (index === activeStatusIndex) {
            classes.push('active');
        }
        if (this.isCompleted(index, activeStatusIndex)) {
            classes.push('completed');
        }
        return classes.join(' ');
    }

}
