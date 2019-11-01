import { CSSResultArray, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import '../../common/layout/page-content-header/page-content-header';
import { addTranslates, ENGLISH } from '../../../localization/localisation';
import { ACTIVITIES_LIST_TRANSLATES } from '../../../localization/en/activities-and-data-collection/activities-list.translates';
import { store } from '../../../redux/store';
import { activities } from '../../../redux/reducers/activities.reducer';
import { SharedStyles } from '../../styles/shared-styles';
import { pageContentHeaderSlottedStyles } from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import { buttonsStyles } from '../../styles/button-styles';
import { routeDetailsSelector } from '../../../redux/selectors/app.selectors';
import { RouterStyles } from '../../app-shell/router-style';
import { pageLayoutStyles } from '../../styles/page-layout-styles';

addTranslates(ENGLISH, [ACTIVITIES_LIST_TRANSLATES]);
store.addReducers({ activities });

const PAGE: string = 'activities';

const LIST_ROUTE: string = 'list';
const ITEM_ROUTE: string = 'item';
const COLLECT_ROUTE: string = 'data-collection';

@customElement('activities-page')
export class ActivitiesPageComponent extends LitElement {
    @property() public subRoute: string = LIST_ROUTE;
    public render(): TemplateResult | void {
        return html`
            ${ this.getPage() }
        `;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        store.subscribe(routeDetailsSelector(({ routeName, subRouteName }: IRouteDetails) => {
            if (routeName !== PAGE) { return; }
            this.subRoute = subRouteName as string;
        }));
    }

    public getPage(): TemplateResult {
        switch (this.subRoute) {
            case LIST_ROUTE:
                return html`<activities-list class="page" active></activities-list>`;
            case ITEM_ROUTE:
                return html`<activity-item class="page" active></activity-item>`;
            case COLLECT_ROUTE:
                return html`<data-collection-checklist class="page" active></data-collection-checklist>`;
            default:
                return html``;
        }
    }

    public static get styles(): CSSResultArray {
        return [SharedStyles, pageContentHeaderSlottedStyles, pageLayoutStyles, RouterStyles, buttonsStyles];
    }
}
