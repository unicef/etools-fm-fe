import {html, LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
// These are the shared styles needed by this element.
import {SharedStyles} from '../styles/shared-styles';
import {ROOT_PATH} from '../../config/config';
import {pageLayoutStyles} from '../styles/page-layout-styles';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {translate} from 'lit-translate';

/**
 * @customElement
 * @LitElement
 */
@customElement('page-not-found')
export class PageNotFound extends LitElement {
  @property({type: String})
  rootPath: string = ROOT_PATH;

  static get styles(): CSSResultArray {
    return [elevationStyles, SharedStyles, pageLayoutStyles];
  }

  render(): TemplateResult {
    return html`
      <section class="page-content elevation" elevation="1">
        <h2>${translate('PAGE_NOT_FOUND.HEADER')}</h2>
        <p>
          ${translate('PAGE_NOT_FOUND.CONTENT_DOESNT_EXIST')}<a href="${this.rootPath}"
            >${translate('PAGE_NOT_FOUND.HOME')}</a
          >${translate('PAGE_NOT_FOUND.TRY_AGAIN')}
        </p>
      </section>
    `;
  }
}
