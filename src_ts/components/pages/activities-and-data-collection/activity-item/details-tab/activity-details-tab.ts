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
import './activity-details-card';
import './monitor-information-card';
import './entities-monitor-card';

addTranslates(ENGLISH, [ACTIVITY_DETAILS_TRANSLATES]);

@customElement('activity-details-tab')
export class ActivityDetailsTab extends LitElement {
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
            <activity-details-card class="page-content"></activity-details-card>
            <monitor-information-card class="page-content"></monitor-information-card>
            <entities-monitor-card class="page-content"></entities-monitor-card>
        `;
    }

    public static get styles(): CSSResult[] {
        // language=CSS
        return [pageLayoutStyles];
    }
}
