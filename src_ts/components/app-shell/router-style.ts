import {css, CSSResult} from 'lit-element';

// language=CSS
export const RouterStyles: CSSResult = css`
  .page {
    display: none;
  }

  .page[active] {
    display: block;
  }
`;
