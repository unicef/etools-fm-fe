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
  @property() private loading = false;
  private readonly interventionsCoverageUnsubscribe: Unsubscribe;

  constructor() {
    super();
    this.loading = true;
    store.dispatch<AsyncEffect>(loadInterventionsCoverage());
    this.interventionsCoverageUnsubscribe = store.subscribe(
      interventionsCoverageSelector((interventionsCoverage: InterventionsCoverage[]) => {
        this.interventionsCoverage = interventionsCoverage;
        this.loading = false;
      })
    );
  }

  render(): TemplateResult {
    return html`
      <shared-tab-template
        .label="${translate('ANALYZE.MONITORING_TAB.COVERAGE.PD_SPD.LABEL')}"
        .data="${this.interventionsCoverage}"
        .loading="${this.loading}"
      ></shared-tab-template>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.interventionsCoverageUnsubscribe();
  }
}
