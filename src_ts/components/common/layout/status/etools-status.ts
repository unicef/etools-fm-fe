import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import '@polymer/iron-icons/iron-icons';
import {cancelledStatusIcon, completedStatusIcon} from './status-icons';
import {CANCELLED} from '../../../pages/activities-and-data-collection/activity-item/statuses-actions/activity-statuses';

/**
 * @LitElement
 * @customElement
 */

@customElement('etools-status')
export class EtoolsStatus extends LitElement {
  @property({type: String})
  activeStatus!: string;
  @property({type: Number})
  activeStatusIndex: number = 0;
  @property({type: Array})
  statuses: IEtoolsStatusModel[] = [];

  get filteredStatuses(): IEtoolsStatusItem[] {
    return this.filterStatuses(this.statuses, this.activeStatus);
  }

  render(): TemplateResult {
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

        .status.cancelled .icon {
          background-color: var(--primary-background-color);
        }

        .status.completed .icon {
          background-color: var(--success-color);
          fill: #ffffff;
        }
      </style>
      ${this.filteredStatuses.map((item: any, index: number) => this.getStatusHtml(item, index))}
    `;
  }

  getStatusHtml(item: any, index: number): TemplateResult {
    // language=HTML
    return html`
      <div class="status ${this.getStatusClasses(index, this.activeStatusIndex)}">
        <span class="icon">
          ${this.getIcon(index)}
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
  filterStatuses(statuses: IEtoolsStatusModel[], activeStatus: string): IEtoolsStatusItem[] {
    let displayStatuses: IEtoolsStatusItem[] = [];
    if (statuses.length > 0) {
      displayStatuses = statuses.map((s: IEtoolsStatusModel, index: number) => {
        if (s.statusOptions && s.statusOptions.length > 0) {
          const aStatus: IEtoolsStatusModel | undefined = s.statusOptions.find(
            (st: IEtoolsStatusModel) => st.status === activeStatus
          );
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
  getBaseOneIndex(index: number): number | string {
    return index + 1;
  }

  isCompleted(index: number, activeStatusIndex: number): boolean {
    return index < activeStatusIndex;
  }

  getStatusClasses(index: number, activeStatusIndex: number): string {
    const classes: string[] = [];
    if (index === activeStatusIndex) {
      classes.push('active');
    }
    if (this.isCompleted(index, activeStatusIndex)) {
      classes.push('completed');
    }
    if (this.statuses[index].status === CANCELLED) {
      classes.push('cancelled');
    }
    return classes.join(' ');
  }

  getIcon(index: number): TemplateResult {
    const completed: boolean = this.isCompleted(index, this.activeStatusIndex);
    if (completed) {
      return html`
        ${completedStatusIcon}
      `;
    } else if (this.statuses[index].status === CANCELLED) {
      return html`
        ${cancelledStatusIcon}
      `;
    } else {
      return html`
        ${this.getBaseOneIndex(index)}
      `;
    }
  }
}
