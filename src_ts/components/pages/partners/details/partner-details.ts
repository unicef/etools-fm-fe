import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {updateAppLocation} from '../../../../routing/routes';
import '../../../common/layout/page-content-header/page-content-header';
import '../../../common/layout/etools-tabs';
import '../../../common/layout/status/etools-status';
import {RouterStyles} from '../../../app-shell/router-style';
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {buttonsStyles} from '../../../styles/button-styles';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {SharedStyles} from '../../../styles/shared-styles';
import {tpmPartnerDetailsData} from '../../../../redux/selectors/tpm-partner-details.selectors';
import {tpmPartnerDetails} from '../../../../redux/reducers/tpm-partner-details.reducer';
import {requestTPMPartnerDetails} from '../../../../redux/effects/tpm-partner-details.effects';
import {Unsubscribe} from 'redux';
import {PARTNERS_PAGE} from '../partners-page';
import {translate} from 'lit-translate';
import {SaveRoute} from '../../../../redux/actions/app.actions';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {TPM_PARTNER_EXPORT} from '../../../../endpoints/endpoints-list';

store.addReducers({tpmPartnerDetails});

const PAGE = PARTNERS_PAGE;
const SUB_ROUTE = 'item';
const DETAILS_TAB = 'details';
const ATTACHMENTS_TAB = 'attachments';

@customElement('partner-details')
export class PartnerDetailsComponent extends MatomoMixin(LitElement) {
  @property() partnerId: string | null = null;
  @property() partnerDetails: IActivityTpmPartner | null = null;
  @property() isStatusUpdating = false;
  @property() activeTab!: string;
  @property() childInEditMode = false;

  pageTabs: PageTab[] = [
    {
      tab: DETAILS_TAB,
      tabLabel: translate(`TPM_DETAILS.TABS.${DETAILS_TAB}`),
      hidden: false
    },
    {
      tab: ATTACHMENTS_TAB,
      tabLabel: translate(`TPM_DETAILS.TABS.${ATTACHMENTS_TAB}`),
      hidden: false
    }
  ];

  private partnerDetailsUnsubscribe!: Unsubscribe;
  private routeDetailsUnsubscribe!: Unsubscribe;
  private isLoad = false;

  static get styles(): CSSResultArray {
    return [
      SharedStyles,
      pageContentHeaderSlottedStyles,
      pageLayoutStyles,
      RouterStyles,
      buttonsStyles,
      css`
        .export-icon {
          padding-inline-end: 4px;
        }
        #export {
          padding: 6px 10px;
          font-size: 16px;
          font-weight: bold;
          color: var(--secondary-text-color);
        }
      `
    ];
  }

  render(): TemplateResult {
    // language=HTML
    return html`
      <etools-loading
        ?active="${this.isLoad}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>

      <page-content-header with-tabs-visible>
        <h1 slot="page-title">${this.partnerDetails && this.partnerDetails.name}</h1>

        <div slot="title-row-actions" class="content-header-actions">
          <paper-button
            id="export"
            @tap="${this.export}"
            tracker="Export PDF"
            ?hidden="${this.hideExportButton(this.partnerDetails)}"
          >
            <iron-icon icon="file-download" class="export-icon"></iron-icon>
            ${translate('ACTIVITY_DETAILS.EXPORT')}
          </paper-button>
        </div>

        <etools-tabs
          id="tabs"
          slot="tabs"
          .tabs="${this.pageTabs}"
          @iron-select="${({detail}: any) => this.onSelect(detail.item)}"
          .activeTab="${this.activeTab}"
        ></etools-tabs>
      </page-content-header>

      ${this.getTabElement()}
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    store.dispatch(new SaveRoute(null));
    this.isLoad = true;
    // On Partner data changes
    this.partnerDetailsUnsubscribe = store.subscribe(
      tpmPartnerDetailsData((data: IActivityTpmPartner | null) => {
        if (!data) {
          return;
        }
        this.partnerDetails = data;
        this.checkTab();
      }, false)
    );

    // On Route changes
    this.routeDetailsUnsubscribe = store.subscribe(
      routeDetailsSelector(({routeName, subRouteName, params}: IRouteDetails) => {
        if (routeName !== PAGE || subRouteName !== SUB_ROUTE) {
          return;
        }
        const paramId: string | null = params && (params.id as string);

        if (!paramId) {
          updateAppLocation('page-not-found');
        }
        this.partnerId = paramId;

        const partnerDetailsState: ITPMPartnerDetailsState = store.getState().tpmPartnerDetails;
        const partnerId: number | null = partnerDetailsState && partnerDetailsState.data && partnerDetailsState.data.id;
        const isNotLoaded: boolean = !partnerId || `${partnerId}` !== `${paramId}`;

        if (this.partnerId && isNotLoaded) {
          store.dispatch<AsyncEffect>(requestTPMPartnerDetails(this.partnerId)).then(() => {
            if (store.getState().tpmPartnerDetails.error) {
              updateAppLocation(PARTNERS_PAGE);
            }
          });
        } else {
          this.partnerDetails = partnerDetailsState.data as IActivityTpmPartner;
          this.checkTab();
        }
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.partnerDetailsUnsubscribe();
    this.routeDetailsUnsubscribe();
  }

  getTabElement(): TemplateResult {
    switch (this.activeTab) {
      case DETAILS_TAB:
        return html` <partner-details-tab .partnerId="${this.partnerId}"></partner-details-tab> `;
      case ATTACHMENTS_TAB:
        return html` <partner-attachments-tab .partnerDetails="${this.partnerDetails}"></partner-attachments-tab> `;
      default:
        return html``;
    }
  }

  onSelect(selectedTab: HTMLElement): void {
    const tabName: string = selectedTab.getAttribute('name') || '';
    if (this.activeTab === tabName) {
      return;
    }
    updateAppLocation(`partners/${this.partnerId}/${tabName}`);
  }

  hideExportButton(partnerDetails: IActivityTpmPartner | null): boolean {
    return !partnerDetails?.id;
  }

  export(e: any): void {
    e.currentTarget.blur();
    this.trackAnalytics(e);
    const url: string = getEndpoint(TPM_PARTNER_EXPORT, {id: this.partnerDetails!.id}).url;
    window.open(url, '_blank');
  }

  private checkTab(): void {
    const {params}: IRouteDetails = store.getState().app.routeDetails;
    const activeTab: string | null = params && (params.tab as string);
    this.activeTab = `${activeTab}`;
    this.isLoad = false;
  }
}
