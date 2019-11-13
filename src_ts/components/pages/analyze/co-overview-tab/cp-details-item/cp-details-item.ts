import { CSSResult, customElement, LitElement, property, TemplateResult } from 'lit-element';

import { CpDetailsItemStyles } from './cp-details-item.styles';
import { template } from './cp-details-item.tpl';

import { FlexLayoutClasses } from '../../../../styles/flex-layout-classes';
import { pageLayoutStyles } from '../../../../styles/page-layout-styles';
import { elevationStyles } from '../../../../styles/elevation-styles';
import { leafletStyles } from '../../../../styles/leaflet-styles';
import { SharedStyles } from '../../../../styles/shared-styles';
import { CardStyles } from '../../../../styles/card-styles';

@customElement('cp-details-item')
export class CpDetailsItem extends LitElement {

    @property({ type: Object })
    public fullReport: any;

    public constructor() {
        super();
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    public static get styles(): CSSResult[] {
        return [
            CpDetailsItemStyles,
            elevationStyles,
            SharedStyles,
            pageLayoutStyles,
            FlexLayoutClasses,
            CardStyles,
            leafletStyles
        ];
    }
}
