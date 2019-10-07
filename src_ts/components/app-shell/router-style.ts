import { html, TemplateResult } from 'lit-element';

export const RouterStyles: TemplateResult = html`
<style>

    .page {
        display: none;
    }

    .page[active] {
        display: block;
    }

</style>
`;
