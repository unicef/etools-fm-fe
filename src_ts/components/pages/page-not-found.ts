import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';

// These are the shared styles needed by this element.
import { SharedStyles } from '../styles/shared-styles';
import { ROOT_PATH } from '../../config/config';

/**
 * @customElement
 * @LitElement
 */
@customElement('page-not-found')
export class PageNotFound extends LitElement {

    @property({ type: String })
    public rootPath: string = ROOT_PATH;

    public render(): TemplateResult {
    return html`
          <style include="paper-material-styles"></style>
          ${SharedStyles}
          <section class="paper-material" elevation="1">
            <h2>Oops! You hit a 404</h2>
            <p>The page you're looking for doesn't seem to exist. Head back
               <a href="${this.rootPath}">home</a> and try again?
            </p>
          </section>
    `;
    }
}
