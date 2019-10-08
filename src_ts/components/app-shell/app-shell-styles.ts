import '@polymer/iron-flex-layout/iron-flex-layout';
import { css, CSSResult } from 'lit-element';

// language=CSS
export const AppShellStyles: CSSResult = css`
    :host {
        display: block;
    }

    app-header-layout {
        position: relative;
    }

    .main-content {
        @apply --layout-flex;
    }
`;
