import {css, html, CSSResult, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../../../../common/progressbar/column-item-progress-bar';
import '../coverage/shared-tab-template';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {Unsubscribe} from 'redux';
import {loadHactVisits} from '../../../../../redux/effects/monitoring-activity.effects';
import {store} from '../../../../../redux/store';
import {template} from './visits-eligible-for-hact.tpl';
import {hactVisitsSelector} from '../../../../../redux/selectors/monitoring-activities.selectors';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {formatDate} from '@unicef-polymer/etools-utils/dist/date.util';
import PaginationMixin from '@unicef-polymer/etools-modules-common/dist/mixins/pagination-mixin';

@customElement('visits-eligible-for-hact')
export class VisitsEligibleForHact extends PaginationMixin(LitElement) {
  @property() items!: HactVisits[];
  @property() paginatedItems!: HactVisits[];
  @property() loading = false;
  @property({type: Boolean}) lowResolutionLayout = false;
  private hactVisitsUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.loading = true;
    store.dispatch<AsyncEffect>(loadHactVisits());
    this.hactVisitsUnsubscribe = store.subscribe(
      hactVisitsSelector((hactVisits: HactVisits[]) => {
        this.items = hactVisits;
        this.loading = false;
      })
    );
    this.addEventListener('sort-changed', ((event: CustomEvent<SortDetails>) => this.sortItems(event.detail)) as any);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.hactVisitsUnsubscribe();
  }

  sortItems(detail: SortDetails): void {
    switch (detail.field) {
      case 'name':
        this.items.sort((a: HactVisits, b: HactVisits) => {
          return detail.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
        break;
      case 'visits_count':
        this.items.sort((a: HactVisits, b: HactVisits) => {
          return detail.direction === 'asc' ? a.visits_count - b.visits_count : b.visits_count - a.visits_count;
        });
        break;
    }
    this.paginator.page = 1;
    this._paginate(1, this.paginator.page_size);
    this.requestUpdate();
  }

  _paginate(pageNumber: number, pageSize: number): void {
    if (!this.items) {
      return;
    }
    this.paginatedItems = (this.items || []).slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  paginatorChanged(): void {
    this._paginate(this.paginator.page, this.paginator.page_size);
  }
  _resizeMap(): void {
    fireEvent(this, 'resize-map');
  }

  getDetailsRefNumber(activities: HactVisitsActivity[]) {
    return (activities || []).map(
      (activity) => html`<div class="custom-row-details-content">${activity.reference_number}</div>`
    );
  }

  getDetailsCpOutput(activities: HactVisitsActivity[]) {
    return (activities || []).map((activity) =>
      activity.cp_outputs.map(
        (item: IActivityCPOutput) => html` <label class="custom-row-details-content">${item.name}</label> `
      )
    );
  }

  getDetailsInterventionTitle(activities: HactVisitsActivity[]) {
    return (activities || []).map((activity) =>
      activity.interventions.map(
        (item: IActivityIntervention) => html` <label class="custom-row-details-content">${item.title}</label> `
      )
    );
  }

  getDetailsEndDate(activities: HactVisitsActivity[]) {
    return (activities || []).map(
      (activity) => html`<div class="custom-row-details-content">${formatDate(activity.end_date) || '-'}</div>`
    );
  }

  static get styles(): CSSResult[] {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      layoutStyles,
      CardStyles,
      css`
        .hact-visits {
          display: flex;
          flex-direction: column;
        }
        .hact-visits-label {
          justify-content: flex-end !important;
        }
        .custom-row-data {
          display: flex;
          justify-content: space-between;
        }
        .custom-row-details-content {
          font-size: var(--etools-font-size-11, 11px);
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .custom-row-details-nowrap {
          white-space: nowrap;
        }
        .custom-row-details-visit {
          flex-basis: 20%;
        }
        .custom-row-details-cp-output {
          flex-basis: 32%;
        }
        .custom-row-details-ps-ssfa {
          flex-basis: 32%;
        }
        .custom-row-details-date {
          flex-basis: 15%;
      `
    ];
  }
}
