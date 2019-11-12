import {css, CSSResult} from 'lit-element';
// language=CSS
export const DataCollectionCardStyles: CSSResult = css`
  .overall-finding {
    padding: 15px 25px 20px 45px;
    background-color: var(--secondary-background-color);
  }
  .finding-container {
    border-bottom: 1px solid var(--light-divider-color);
  }
  .finding-container:last-child {
    /*border-bottom: none;*/
  }
`;
