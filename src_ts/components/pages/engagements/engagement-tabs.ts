import '@polymer/polymer/lib/elements/dom-if';
import '@polymer/paper-styles/element-styles/paper-material-styles';
import '@polymer/paper-button/paper-button';
import '@unicef-polymer/etools-dialog/etools-dialog';

import { SharedStyles } from '../../styles/shared-styles';
import '../../common/layout/page-content-header/page-content-header';
import '../../common/layout/etools-tabs';
import { pageContentHeaderSlottedStyles }
    from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import '../../common/layout/status/etools-status';
import { pageLayoutStyles } from '../../styles/page-layout-styles';

import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../redux/store';
import { updateAppLocation } from '../../../routing/routes';
import { CSSResultArray, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { elevationStyles } from '../../styles/lit-styles/elevation-styles';
import { IDialogResponse, openDialog } from '../../utils/dialog';
import './testDialog';
import { ITestDialogRequest, ITestDialogResponse } from './testDialog';

/**
 * @polymer
 * @customElement
 */
@customElement('engagement-tabs')
export class EngagementTabs extends connect(store)(LitElement) {

    @property({ type: Array })
    public pageTabs: PageTab[] = [
        {
            tab: 'details',
            tabLabel: 'Details',
            hidden: false
        },
        {
            tab: 'questionnaires',
            tabLabel: 'Questionnaires‎',
            hidden: false
        }
    ];

    @property({ type: String })
    public activeTab: string = '';

    @property({ type: Object })
    public engagement: GenericObject = {
        id: 23,
        title: 'Engagement title'
    };

    @property({ type: Boolean })
    public testOpen: boolean = false;

    public static get styles(): CSSResultArray {
        return [elevationStyles];
    }

    public render(): TemplateResult {
        // main template
        // language=HTML
        return html`
              ${SharedStyles} ${pageContentHeaderSlottedStyles} ${pageLayoutStyles}
                <style>
                   .paper-material {
                        @apply --paper-material;
                        @apply --paper-material-elevation-1;
                    }
                </style>

              <etools-status></etools-status>

              <page-content-header with-tabs-visible>

                <h1 slot="page-title">${this.engagement.title}</h1>

                <div slot="title-row-actions" class="content-header-actions">
                  <paper-button raised @tap="${() => this.onTestDialog()}">Action 1</paper-button>
                  <paper-button raised>Action 2</paper-button>
                </div>

                <etools-tabs slot="tabs"
                             .tabs="${this.pageTabs}"
                             @iron-select="${({ detail }: any) => this.test(detail.item)}"
                             active-tab="${this.activeTab}"></etools-tabs>
              </page-content-header>

              <section class="elevation page-content" elevation="1">
                    ${this.getTab(this.activeTab)}
              </section>
    `;
    }

    public isActiveTab(tab: string, expectedTab: string): boolean {
        return tab === expectedTab;
    }

    public onTestDialog(): void {
        openDialog<ITestDialogRequest, ITestDialogResponse>({
                dialog: 'test-dialog',
                data: { test: 'is work' }
            })
            .then((detail: IDialogResponse<ITestDialogResponse>) => {
                console.log(detail);
            });
    }

    public stateChanged(state: IRootState): void {
        // update page route data
        if (state.app.routeDetails.routeName === 'engagements' &&
            state.app.routeDetails.subRouteName !== 'list') {
            const oldTab: string = this.activeTab;
            this.activeTab = state.app.routeDetails.subRouteName as string;
            this.tabChanged(this.activeTab, oldTab);
            const engagementId: string | number = state.app.routeDetails.params!.engagementId;
            if (engagementId) {
                this.engagement.id = engagementId;
            }
        }
    }

    public tabChanged(newTabName: string, oldTabName: string | undefined): void {
        if (!oldTabName) {
            // page load, tab init, component is gonna be imported in loadPageComponents action
            return;
        }
        if (newTabName !== oldTabName) {
            // go to new tab
            updateAppLocation(
                `engagements/${this.engagement.id}/${newTabName}`, true);
        }
    }

    public getTab(tabName: string): TemplateResult | '' {
        if (tabName === 'details') {
            return html`<engagement-details></engagement-details>`;
        } else if (tabName === 'questionnaires') {
            return html`<engagement-questionnaires></engagement-questionnaires>`;
        } else {
            return '';
        }
    }

    public test(selectedTab: HTMLElement): void {
        const tabName: string = selectedTab.getAttribute('name') || '';
        this.tabChanged(tabName, this.activeTab);
    }

}
