import {css, CSSResult} from 'lit';

// language=CSS
export const RouterStyles: CSSResult = css`
  .page {
    display: none;
  }

  .page[active] {
    display: block;
  }
`;
