import { CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { elevationStyles } from '../../../../styles/elevation-styles';
import { SharedStyles } from '../../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../../styles/page-layout-styles';
import { store } from '../../../../../redux/store';
import { activityChecklist } from '../../../../../redux/reducers/activity-checklist.reducer';
import { Unsubscribe } from 'redux';
import { loadActivityChecklist } from '../../../../../redux/effects/activity-checklist.effects';
import { activityChecklistData } from '../../../../../redux/selectors/activity-checklist.selectors';
import { addTranslates, ENGLISH, translate } from '../../../../../localization/localisation';
import { ACTIVITY_REVIEW_TRANSLATES } from '../../../../../localization/en/activities-and-data-collection/activity-review.translates';
import { FlexLayoutClasses } from '../../../../styles/flex-layout-classes';
import { CardStyles } from '../../../../styles/card-styles';
import './review-checklist-item/review-checklist-item';
import { loadStaticData } from '../../../../../redux/effects/load-static-data.effect';

addTranslates(ENGLISH, ACTIVITY_REVIEW_TRANSLATES);
store.addReducers({ activityChecklist });

@customElement('activity-review-tab')
export class ActivityReviewTab extends LitElement {
    @property() public methods: GenericObject<string> = {};
    @property({ type: Number }) public set activityId(id: number | null) {
        if (!id) { return; }
        this._activityId = id;
        store.dispatch<AsyncEffect>(loadActivityChecklist(id, true));
    }

    public get activityId(): number | null {
        return this._activityId;
    }

    @property() protected sortedChecklists: IChecklistByMethods[] = [];

    private _activityId: number | null = null;
    private activityChecklistUnsubscribe!: Unsubscribe;

    // language=HTML
    public render(): TemplateResult {
        return html`
            ${ this.sortedChecklists.map((sortedChecklist: IChecklistByMethods) => html`
                <section class="elevation page-content card-container question-table-section" elevation="1">
                    <div class="card-title-box with-bottom-line">
                        <div class="card-title">${ this.methods[sortedChecklist.method] }</div>
                    </div>

                    ${ Object
                        .entries(sortedChecklist.checklist)
                        .map(([targetTitle, items]: [string, IChecklistItem[]]) => html`
                            <review-checklist-item .itemTitle="${ targetTitle }" .checklist="${ items }"></review-checklist-item>
                        `) }
                </section>
            `) }
        `;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.activityChecklistUnsubscribe = store.subscribe(activityChecklistData((checklist: IChecklistItem[] | null) => {
            if (!checklist) { return; }

            const sortedByMethods: GenericObject<IChecklistItem[]> = this.sortByMethods(checklist);
            this.sortedChecklists = Object
                .entries(sortedByMethods)
                .map(([methodId, checklistItems]: [string, IChecklistItem[]]) => {
                    return {
                        method: Number(methodId),
                        checklist: this.sortByTarget(checklistItems)
                    };
                });
        }, false));

        const data: EtoolsMethod[] = store.getState().staticData.methods;
        if (data) {
            this.methods = this.createMethodsLib(data);
        } else {
            store.dispatch<AsyncEffect>(loadStaticData('methods'))
                .then((fetchedData: any) => this.methods = this.createMethodsLib(fetchedData));
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.activityChecklistUnsubscribe();
    }

    private sortByMethods(checklist: IChecklistItem[]): GenericObject<IChecklistItem[]> {
        return checklist.reduce((sorted: GenericObject<IChecklistItem[]>, item: IChecklistItem) => {
            item.question.methods.forEach((method: number) => {
                if (!sorted[method]) { sorted[method] = []; }
                sorted[method].push(item);
            });

            return sorted;
        }, {});
    }

    private sortByTarget(checklist: IChecklistItem[]): GenericObject<IChecklistItem[]> {
        return checklist.reduce((sorted: GenericObject<IChecklistItem[]>, item: IChecklistItem) => {
            let key: string;
            if (item.partner) {
                key = `${ translate('LEVELS_OPTIONS.PARTNER') }: ${ item.partner.name }`;
            } else if (item.cp_output) {
                key = `${ translate('LEVELS_OPTIONS.OUTPUT') }: ${ item.cp_output.name }`;
            } else if (item.intervention) {
                key = `${ translate('LEVELS_OPTIONS.INTERVENTION') }: ${ item.intervention.title }`;
            } else {
                return sorted;
            }

            if (!sorted[key]) {
                sorted[key] = [];
            }
            sorted[key].push(item);
            return sorted;
        }, {});
    }

    private createMethodsLib(methods: EtoolsMethod[]): GenericObject<string> {
        return methods.reduce((lib: GenericObject<string>, method: EtoolsMethod) => {
            lib[method.id] = method.name;
            return lib;
        }, {});
    }

    public static get styles(): CSSResult[] {
        return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles];
    }
}