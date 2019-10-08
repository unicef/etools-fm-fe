import '@polymer/iron-flex-layout/iron-flex-layout.js';
import { css, CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';

/**
 * @LitElement
 * @customElement
 */
@customElement('page-content-header')
export class PageContentHeader extends LitElement {
    public static get is(): string {
        return 'page-content-header';
    }

    @property({ type: Boolean, reflect: true })
    public withTabsVisible: boolean = false;

    public render(): TemplateResult {
        // language=HTML
        return html`
            <div class="content-header-row title-row">
                <h1>
                    <slot name="page-title"></slot>
                </h1>
                <slot name="title-row-actions"></slot>
            </div>

            <div class="content-header-row tabs" hidden$="[[!withTabsVisible]]">
                <slot name="tabs"></slot>
            </div>
        `;
    }

    public static get styles(): CSSResult {
        // language=CSS
        return css`

            *[hidden] {
                display: none !important;
            }

            :host {
                @apply --layout-vertical;
                @apply --layout-start-justified;
                @apply --layout-flex;

                background-color: var(--primary-background-color);
                padding: 0 24px;
                min-height: 85px;
                border-bottom: 1px solid var(--dark-divider-color);

                --page-title: {
                    margin: 0;
                    font-weight: normal;
                    text-transform: capitalize;
                    font-size: 24px;
                    line-height: 1.3;
                    min-height: 31px;
                }
            }

            :host([with-tabs-visible]) {
                min-height: 114px;
            }

            .content-header-row {
                @apply --layout-horizontal;
                @apply --layout-start-justified;
            }

            .title-row {
                @apply --layout-center;
                margin: 30px 0 0;
                padding: 0 24px;
                height: 36px;
            }

            .title-row h1 {
                @apply --layout-flex;
                @apply --page-title;
            }

            .tabs {
                margin-top: 5px;
            }

            @media print {
                :host {
                    padding: 0;
                    border-bottom: none;
                    min-height: 0 !important;
                    margin-bottom: 16px;
                }

                .title-row h1 {
                    font-size: 18px;
                }
            }
        `;
    }

}
