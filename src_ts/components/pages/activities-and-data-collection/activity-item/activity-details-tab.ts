import { CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { elevationStyles } from '../../../styles/elevation-styles';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { hasPermission, Permissions } from '../../../../config/permissions';
import { translate } from '../../../../localization/localisation';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { CardStyles } from '../../../styles/card-styles';
import '../../../common/location-widget/location-widget';

@customElement('activity-details-tab')
export class ActivityDetailsTab extends LitElement {
    @property()
    public edit: GenericObject = {
        visitDetails: false
    };
    @property()
    public location: string = '692';
    @property() public sites: number[] = [3, 4, 12389];

    // language=HTML
    public render(): TemplateResult {
        return html`
        <section class="elevation card-container page-content" elevation="1">
            <div class="card-title-box with-bottom-line">
                <div class="card-title">${ translate('ACTIVITY_ITEM.VISIT_DETAILS')}</div>
                <div class="buttons-container">
                    <paper-icon-button
                        @tap="${() => (this.edit.visitDetails = true)}"
                        class="panel-button"
                        ?hidden="${ !hasPermission(Permissions.EDIT_VISIT_DETAILS) }"
                        icon="create"></paper-icon-button>
                </div>
            </div>
            <div class="card-content layout vertical">
                <location-widget multiple-sites .selectedLocation="${ this.location || null }" .selectedSites="${ this.sites }" @sites-changed="${ ({ detail }: CustomEvent) => console.log('', detail.sites) }" @location-changed="${ ({ detail }: CustomEvent) => console.log('location', detail.location) }"></location-widget>
            </div>
        </section>
        <section class="elevation card-container page-content" elevation="1">
            <div class="card-title-box with-bottom-line">${ translate('ACTIVITY_ITEM.MONITOR_INFO')}</div>
            <div class="card-content layout vertical">
            </div>
        </section>
        <section class="elevation card-container page-content" elevation="1">
            <div class="card-title-box with-bottom-line">${ translate('ACTIVITY_ITEM.ENTRIES_TO_MONITOR')}</div>
            <div class="card-content layout vertical">
            </div>
        </section>
        `;
}

    public static get styles(): CSSResult[] {
        return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles];
    }
}
