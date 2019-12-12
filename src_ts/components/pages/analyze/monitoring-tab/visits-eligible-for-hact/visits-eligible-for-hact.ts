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
  private hactVisitsUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    store.dispatch<AsyncEffect>(loadHactVisits());
    this.hactVisitsUnsubscribe = store.subscribe(
      hactVisitsSelector((hactVisits: HactVisits[]) => {
        this.items = hactVisits;
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.hactVisitsUnsubscribe();
  }

  formatDate(date: string | null): string {
    return date ? moment(date).format('DD MMM YYYY') : '-';
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
          margin: 0.5%;
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
