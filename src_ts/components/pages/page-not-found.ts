import {CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
// These are the shared styles needed by this element.
import {SharedStyles} from '../styles/shared-styles';
import {ROOT_PATH} from '../../config/config';
import {pageLayoutStyles} from '../styles/page-layout-styles';
import {elevationStyles} from '../styles/elevation-styles';

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
        <h2>Oops! You hit a 404</h2>
        <p>
          The page you're looking for doesn't seem to exist. Head back <a href="${this.rootPath}">home</a> and try
          again?
        </p>
      </section>
    `;
  }
}
