import { html, PolymerElement } from '@polymer/polymer/polymer-element';

// These are the shared styles needed by this element.
import { SharedStyles } from '../styles/shared-styles';

class PageNotFound extends PolymerElement {

    public static get template(): HTMLTemplateElement {
        return html`
          <style include="paper-material-styles"></style>
          ${SharedStyles}
          <section class="paper-material" elevation="1">
            <h2>Oops! You hit a 404</h2>
            <p>The page you're looking for doesn't seem to exist. Head back
               <a href$="[[rootPath]]">home</a> and try again?
            </p>
          </section>
    `;
    }
}

window.customElements.define('page-not-found', PageNotFound);
