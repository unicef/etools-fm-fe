import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {store} from '../../../../../../redux/store';
import {loadCpOutputCoverage} from '../../../../../../redux/effects/monitoring-activity.effects';
import {Unsubscribe} from 'redux';
import {cpOutputCoverageSelector} from '../../../../../../redux/selectors/monitoring-activities.selectors';
import '../shared-tab-template';

@customElement('cp-output-tab')
export class CpOutputTab extends LitElement {
  @property() private cpOutputCoverage!: CpOutputCoverage[];
  private readonly label: string = 'Showing CP Outputs that can be monitored at the community level.';
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
      <shared-tab-template .label="${this.label}" .data="${this.cpOutputCoverage}"></shared-tab-template>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cpOutputCoverageUnsubscribe();
  }
}
