import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {store} from '../../../../../../redux/store';
import {loadCpOutputCoverage} from '../../../../../../redux/effects/monitoring-activity.effects';
import {Unsubscribe} from 'redux';
import {cpOutputCoverageSelector} from '../../../../../../redux/selectors/monitoring-activities.selectors';
import '../shared-tab-template';

@customElement('cp-output-tab')
export class CpOutputTab extends LitElement {
  @property() private cpOutputCoverage!: CpOutputCoverage[];
  @property() private loading: boolean = false;
  private readonly label: string = 'Showing CP Outputs that can be monitored at the community level.';
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
        .label="${this.label}"
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
