import {css, CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import '../../../../common/progressbar/column-item-progress-bar';
import '../shared-tab-template/shared-tab-template';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {Unsubscribe} from 'redux';
import {loadHactVisits} from '../../../../../redux/effects/monitoring-activity.effects';
import {store} from '../../../../../redux/store';
import {hactVisitsSelector} from '../../../../../redux/selectors/hact-visits.selectors';
import {template} from './visits-eligible-for-hact.tpl';

@customElement('visits-eligible-for-hact')
export class VisitsEligibleForHact extends LitElement {
  @property() items!: HactVisits[];
  private readonly hactVisitsUnsubscribe!: Unsubscribe;

  constructor() {
    super();
    store.dispatch<AsyncEffect>(loadHactVisits());
    this.hactVisitsUnsubscribe = store.subscribe(
      hactVisitsSelector((hactVisits: HactVisits[]) => {
        // hactVisits.forEach(item =>
        //   item.visits.push({
        //     name: `asdfas${Math.random()}`,
        //     cp_outputs: `cp_out${Math.random()}`,
        //     interventions: `interventions${Math.random()}`,
        //     end_date: '2019-11-14'
        //   })
        // );
        this.items = hactVisits;
      })
    );
  }

  render(): TemplateResult {
    return template.call(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.hactVisitsUnsubscribe();
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
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 100px;
          margin: 0.5%;
        }
      `
    ];
  }
}
