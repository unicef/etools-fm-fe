import {css, CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import '../../../../common/progressbar/column-item-progress-bar';
import '../coverage/shared-tab-template';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {Unsubscribe} from 'redux';
import {loadHactVisits} from '../../../../../redux/effects/monitoring-activity.effects';
import {store} from '../../../../../redux/store';
import {template} from './visits-eligible-for-hact.tpl';
import {hactVisitsSelector} from '../../../../../redux/selectors/monitoring-activities.selectors';

@customElement('visits-eligible-for-hact')
export class VisitsEligibleForHact extends LitElement {
  @property() items!: HactVisits[];
  @property() loading: boolean = false;
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

  formatDate(date: string | null): string {
    return date ? moment(date).format('DD MMM YYYY') : '-';
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
    this.requestUpdate();
  }

  static get styles(): CSSResult[] {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      FlexLayoutClasses,
      CardStyles,
      css`
        .hact-visits {
          display: flex;
          flex-direction: column;
        }
        .hact-visits-label {
          justify-content: flex-end;
        }
        .custom-row-data {
          display: flex;
          justify-content: space-between;
        }
        .custom-row-details-content {
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100px;
          margin: 0.5%;
        }
        .custom-row-details-nowrap {
          white-space: nowrap;
        }
      `
    ];
  }
}
