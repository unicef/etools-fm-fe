import {LitElement, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {store} from '../../../../../../redux/store';
import {loadCpOutputCoverage} from '../../../../../../redux/effects/monitoring-activity.effects';
import {Unsubscribe} from 'redux';
import {cpOutputCoverageSelector} from '../../../../../../redux/selectors/monitoring-activities.selectors';
import '../shared-tab-template';
import {translate} from 'lit-translate';

@customElement('cp-output-tab')
export class CpOutputTab extends LitElement {
  @property() private cpOutputCoverage!: CpOutputCoverage[];
  @property() private loading = false;
  private readonly cpOutputCoverageUnsubscribe: Unsubscribe;
  constructor() {
    super();
    this.loading = true;
    store.dispatch<AsyncEffect>(loadCpOutputCoverage());
    this.cpOutputCoverageUnsubscribe = store.subscribe(
      cpOutputCoverageSelector((cpOutputCoverage: CpOutputCoverage[]) => {
        this.cpOutputCoverage = cpOutputCoverage;
        this.loading = false;
      })
    );
  }
  render(): TemplateResult {
    return html`
      <shared-tab-template
        .label="${translate('ANALYZE.MONITORING_TAB.COVERAGE.CP_OUTPUT.LABEL')}"
        .data="${this.cpOutputCoverage}"
        .loading="${this.loading}"
      ></shared-tab-template>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cpOutputCoverageUnsubscribe();
  }
}
