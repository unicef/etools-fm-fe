import { CSSResult, customElement, LitElement, property, query, TemplateResult } from 'lit-element';
import { template } from './templates-tab.tpl';
import { elevationStyles } from '../../../styles/lit-styles/elevation-styles';
import { updateQueryParams } from '../../../../routing/routes';
import { INTERVENTION, LEVELS, OUTPUT, PARTNER } from '../../settings/questions-tab/questions-tab.filters';
import { Unsubscribe } from 'redux';
import { store } from '../../../../redux/store';
import { routeDetailsSelector } from '../../../../redux/selectors/app.selectors';
import { debounce } from '../../../utils/debouncer';
import { fireEvent } from '../../../utils/fire-custom-event';
import { loadQuestionTemplates } from '../../../../redux/effects/templates.effects';
import { questionTemplatesListData } from '../../../../redux/selectors/templates.selectors';
import { METHODS, QUESTION_TEMPLATES, QUESTION_TEMPLATES_WITH_TARGET } from '../../../../endpoints/endpoints-list';
import { getEndpoint } from '../../../../endpoints/endpoints';
import { request } from '../../../../endpoints/request';
import { loadStaticData } from '../../../../redux/effects/load-static-data.effect';
import { hasPermission, Permissions } from '../../../../config/permissions';

const AllowedLevels: Set<string> = new Set([PARTNER, OUTPUT, INTERVENTION]);
const ENTER: 13 = 13;
const ESCAPE: 27 = 27;
const STATIC_DATA_NAMES: GenericObject = {
    methods: METHODS
};

@customElement('templates-tab')
export class TemplatesTabComponent extends LitElement {
    @property() public questionTemplatesList: IQuestionTemplate[] = [];
    @property() public queryParams: IRouteQueryParam | null = null;
    @property() public listLoadingInProcess: boolean = false;
    @property() public editedDetails: GenericObject = { opened: false };
    @property() public additionalDataLoading: boolean = false;
    public count: number = 0;

    public get loadingInProcess(): boolean {
        return this.additionalDataLoading || this.listLoadingInProcess;
    }

    @query('#details-input') private detailsInput!: HTMLInputElement;

    private readonly routeDetailsUnsubscribe: Unsubscribe;
    private readonly questionTemplatesDataUnsubscribe: Unsubscribe;
    private readonly debouncedLoading: Callback;
    private methods!: EtoolsMethod[];

    public constructor() {
        super();

        // List loading request
        this.debouncedLoading = debounce((params: IRouteQueryParam) => {
            const { level, target } = params;
            const refactoredParams: IRouteQueryParam = Object.entries(params)
                .filter(([paramName]: [string, string]) => paramName !== 'level' && paramName !== 'target')
                .reduce((newParams: IRouteQueryParams, [name, value]: [string, any]) => ({ ...newParams, [name]: value }), {});

            this.listLoadingInProcess = true;
            store.dispatch<AsyncEffect>(loadQuestionTemplates(refactoredParams, level, target))
                .catch(() => fireEvent(this, 'toast', { text: 'Can not load Question Templates List' }))
                .then(() => this.listLoadingInProcess = false);
        }, 100);

        this.questionTemplatesDataUnsubscribe = store.subscribe(questionTemplatesListData((data: IListData<IQuestionTemplate> | null) => {
            if (!data) { return; }
            this.count = data.count;
            this.questionTemplatesList = data.results;
        }, false));

        // route params listener
        this.routeDetailsUnsubscribe = store.subscribe(routeDetailsSelector((details: IRouteDetails) => this.onRouteChange(details), false));
        const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
        this.onRouteChange(currentRoute);

        this.loadAdditionalData('methods');
    }
    public render(): TemplateResult {
        return template.call(this);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.routeDetailsUnsubscribe();
        this.questionTemplatesDataUnsubscribe();
    }

    public onLevelChanged(level: string): void {
        if (this.queryParams && this.queryParams.level === level) { return; }
        updateQueryParams({ level });
    }

    public changePageParam(newValue: string | number, paramName: string): void {
        const currentValue: number | string = this.queryParams && this.queryParams[paramName] || 0;
        if (+newValue === +currentValue) { return; }
        updateQueryParams({ [paramName]: newValue });
    }

    public showDetailsInput(target: HTMLElement, id: number, details: string | null): void {
        if (!hasPermission(Permissions.EDIT_QUESTION_TEMPLATES)) { return; }
        const { top, left, width } = target.getBoundingClientRect();
        this.editedDetails = {
            opened: true,
            details: details || '',
            width, top, left, id
        };
        setTimeout(() => this.detailsInput.focus(), 0);
    }

    public getDetailsInputStyles(): string {
        if (!this.editedDetails) { return ''; }
        return `width: ${ this.editedDetails.width || 0 }px;` +
            `top: ${ this.editedDetails.top || 0 }px;` +
            `left: ${ this.editedDetails.left || 0 }px;`;
    }

    public updateTemplate(id: number, field: 'is_active', value: boolean): void;
    public updateTemplate(id: number, field: 'specific_details', value: string): void;
    public updateTemplate(id: number, field: 'specific_details' | 'is_active', value: string | boolean): void {
        // close editedDetails input popover
        this.editedDetails = { opened: false };

        // find edited template in list
        const selectedTemplate: IQuestionTemplate | undefined = this.questionTemplatesList.find((questionTemplate: IQuestionTemplate) => questionTemplate.id === id);
        if (!selectedTemplate) { return; }

        // get current template data from object
        if (!selectedTemplate.template) { selectedTemplate.template = { is_active: false } as QuestionTemplateItem; }
        const templateData: QuestionTemplateItem = selectedTemplate.template;

        // don't make request if value is not changed
        if (templateData[field] === value) { return; }
        // display new value in table immediately. we will revert it on request fail
        selectedTemplate.template = { ...templateData, [field]: value };

        // update info
        this.requestTemplateUpdate(selectedTemplate.id, selectedTemplate.template)
            .catch(() => {
                fireEvent(this, 'toast', { text: `Can not update Question Templates with id ${ id }` });
                selectedTemplate.template = templateData;
                this.requestUpdate();
            });
    }

    public onDetailsKeyUp(event: KeyboardEvent): void {
        this.editedDetails.details = this.detailsInput.value;
        if (event.keyCode === ENTER) {
            this.updateTemplate(this.editedDetails.id, 'specific_details', this.editedDetails.details);
        } else if (event.keyCode === ESCAPE) {
            this.editedDetails = { opened: false };
        }
    }

    public serializeMethods(methodsIds: number[]): string {
        if (!this.methods) { return ''; }
        return methodsIds
            .map((id: number) => this.methods.find((method: EtoolsMethod) => method.id === id))
            .filter<EtoolsMethod>((method: EtoolsMethod | undefined): method is EtoolsMethod => method !== undefined)
            .map(({ name }: EtoolsMethod) => name)
            .join(', ');
    }

    private requestTemplateUpdate(id: number, questionTemplate: Partial<QuestionTemplateItem>): Promise<IQuestionTemplate> {
        const { level, target }: IRouteQueryParam = this.queryParams || {};
        if (!level) {
            throw new Error(`Can not update question template. Level param is ${ level }`);
        }

        const endpointName: string = target ? QUESTION_TEMPLATES_WITH_TARGET : QUESTION_TEMPLATES;
        const { url }: IResultEndpoint = getEndpoint(endpointName, { level, target });
        return request<IQuestionTemplate>(`${ url }${ id }/`, { method: 'PATCH', body: JSON.stringify({ template: questionTemplate }) });
    }

    private onRouteChange({ routeName, subRouteName, queryParams }: IRouteDetails): void {
        if (routeName !== 'plan' || subRouteName !== 'templates') { return; }

        const paramsAreValid: boolean = this.checkParams(queryParams);
        if (paramsAreValid) {
            this.queryParams = queryParams;
            this.debouncedLoading(this.queryParams);
        }
    }

    private checkParams(params?: IRouteQueryParams | null): boolean {
        const invalid: boolean = !params || !params.page || !params.page_size;
        const levelInvalid: boolean = !params || !params.level || !AllowedLevels.has(params.level);
        if (invalid || levelInvalid) {
            const { page = 1, page_size = 10, level = LEVELS[0].value } = params || {};
            updateQueryParams({ page, page_size, level });
        }
        return !invalid;
    }

    private loadAdditionalData(dataName: 'methods'): void {
        if (this[dataName]) { return; }
        const staticData: IStaticDataState = (store.getState() as IRootState).staticData;
        const data: any = staticData[dataName];
        if (data) {
            this[dataName] = data;
        } else {
            this.additionalDataLoading = true;
            store.dispatch<AsyncEffect>(loadStaticData(STATIC_DATA_NAMES[dataName]))
                .finally(() => this.additionalDataLoading = false);
        }
    }

    public static get styles(): CSSResult[] {
        return [elevationStyles];
    }

}
