import '@polymer/paper-styles/element-styles/paper-material-styles';
import '@polymer/paper-button/paper-button';

import { SharedStyles } from '../../styles/shared-styles';
import '../../common/layout/page-content-header/page-content-header';
import { pageContentHeaderSlottedStyles } from
        '../../common/layout/page-content-header/page-content-header-slotted-styles';
import { pageLayoutStyles } from '../../styles/page-layout-styles';
import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { ROOT_PATH } from '../../../config/config';

/**
 * @LitElement
 * @customElement
 */
@customElement('engagements-list')
export class EngagementsList extends LitElement {

    @property({ type: Array })
    public listData: GenericObject[] = [];

    private readonly rootPath: string = ROOT_PATH;

    public render(): TemplateResult {
        // main template
        // language=HTML
        return html`
          ${SharedStyles} ${pageContentHeaderSlottedStyles} ${pageLayoutStyles}
            <style>
                .paper-material {
                    @apply --paper-material;
                    @apply --paper-material-elevation-1;
                }
            </style>

          <page-content-header>
            <h1 slot="page-title">Engagements list</h1>

            <div slot="title-row-actions" class="content-header-actions">
              <paper-button raised>Export</paper-button>
            </div>
          </page-content-header>

          <section class="paper-material page-content" elevation="1">
            Engagements list will go here.... TODO<br>
            <a href="${this.rootPath}engagements/23/details">Go to engagement details pages :)</a>
          </section>
    `;
    }
}
