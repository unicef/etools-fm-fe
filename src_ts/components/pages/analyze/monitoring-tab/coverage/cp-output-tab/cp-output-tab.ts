import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {store} from '../../../../../../redux/store';
import {loadCpOutputCoverage} from '../../../../../../redux/effects/monitoring-activity.effects';
import {Unsubscribe} from 'redux';
import {cpOutputCoverageSelector} from '../../../../../../redux/selectors/monitoring-activities.selectors';
import '../shared-tab-template';
import {translate} from 'lit-translate';

@customElement('cp-output-tab')
export class CpOutputTab extends LitElement {
  @property() private cpOutputCoverage!: CpOutputCoverage[];
  private readonly cpOutputCoverageUnsubscribe: Unsubscribe;
  constructor() {
    super();
    store.dispatch<AsyncEffect>(loadCpOutputCoverage());
    this.cpOutputCoverageUnsubscribe = store.subscribe(
      cpOutputCoverageSelector((cpOutputCoverage: CpOutputCoverage[]) => {
        this.cpOutputCoverage = cpOutputCoverage;
      })
    );
  }
  render(): TemplateResult {
    return html`
      <shared-tab-template
        .label="${translate('ANALYZE.MONITORING_TAB.COVERAGE.CP_OUTPUT.LABEL')}"
        .data="${this.cpOutputCoverage}"
      ></shared-tab-template>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cpOutputCoverageUnsubscribe();
  }
}
