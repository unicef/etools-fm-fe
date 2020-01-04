import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {Unsubscribe} from 'redux';
import {store} from '../../../../../../redux/store';
import {loadInterventionsCoverage} from '../../../../../../redux/effects/monitoring-activity.effects';
import '../../../../../common/progressbar/column-item-progress-bar';
import '../shared-tab-template';
import {interventionsCoverageSelector} from '../../../../../../redux/selectors/monitoring-activities.selectors';
import {translate} from 'lit-translate';

@customElement('pd-ssfa-tab')
export class PdSsfaTab extends LitElement {
  @property() private interventionsCoverage!: InterventionsCoverage[];
  private readonly interventionsCoverageUnsubscribe: Unsubscribe;

  constructor() {
    super();
    store.dispatch<AsyncEffect>(loadInterventionsCoverage());
    this.interventionsCoverageUnsubscribe = store.subscribe(
      interventionsCoverageSelector((interventionsCoverage: InterventionsCoverage[]) => {
        this.interventionsCoverage = interventionsCoverage;
      })
    );
  }

  render(): TemplateResult {
    return html`
      <shared-tab-template
        .label="${translate('ANALYZE.MONITORING_TAB.COVERAGE.PD_SSFA.LABEL')}"
        .data="${this.interventionsCoverage}"
      ></shared-tab-template>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.interventionsCoverageUnsubscribe();
  }
}
