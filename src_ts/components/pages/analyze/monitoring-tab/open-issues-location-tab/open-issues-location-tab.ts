import {customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {Unsubscribe} from 'redux';
import {store} from '../../../../../redux/store';
import {loadOpenIssuesLocations} from '../../../../../redux/effects/monitoring-activity.effects';
import {openIssuesLocationsSelector} from '../../../../../redux/selectors/open-issues-locations.selectors';

@customElement('open-issues-location-tab')
export class OpenIssuesLocationTab extends LitElement {
  @property() openIssuesLocation!: OpenIssuesActionPoints[];
  private readonly openIssuesActionPointsUnsubscribe!: Unsubscribe;

  constructor() {
    super();
    store.dispatch<AsyncEffect>(loadOpenIssuesLocations());
    this.openIssuesActionPointsUnsubscribe = store.subscribe(
      openIssuesLocationsSelector((openIssuesLocation: OpenIssuesActionPoints[]) => {
        this.openIssuesLocation = openIssuesLocation;
      })
    );
  }

  render(): TemplateResult {
    return html`
      <open-issues-shared-tab-template .data="${this.openIssuesLocation}"></open-issues-shared-tab-template>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.openIssuesActionPointsUnsubscribe();
  }
}
