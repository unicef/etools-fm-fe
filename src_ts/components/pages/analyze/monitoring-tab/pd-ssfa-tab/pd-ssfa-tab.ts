import {customElement, html, LitElement, TemplateResult} from 'lit-element';
import {Unsubscribe} from 'redux';
import {store} from '../../../../../redux/store';
import {loadInterventionsCoverage} from '../../../../../redux/effects/monitoring-activity.effects';
import {interventionsCoverageSelector} from '../../../../../redux/selectors/interventions-coverage.selectors';
import '../../../../common/progressbar/column-item-progress-bar';
import '../shared-tab-template/shared-tab-template';

@customElement('pd-ssfa-tab')
export class PdSsfaTab extends LitElement {
  private interventionsCoverage!: InterventionsCoverage[] = [
    {
      id: 1,
      number: 'NCO-PRC/2015/013',
      days_since_visit: 20,
      avg_days_between_visits: 30
    },
    {
      id: 2,
      number: 'TempRef:36/PD20162',
      days_since_visit: 100,
      avg_days_between_visits: 100
    },
    {
      id: 3,
      number: 'ABc consulting',
      days_since_visit: 63,
      avg_days_between_visits: 24
    }
  ];
  private readonly label: string =
    'Showing active PD/SSFAs delivering CP Outputs that can be monitored at the community level. (If there has not\n' +
    ' been any visits for a PD/SSFA, the “Days Since Last Visit” is the number of days since the start of PD/SSFA)';
  private readonly interventionsCoverageUnsubscribe: Unsubscribe;

  constructor() {
    super();
    store.dispatch<AsyncEffect>(loadInterventionsCoverage());
    this.interventionsCoverageUnsubscribe = store.subscribe(
      interventionsCoverageSelector((interventionsCoverage: InterventionsCoverage[]) => {
        // this.interventionsCoverage = interventionsCoverage;
      })
    );
  }

  render(): TemplateResult {
    return html`
      <shared-tab-template .label="${this.label}" .data="${this.interventionsCoverage}"></shared-tab-template>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.interventionsCoverageUnsubscribe();
  }
}
