import { CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { pageLayoutStyles } from '../../../../styles/page-layout-styles';
import { addTranslates, ENGLISH, translate } from '../../../../../localization/localisation';
import { store } from '../../../../../redux/store';
import { Unsubscribe } from 'redux';
import '@unicef-polymer/etools-date-time/datepicker-lite';
import '../../../../common/layout/etools-card';
import '../../../../common/location-widget/location-widget';
import { ACTIVITY_DETAILS_TRANSLATES } from '../../../../../localization/en/activities-and-data-collection/activity-details.translates';
import { activityDetailsIsLoad } from '../../../../../redux/selectors/activity-details.selectors';
import { requestActivityDetails } from '../../../../../redux/effects/activity-details.effects';
import './visit-details';

addTranslates(ENGLISH, [ACTIVITY_DETAILS_TRANSLATES]);

@customElement('activity-details-tab')
export class ActivityDetailsTab extends LitElement {
    @property({ type: String }) public set activityId(id: string | null) {
        if (!id) { return; }
        store.dispatch<AsyncEffect>(requestActivityDetails(id));
    }
    @property() public activityDetails!: IActivityDetails;
    @property({ type: Boolean }) public isLoad: boolean = false;

    private isLoadUnsubscribe!: Unsubscribe;

    public connectedCallback(): void {
        super.connectedCallback();
        this.isLoadUnsubscribe = store.subscribe(activityDetailsIsLoad((isLoad: boolean | null) => {
            this.isLoad = Boolean(isLoad);
        }));
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.isLoadUnsubscribe();
    }

    public render(): TemplateResult {
        // language=HTML
        return html`
            <etools-loading ?active="${ this.isLoad }" loading-text="${ translate('MAIN.LOADING_DATA_IN_PROCESS') }"></etools-loading>
            <visit-details class="page-content" .data="${ this.activityDetails }"></visit-details>
            <etools-card class="page-content" title="${ translate('ACTIVITY_ITEM.MONITOR_INFO')}"></etools-card>
            <etools-card class="page-content" title="${ translate('ACTIVITY_ITEM.ENTRIES_TO_MONITOR')}"></etools-card>
        `;
    }

    public static get styles(): CSSResult[] {
        // language=CSS
        return [pageLayoutStyles];
    }
}
