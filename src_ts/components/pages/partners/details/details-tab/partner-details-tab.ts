import {CSSResult, LitElement, PropertyValues, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import './partner-information/partner-information';
import './partner-contacts/partner-contacts';
import {store} from '../../../../../redux/store';
import {TPMPartnerDetailsActions} from '../../../../../redux/actions/tpm-partners-details.actions';

@customElement('partner-details-tab')
export class PartnerDetailsTab extends LitElement {
  @property() partnerId: string | null = null;

  static get styles(): CSSResult[] {
    return [pageLayoutStyles];
  }

  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('partnerId')) {
      if (!this.partnerId) {
        store.dispatch({
          type: TPMPartnerDetailsActions.TPM_PARTNER_DETAILS_GET_SUCCESS,
          payload: [null, null]
        });
      }
    }
  }

  render(): TemplateResult {
    // language=HTML
    return html`<partner-information></partner-information> <partner-contacts></partner-contacts>`;
  }
}
