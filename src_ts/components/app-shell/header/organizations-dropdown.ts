import {connect} from 'pwa-helpers/connect-mixin.js';
import {store} from '../../../redux/store';
import '@unicef-polymer/etools-dropdown/etools-dropdown.js';
import {logError} from '@unicef-polymer/etools-behaviors/etools-logging';
import {EtoolsDropdownEl} from '@unicef-polymer/etools-dropdown/etools-dropdown.js';
import {customElement, LitElement, html, property, query, TemplateResult} from 'lit-element';

import {fireEvent} from '@unicef-polymer/etools-modules-common/dist/utils/fire-custom-event';
import {countriesDropdownStyles} from './countries-dropdown-styles';
import {get as getTranslation, translate} from 'lit-translate';
import {updateAppLocation} from '../../../routing/routes';
import {ROOT_PATH} from '../../../config/config';
import {changeCurrentUserOrganization} from '../../../redux/effects/organization.effects';
import {organizationSelector} from '../../../redux/selectors/organization.selectors';
import {GlobalLoadingUpdate} from '../../../redux/actions/global-loading.actions';
import {isEmpty} from 'ramda';
import {etoolsCustomDexieDb} from '../../../endpoints/dexieDb';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {EtoolsRedirectPath} from '@unicef-polymer/etools-utils/dist/enums/router.enum';

/**
 * @LitElement
 * @customElement
 */
@customElement('organizations-dropdown')
export class organizationsDropdown extends connect(store)(LitElement) {
  @property({type: Number})
  currentOrganizationId!: number | null;

  @property({type: Array})
  organizations: any[] = [];

  @property({type: Object})
  user!: IEtoolsUserModel;

  @query('#organizationSelector') private organizationSelectorDropdown!: EtoolsDropdownEl;

  constructor() {
    super();
    store.subscribe(
      organizationSelector((organizationState: IRequestState) => {
        this.changeRequestStatus(organizationState.isRequest.load);
        if (organizationState.isRequest.load) {
          return;
        }
        if (!organizationState.error) {
          this.handleChangedOrganization();
        }
        if (!organizationState.isRequest && organizationState.error && !isEmpty(organizationState.error)) {
          this.handleOrganizationChangeError(organizationState.error);
        }
      })
    );
  }

  render(): TemplateResult {
    return html`
      ${countriesDropdownStyles}
      <etools-dropdown
        id="organizationSelector"
        placeholder="${translate('SELECT_ORGANIZATION')}"
        class="w100 ${this.checkMustSelectOrganization(this.user)}"
        .selected="${this.currentOrganizationId}"
        allow-outside-scroll
        no-label-float
        .options="${this.organizations}"
        option-label="name"
        option-value="id"
        trigger-value-change-event
        @etools-selected-item-changed="${this.onOrganizationChange}"
        hide-search
      ></etools-dropdown>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    setTimeout(() => {
      const fitInto: HTMLElement | null = document
        .querySelector('app-shell')!
        .shadowRoot!.querySelector('#appHeadLayout');
      this.organizationSelectorDropdown.fitInto = fitInto;
    }, 0);
  }

  stateChanged(state: IRootState): void {
    if (!state.user || !state.user.data || JSON.stringify(this.user) === JSON.stringify(state.user.data)) {
      return;
    }

    this.user = state.user.data;
    this.organizations = this.user.organizations_available;
    this.currentOrganizationId = this.user.organization?.id || null;
  }

  checkMustSelectOrganization(user: IEtoolsUserModel): string {
    if (user && !user.organization) {
      setTimeout(() => {
        fireEvent(this, 'toast', {text: getTranslation('SELECT_ORGANIZATION')});
      }, 2000);
      return 'warning';
    }
    return '';
  }

  protected changeRequestStatus(isRequest: boolean): void {
    const detail: any = isRequest
      ? {
          message: 'Please wait while organization data is changing...',
          active: true,
          loadingSource: 'organization-change'
        }
      : {
          active: false,
          loadingSource: 'organization-change'
        };
    fireEvent(this, 'global-loading', detail);
    if (
      detail.message ||
      (!detail.message &&
        store.getState().globalLoading.message?.includes('Please wait while organization data is changing...'))
    ) {
      store.dispatch(new GlobalLoadingUpdate(detail.message));
    }
  }

  protected handleChangedOrganization(): void {
    updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.DEFAULT));
    document.location.assign(window.location.origin + ROOT_PATH);
  }

  protected handleOrganizationChangeError(error: any): void {
    logError('Organization change failed!', 'organization-dropdown', error);
    this.organizationSelectorDropdown.selected = this.currentOrganizationId;
    fireEvent(this, 'toast', {text: getTranslation('ERROR_CHANGING_ORGANIZATION')});
  }

  protected onOrganizationChange(e: CustomEvent): void {
    if (!e.detail.selectedItem) {
      return;
    }

    const selectedOrganizationId = parseInt(e.detail.selectedItem.id, 10);

    if (selectedOrganizationId !== this.currentOrganizationId) {
      // send post request to change_organization endpoint
      this.triggerOrganizationChangeRequest(selectedOrganizationId);
    }
  }

  protected triggerOrganizationChangeRequest(selectedOrganizationId: number): void {
    localStorage.clear();
    etoolsCustomDexieDb.delete().finally(() => {
      store.dispatch<AsyncEffect>(changeCurrentUserOrganization(selectedOrganizationId));
    });
  }
}
