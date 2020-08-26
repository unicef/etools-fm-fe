import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import '../open-issues-shared-tab-template';
import {Unsubscribe} from 'redux';
import {store} from '../../../../../../redux/store';
import {loadOpenIssuesCpOutput} from '../../../../../../redux/effects/monitoring-activity.effects';
import {openIssuesCpOutputSelector} from '../../../../../../redux/selectors/monitoring-activities.selectors';

@customElement('open-issues-cp-output-tab')
export class OpenIssuesCpOutputTab extends LitElement {
  @property() openIssuesCpOutput!: OpenIssuesActionPoints[];
  @property() loading = false;
  private openIssuesActionPointsUnsubscribe!: Unsubscribe;

  connectedCallback(): void {
    super.connectedCallback();
    this.loading = true;
    store.dispatch<AsyncEffect>(loadOpenIssuesCpOutput());
    this.openIssuesActionPointsUnsubscribe = store.subscribe(
      openIssuesCpOutputSelector((openIssuesCpOutput: OpenIssuesActionPoints[]) => {
        this.openIssuesCpOutput = openIssuesCpOutput;
        this.loading = false;
      })
    );
  }

  render(): TemplateResult {
    return html`
      <open-issues-shared-tab-template
        .data="${this.openIssuesCpOutput}"
        .loading="${this.loading}"
      ></open-issues-shared-tab-template>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.openIssuesActionPointsUnsubscribe();
  }
}
