import { html, TemplateResult } from 'lit-element';
// language=HTML
export const TemplatesSttyles: TemplateResult = html`
    <style>
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
    </style>
`;
