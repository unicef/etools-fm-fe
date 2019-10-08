import { CSSResultArray, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import '../../common/layout/page-content-header/page-content-header';
import { addTranslates, ENGLISH } from '../../../localization/localisation';
import { ACTIVITIES_LIST_TRANSLATES } from '../../../localization/en/activities-and-data-collection/activities-list.translates';
import { ACTIVITY_ITEM_TRANSLATES } from '../../../localization/en/activities-and-data-collection/activity-item.translates';
import { store } from '../../../redux/store';
import { activities } from '../../../redux/reducers/activities.reducer';
import { SharedStyles } from '../../styles/shared-styles';
import { pageContentHeaderSlottedStyles } from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import { buttonsStyles } from '../../styles/button-styles';
import { routeDetailsSelector } from '../../../redux/selectors/app.selectors';
import { RouterStyles } from '../../app-shell/router-style';
import { pageLayoutStyles } from '../../styles/page-layout-styles';

addTranslates(ENGLISH, [ACTIVITIES_LIST_TRANSLATES, ACTIVITY_ITEM_TRANSLATES]);
store.addReducers({ activities });

const PAGE: string = 'activities';

const LIST_ROUTE: string = 'list';
const ITEM_ROUTE: string = 'item';

@customElement('activities-page')
export class ActivitiesPageComponent extends LitElement {
    @property() public subRoute: string = LIST_ROUTE;
    public render(): TemplateResult | void {
        return html`
            <activities-list class="page" ?active="${this.isActivePage(this.subRoute, LIST_ROUTE)}"></activities-list>
            <activity-item class="page" ?active="${this.isActivePage(this.subRoute, ITEM_ROUTE)}"></activity-item>
        `;
    }

    public static get styles(): CSSResultArray {
        return [SharedStyles, pageContentHeaderSlottedStyles, pageLayoutStyles, RouterStyles, buttonsStyles];
    }

    public connectedCallback(): void {
        super.connectedCallback();
        store.subscribe(routeDetailsSelector(({ routeName, subRouteName }: IRouteDetails) => {
            if (routeName !== PAGE) { return; }
            this.subRoute = subRouteName as string;
        }));
    }

    public isActivePage(currentRoute: string, expectedRoute: string): boolean {
        return currentRoute === expectedRoute;
    }
}
