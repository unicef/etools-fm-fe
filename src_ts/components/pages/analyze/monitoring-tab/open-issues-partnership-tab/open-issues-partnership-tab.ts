import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import '../shared-tab-template/open-issues-shared-tab-template';
import {store} from '../../../../../redux/store';
import {loadOpenIssuesPartnership} from '../../../../../redux/effects/monitoring-activity.effects';
import {Unsubscribe} from 'redux';
import {openIssuesPartnershipSelector} from '../../../../../redux/selectors/open-issues-partnership.selectors';

@customElement('open-issues-partnership-tab')
export class OpenIssuesPartnershipTab extends LitElement {
  @property() openIssuesPartnership!: OpenIssuesActionPoints[];
  private readonly openIssuesActionPointsUnsubscribe!: Unsubscribe;

  constructor() {
    super();
    store.dispatch<AsyncEffect>(loadOpenIssuesPartnership());
    this.openIssuesActionPointsUnsubscribe = store.subscribe(
      openIssuesPartnershipSelector((openIssuesPartnership: OpenIssuesActionPoints[]) => {
        this.openIssuesPartnership = openIssuesPartnership;
      })
    );
  }

  render(): TemplateResult {
    return html`
      <open-issues-shared-tab-template .data="${this.openIssuesPartnership}"></open-issues-shared-tab-template>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.openIssuesActionPointsUnsubscribe();
  }
}
