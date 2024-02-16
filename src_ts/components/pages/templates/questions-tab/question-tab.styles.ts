import {css, CSSResult} from 'lit';
// language=CSS
export const QuestionsTabStyles: CSSResult = css`
  :host {
    position: relative;
    display: block;
    --list-row-wrapper-padding-inline: 0;
  }

  .question-table-section {
    padding: 0;
  }
  .no-rm {
    margin-right: 0;
  }
  .no-lm {
    margin-left: 0;
  }
  .editable-row .hover-block {
    padding: 0 20px;
  }

  .question-filters-section {
    padding: 8px 30px;
  }

  .row-details-content div.image img {
    width: 15px;
  }
`;
