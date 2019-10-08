import { css, CSSResult } from 'lit-element';

export const RouterStyles: CSSResult = css`
    .page {
        display: none;
    }

    .page[active] {
        display: block;
    }
`;
