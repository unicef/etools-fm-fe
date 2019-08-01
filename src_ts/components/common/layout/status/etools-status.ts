import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat';
import '@polymer/polymer/lib/elements/dom-if';
import '@polymer/iron-flex-layout/iron-flex-layout';
import {property} from '@polymer/decorators/lib/decorators';

import '@polymer/iron-icons/iron-icons';
import {completedStatusIcon} from './status-icons';

export interface EtoolsStatusItem {
  status?: string;
  label?: string;
}

export interface EtoolsStatusModel extends EtoolsStatusItem {
  // some statuses may share the same position
  statusOptions?: EtoolsStatusItem[];
}

/**
 * @customElement
 * @polymer
 */
class EtoolsStatus extends PolymerElement {

  static get template() {
    // language=HTML
    return html`
      <style>
        :host {
          @apply --layout-horizontal;
          @apply --layout-center;
          border-bottom: 1px solid var(--dark-divider-color);
          padding: 24px;
          background-color: var(--primary-background-color);
        }

        .status {
          @apply --layout-horizontal;
          @apply --layout-center;
          color: var(--secondary-text-color);
          font-size: 16px;
        }

        .status:not(:last-of-type)::after {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 40px;
          height: 0;
          margin: 0 24px;
          border-top: 1px solid var(--secondary-text-color);
        }

        .status .icon {
          display: inline-block;
          text-align: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          color: #fff;
          background-color: var(--secondary-text-color);
          margin-right: 8px;
          font-size: 14px;
          line-height: 24px;
        }

        .status.active .icon {
          background-color: var(--primary-color);
        }

        .status.completed .icon {
          background-color: var(--success-color);
          fill: #ffffff;
        }
      </style>
      <template is="dom-repeat" items="[[filteredStatuses]]">
        <div class$="status [[getStatusClasses(index, activeStatusIndex)]]">
          <span class="icon">
            <template is="dom-if" if="[[!isCompleted(index, activeStatusIndex)]]" restamp>
              [[getBaseOneIndex(index)]]
            </template>
            <template is="dom-if" if="[[isCompleted(index, activeStatusIndex)]]" restamp>
              ${completedStatusIcon}
            </template>
          </span>
          <span class="label">[[item.label]]</span>
        </div>
      </template>
    `;
  }

  @property({type: Array, computed: 'filterStatuses(statuses, activeStatus)'})
  filteredStatuses: EtoolsStatusItem[] = [];

  @property({type: String})
  activeStatus: string = 'submitted-accepted';

  @property({type: Number})
  activeStatusIndex: number = 0;

  // init with a default list of statuses (for testing)
  @property({type: Array})
  statuses: EtoolsStatusModel[] = [
    {
      status: 'draft',
      label: 'Draft'
    },
    {
      status: 'submitted-accepted',
      label: 'Submitted/Accepted'
    },
    {
      statusOptions: [ // some statuses may share the same position
        {
          status: 'report-submitted',
          label: 'Report submitted'
        },
        {
          status: 'rejected',
          label: 'Rejected'
        }
      ]
    },
    {
      status: 'completed',
      label: 'Completed'
    }
  ];

  /**
   * Filter statuses list and prepare the ones that will be displayed
   * @param statuses
   * @param activeStatus
   */
  filterStatuses(statuses: EtoolsStatusModel[], activeStatus: string): EtoolsStatusItem[] {
    let displayStatuses: EtoolsStatusItem[] = [];
    if (statuses.length > 0) {
      displayStatuses = statuses.map((s: EtoolsStatusModel, index: number) => {
        if (s.statusOptions && s.statusOptions.length > 0) {
          const aStatus: EtoolsStatusModel | undefined = s.statusOptions
            .find((st: EtoolsStatusModel) => st.status === activeStatus);
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
    return (index + 1);
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
    return classes.join(' ');
  }

}

window.customElements.define('etools-status', EtoolsStatus);
