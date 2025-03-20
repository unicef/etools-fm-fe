import {css, LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {updateAppLocation} from '../../../../routing/routes';
import '../../../common/layout/page-content-header/page-content-header';
import '@unicef-polymer/etools-modules-common/dist/layout/etools-tabs';
import '../../../common/layout/status/etools-status';
import {RouterStyles} from '../../../app-shell/router-style';
// eslint-disable-next-line
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';

import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {SharedStyles} from '../../../styles/shared-styles';
import {tpmPartnerDetailsData} from '../../../../redux/selectors/tpm-partner-details.selectors';
import {tpmPartnerDetails} from '../../../../redux/reducers/tpm-partner-details.reducer';
import {requestTPMPartnerDetails} from '../../../../redux/effects/tpm-partner-details.effects';
import {Unsubscribe} from 'redux';
import {PARTNERS_PAGE} from '../partners-page';
import {translate, get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {SaveRoute} from '../../../../redux/actions/app.actions';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {TPM_PARTNER_EXPORT} from '../../../../endpoints/endpoints-list';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {applyPageTabsTranslation} from '../../../utils/translation-helper';
import {activeLanguageSelector} from '../../../../redux/selectors/active-language.selectors';

store.addReducers({tpmPartnerDetails});

const PAGE = PARTNERS_PAGE;
const SUB_ROUTE = 'item';
const DETAILS_TAB = 'details';
const ATTACHMENTS_TAB = 'attachments';

const PARTNER_DETAILS_TABS: PageTab[] = [
  {
    tab: DETAILS_TAB,
    tabLabel: `TPM_DETAILS.TABS.${DETAILS_TAB}`,
    hidden: false
  },
  {
    tab: ATTACHMENTS_TAB,
    tabLabel: `TPM_DETAILS.TABS.${ATTACHMENTS_TAB}`,
    hidden: false
  }
];

@customElement('partner-details')
export class PartnerDetailsComponent extends MatomoMixin(LitElement) {
  @property() partnerId: string | null = null;
  @property() partnerDetails: IActivityTpmPartnerExtended | null = null;
  @property() isStatusUpdating = false;
  @property() activeTab!: string;
  @property() pageTabs: PageTab[] = applyPageTabsTranslation(PARTNER_DETAILS_TABS);

  private partnerDetailsUnsubscribe!: Unsubscribe;
  private routeDetailsUnsubscribe!: Unsubscribe;
  private activeLanguageUnsubscribe!: Unsubscribe;
  private isLoad = false;

  static get styles(): CSSResultArray {
    return [
      SharedStyles,
      pageContentHeaderSlottedStyles,
      pageLayoutStyles,
      RouterStyles,
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
          font-size: var(--etools-font-size-16, 16px);
          color: var(--secondary-text-color);
        }
        .icon-wrapper etools-icon {
          display: none;
          border-radius: 50%;
          text-align: center;
          padding: 2px;
          --etools-icon-font-size: var(--etools-font-size-18, 18px);
        }

        .icon-wrapper.autorenew etools-icon[name='autorenew'] {
          background: var(--module-success);
          color: #ffffff;
          display: inline-block;
        }

        .icon-wrapper.info etools-icon[name='info'] {
          background: #3a94ff;
          color: #ffffff;
          display: inline-block;
        }

        .icon-wrapper.block etools-icon[name='block'] {
          background: var(--module-warning);
          color: #ffffff;
          display: inline-block;
        }

        .icon-wrapper.delete-forever etools-icon[name='delete-forever'] {
          color: var(--module-error);
          display: inline-block;
        }

        @media (max-width: 576px) {
          h1 {
            font-size: var(--etools-font-size-18, 18px);
            width: 100%;
          }
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
          <div class="layout-horizontal layout-wrap">
            <etools-button
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
            </etools-button>
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
        </div>

        <etools-tabs-lit
          id="tabs"
          slot="tabs"
          .tabs="${this.pageTabs}"
          @sl-tab-show="${({detail}: any) => this.onSelect(detail.name)}"
          .activeTab="${this.activeTab}"
        ></etools-tabs-lit>
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

    this.activeLanguageUnsubscribe = store.subscribe(
      activeLanguageSelector(() => (this.pageTabs = applyPageTabsTranslation(PARTNER_DETAILS_TABS)))
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.partnerDetailsUnsubscribe();
    this.routeDetailsUnsubscribe();
    this.activeLanguageUnsubscribe();
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

  onSelect(tabName: string): void {
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
