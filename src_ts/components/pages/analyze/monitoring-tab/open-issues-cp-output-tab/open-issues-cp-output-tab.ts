import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {Unsubscribe} from 'redux';
import {store} from '../../../../../redux/store';
import {openIssuesCpOutputSelector} from '../../../../../redux/selectors/open-issues-cp-output.selectors';
import {loadOpenIssuesCpOutput} from '../../../../../redux/effects/monitoring-activity.effects';

@customElement('open-issues-cp-output-tab')
export class OpenIssuesCpOutputTab extends LitElement {
  @property() openIssuesCpOutput!: OpenIssuesActionPoints[];
  private readonly openIssuesActionPointsUnsubscribe!: Unsubscribe;

  constructor() {
    super();
    store.dispatch<AsyncEffect>(loadOpenIssuesCpOutput());
    this.openIssuesActionPointsUnsubscribe = store.subscribe(
      openIssuesCpOutputSelector((openIssuesCpOutput: OpenIssuesActionPoints[]) => {
        this.openIssuesCpOutput = openIssuesCpOutput;
      })
    );
  }

  render(): TemplateResult {
    return html`
      <open-issues-shared-tab-template .data="${this.openIssuesCpOutput}"></open-issues-shared-tab-template>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.openIssuesActionPointsUnsubscribe();
  }
}
