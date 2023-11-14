import {css, LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {updateAppLocation} from '../../../../routing/routes';
import '../../../common/layout/page-content-header/page-content-header';
import '../../../common/layout/etools-tabs';
import '../../../common/layout/status/etools-status';
import {RouterStyles} from '../../../app-shell/router-style';
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import {buttonsStyles} from '@unicef-polymer/etools-unicef/src/styles/button-styles';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {SharedStyles} from '../../../styles/shared-styles';
import {tpmPartnerDetailsData} from '../../../../redux/selectors/tpm-partner-details.selectors';
import {tpmPartnerDetails} from '../../../../redux/reducers/tpm-partner-details.reducer';
import {requestTPMPartnerDetails} from '../../../../redux/effects/tpm-partner-details.effects';
import {Unsubscribe} from 'redux';
import {PARTNERS_PAGE} from '../partners-page';
import {translate, get as getTranslation} from 'lit-translate';
import {SaveRoute} from '../../../../redux/actions/app.actions';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {TPM_PARTNER_EXPORT} from '../../../../endpoints/endpoints-list';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

store.addReducers({tpmPartnerDetails});

const PAGE = PARTNERS_PAGE;
const SUB_ROUTE = 'item';
const DETAILS_TAB = 'details';
const ATTACHMENTS_TAB = 'attachments';

@customElement('partner-details')
export class PartnerDetailsComponent extends MatomoMixin(LitElement) {
  @property() partnerId: string | null = null;
  @property() partnerDetails: IActivityTpmPartnerExtended | null = null;
  @property() isStatusUpdating = false;
  @property() activeTab!: string;

  pageTabs: PageTab[] = [
    {
      tab: DETAILS_TAB,
      tabLabel: getTranslation(`TPM_DETAILS.TABS.${DETAILS_TAB}`),
      hidden: false
    },
    {
      tab: ATTACHMENTS_TAB,
      tabLabel: getTranslation(`TPM_DETAILS.TABS.${ATTACHMENTS_TAB}`),
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
        .status-container {
          display: flex;
          padding: 6px 10px;
        }
        .status-header {
          margin-left: 8px;
          font-weight: bold;
          font-size: 16px;
          color: var(--secondary-text-color);
        }
        .icon-wrapper iron-icon {
          display: none;
          border-radius: 50%;
          text-align: center;
          padding: 2px;
          --iron-icon-height: 18px;
          --iron-icon-width: 18px;
        }

        .icon-wrapper.autorenew iron-icon[icon='autorenew'] {
          background: var(--module-success);
          color: #ffffff;
          display: inline-block;
        }

        .icon-wrapper.info iron-icon[icon='info'] {
          background: #3a94ff;
          color: #ffffff;
          display: inline-block;
        }

        .icon-wrapper.block iron-icon[icon='block'] {
          background: var(--module-warning);
          color: #ffffff;
          display: inline-block;
        }

        .icon-wrapper.delete-forever iron-icon[icon='delete-forever'] {
          color: var(--module-error);
          display: inline-block;
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
          <sl-button
              class="neutral"
              variant="text"
              target="_blank"
              id="export"
              @click="${this.export}"
              tracker="Export PDF"
              ?hidden="${this.hideExportButton(this.partnerDetails)}"
            >
              <etools-icon name="file-download" slot="prefix"></etools-icon>
              ${translate('ACTIVITY_DETAILS.EXPORT')}
          </sl-button>
          <div class="status-container">
            <div class="status-icon">
              <span class="icon-wrapper ${this.getVisionStatusClassOrText(this.partnerDetails, false)}">
                <etools-icon name="info"></etools-icon>
                <etools-icon name="autorenew"></etools-icon>
                <etools-icon name="block"></etools-icon>
                <etools-icon name="delete-forever"></etools-icon>
              </span>
            </div>

            <div class="status">
              <span class="status-header">${this.getVisionStatusClassOrText(this.partnerDetails, true)}</span>
            </div>
          </div>
        </div>

        <etools-tabs
          id="tabs"
          slot="tabs"
          .tabs="${this.pageTabs}"
          @iron-select="${({detail}: any) => this.onSelect(detail.item)}"
          .activeTab="${this.activeTab}"
        ></etools-tabs>
      </page-content-header>

      ${this.isLoad ? html`` : this.getTabElement()}
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    store.dispatch(new SaveRoute(null));
    this.isLoad = true;
    // On Partner data changes
    this.partnerDetailsUnsubscribe = store.subscribe(
      tpmPartnerDetailsData((data: IActivityTpmPartnerExtended | null) => {
        if (!data) {
          return;
        }
        this.partnerDetails = data;
        this.checkTab();
      }, false)
    );

    // On Route changes
    this.routeDetailsUnsubscribe = store.subscribe(
      routeDetailsSelector(({routeName, subRouteName, params}: EtoolsRouteDetails) => {
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
          this.partnerDetails = partnerDetailsState.data;
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

  getVisionStatusClassOrText(partnerDetails: IActivityTpmPartnerExtended | null, getText: boolean): string {
    if (!partnerDetails) {
      return '';
    }
    const {vision_synced: synced, blocked, deleted_flag: deleted} = partnerDetails;

    if (!synced) {
      return getText ? getTranslation('TPM.NOT_SYNCED') : 'info';
    } else if (deleted) {
      return getText ? getTranslation('TPM.MARKED_FOR_DELETION_IN_VISION') : 'delete-forever';
    } else if (blocked) {
      return getText ? getTranslation('TPM.BLOCKED_IN_VISION') : 'block';
    } else {
      return getText ? getTranslation('TPM.SYNCED_FROM_VISION') : 'autorenew';
    }
  }

  checkTab(): void {
    const {params}: EtoolsRouteDetails = store.getState().app.routeDetails;
    const activeTab: string | null = params && (params.tab as string);
    this.activeTab = `${activeTab}`;
    this.isLoad = false;
  }
}
