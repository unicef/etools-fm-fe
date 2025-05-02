import {html, LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement} from 'lit/decorators.js';
// These are the shared styles needed by this element.
import {SharedStyles} from '../../styles/shared-styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';

/**
 * @customElement
 * @LitElement
 */
@customElement('page-not-found')
export class PageNotFound extends LitElement {
  static get styles(): CSSResultArray {
    return [elevationStyles, SharedStyles, pageLayoutStyles];
  }

  render(): TemplateResult {
    return html`
      <section class="page-content elevation" elevation="1">
        <h2>${translate('PAGE_NOT_FOUND.HEADER')}</h2>
        <p>
          ${translate('PAGE_NOT_FOUND.CONTENT_DOESNT_EXIST')}<a href="${Environment.basePath}"
            >${translate('PAGE_NOT_FOUND.HOME')}</a
          >${translate('PAGE_NOT_FOUND.TRY_AGAIN')}
        </p>
      </section>
    `;
  }
}
