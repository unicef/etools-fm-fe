import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import '../open-issues-shared-tab-template';
import {Unsubscribe} from 'redux';
import {store} from '../../../../../../redux/store';
import {loadOpenIssuesLocations} from '../../../../../../redux/effects/monitoring-activity.effects';
import {openIssuesLocationsSelector} from '../../../../../../redux/selectors/monitoring-activities.selectors';

@customElement('open-issues-location-tab')
export class OpenIssuesLocationTab extends LitElement {
  @property() openIssuesLocation!: OpenIssuesActionPoints[];
  @property() loading: boolean = false;
  private openIssuesActionPointsUnsubscribe!: Unsubscribe;

  connectedCallback(): void {
    super.connectedCallback();
    this.loading = true;
    store.dispatch<AsyncEffect>(loadOpenIssuesLocations());
    this.openIssuesActionPointsUnsubscribe = store.subscribe(
      openIssuesLocationsSelector((openIssuesLocation: OpenIssuesActionPoints[]) => {
        this.openIssuesLocation = openIssuesLocation;
        this.loading = false;
      })
    );
  }

  render(): TemplateResult {
    return html`
      <open-issues-shared-tab-template
        .data="${this.openIssuesLocation}"
        .loading="${this.loading}"
      ></open-issues-shared-tab-template>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.openIssuesActionPointsUnsubscribe();
  }
}
