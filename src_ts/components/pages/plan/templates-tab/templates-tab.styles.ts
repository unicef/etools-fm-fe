import { css, CSSResult } from 'lit-element';
// language=CSS
export const TemplatesStyles: CSSResult = css`
    section.filters-container {
        padding: 0;
    }

    section.filters-container .filter {
        padding: 10px 23px;
        border-right: 1px solid #C4C4C4;
    }

    section.filters-container .filter:last-child { border-right: none; }

    section.filters-container .filter etools-dropdown { width: auto; }

    .templates-table-section { padding: 0; }

    .checkbox-container { margin-right: 24px; width: 18px; }

    .detail-placeholder { color: rgba(0, 0, 0, 0.38); }

    .methods { font-weight: 500; }

    .details-input {
        position: fixed !important;
        z-index: 100;
        background-color: #fafafa;
        padding: 16px;
        box-sizing: border-box;
    }
`;
