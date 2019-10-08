import { css, CSSResult } from 'lit-element';
// language=CSS
export const QuestionsTabStyles: CSSResult = css`
    :host {
        position: relative;
        display: block;
    }

    .question-table-section {
        padding: 0;
    }

    .editable-row .hover-block {
        padding: 0 20px;
    }

    .question-filters-section {
        padding: 0 30px;
    }

    .row-details-content div.image img {
        width: 15px;
    }
`;
