import {css, CSSResult, customElement, property, query, TemplateResult} from 'lit-element';
import {template} from './activity-details-card.tpl';
import {LocationWidgetComponent} from '../../../../../../common/location-widget/location-widget';
import {SectionsMixin} from '../../../../../../common/mixins/sections-mixin';
import {store} from '../../../../../../../redux/store';
import {sitesSelector} from '../../../../../../../redux/selectors/site-specific-locations.selectors';
import {staticDataDynamic} from '../../../../../../../redux/selectors/static-data.selectors';
import {LOCATIONS_ENDPOINT} from '../../../../../../../endpoints/endpoints-list';
import {Unsubscribe} from 'redux';
import {elevationStyles} from '../../../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../../../styles/shared-styles';
import {FlexLayoutClasses} from '../../../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../../../styles/card-styles';
import {BaseDetailsCard} from '../base-details-card';
import {SetEditedDetailsCard} from '../../../../../../../redux/actions/activity-details.actions';

export const CARD_NAME: string = 'activity-details';

@customElement('activity-details-card')
export class ActivityDetailsCard extends SectionsMixin(BaseDetailsCard) {
  @property() widgetOpened: boolean = false;
  @property() sitesList: Site[] = [];
  @property() locations: EtoolsLightLocation[] = [];

  @query('#locationWidget') private locationWidget!: LocationWidgetComponent;

  private sitesUnsubscribe!: Unsubscribe;
  private locationsUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.sitesUnsubscribe = store.subscribe(
      sitesSelector((sites: Site[] | null) => {
        if (!sites) {
          return;
        }
        this.sitesList = sites;
      })
    );

    this.locationsUnsubscribe = store.subscribe(
      staticDataDynamic(
        (locations: EtoolsLightLocation[] | undefined) => {
          if (!locations) {
            return;
          }
          this.locations = locations;
        },
        [LOCATIONS_ENDPOINT]
      )
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.sitesUnsubscribe();
    this.locationsUnsubscribe();
  }

  widgetToggle(): void {
    this.widgetOpened = !this.widgetOpened;
    if (!this.widgetOpened) {
      return;
    }
    this.locationWidget.updateMap();
  }

  protected startEdit(): void {
    super.startEdit();
    store.dispatch(new SetEditedDetailsCard(CARD_NAME));
  }

  static get styles(): CSSResult[] {
    // language=CSS
    return [
      elevationStyles,
      SharedStyles,
      FlexLayoutClasses,
      CardStyles,
      css`
        .card-content {
          padding-bottom: 10px;
        }
        .widget-container {
          position: relative;
          border: solid 1px var(--gray-06);
          margin: 0 12px;
        }

        .widget-dropdown {
          display: flex;
          align-items: center;
          padding: 14px 19px;
          margin: 18px 12px 0;
          color: var(--module-primary);
          background-color: var(--gray-06);
          text-transform: uppercase;
          font-weight: 500;
          font-size: 16px;
        }

        .widget-dropdown span,
        .widget-dropdown iron-icon.toggle-btn {
          cursor: pointer;
        }

        etools-loading {
          z-index: 9999;
        }
        datepicker-lite {
          white-space: nowrap;
        }
      `
    ];
  }
}
