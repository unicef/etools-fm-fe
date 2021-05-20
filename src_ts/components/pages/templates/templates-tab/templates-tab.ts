import {
  CSSResultArray,
  customElement,
  LitElement,
  property,
  PropertyValues,
  query,
  queryAll,
  TemplateResult
} from 'lit-element';
import {template} from './templates-tab.tpl';
import {elevationStyles} from '../../../styles/elevation-styles';
import {updateQueryParams} from '../../../../routing/routes';
import {Unsubscribe} from 'redux';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {debounce} from '../../../utils/debouncer';
import {fireEvent} from '../../../utils/fire-custom-event';
import {loadQuestionTemplates} from '../../../../redux/effects/templates.effects';
import {questionTemplatesListData} from '../../../../redux/selectors/templates.selectors';
import {QUESTION_TEMPLATES, QUESTION_TEMPLATES_WITH_TARGET} from '../../../../endpoints/endpoints-list';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {request} from '../../../../endpoints/request';
import {loadStaticData} from '../../../../redux/effects/load-static-data.effect';
import {hasPermission, Permissions} from '../../../../config/permissions';
import {setTextareasMaxHeight} from '../../../utils/textarea-max-rows-helper';
import {PaperTextareaElement} from '@polymer/paper-input/paper-textarea';
import {INTERVENTION, LEVELS, OUTPUT, PARTNER} from '../../../common/dropdown-options';
import {SharedStyles} from '../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../styles/flex-layout-classes';
import {CardStyles} from '../../../styles/card-styles';
import {TemplatesStyles} from './templates-tab.styles';
import {ListMixin} from '../../../common/mixins/list-mixin';
import {applyDropdownTranslation} from '../../../utils/translation-helper';
import {activeLanguageSelector} from '../../../../redux/selectors/active-language.selectors';

const AllowedLevels: Set<string> = new Set([PARTNER, OUTPUT, INTERVENTION]);
const ENTER: 13 = 13;
const ESCAPE: 27 = 27;

@customElement('templates-tab')
export class TemplatesTabComponent extends ListMixin()<IQuestionTemplate>(LitElement) {
  @property() listLoadingInProcess = false;
  @property() editedDetails: GenericObject = {opened: false};
  @queryAll('paper-textarea') textareas!: PaperTextareaElement[];
  partners!: EtoolsPartner[];
  interventions!: EtoolsIntervention[];
  outputs!: EtoolsCpOutput[];
  @property() levels: DefaultDropdownOption<string>[] = applyDropdownTranslation(LEVELS);
  @query('#details-input') private detailsInput!: HTMLInputElement;
  private readonly routeDetailsUnsubscribe: Unsubscribe;
  private readonly questionTemplatesDataUnsubscribe: Unsubscribe;
  private readonly debouncedLoading: Callback;
  private methods!: EtoolsMethod[];
  @property() private additionalDataLoadingCount = 0;
  private activeLanguageUnsubscribe: Unsubscribe;

  constructor() {
    super();

    // List loading request
    this.debouncedLoading = debounce((params: IRouteQueryParam) => {
      const {level, target, ...refactoredParams} = params;

      this.listLoadingInProcess = true;
      store
        .dispatch<AsyncEffect>(loadQuestionTemplates(refactoredParams, level, target))
        .catch(() => fireEvent(this, 'toast', {text: 'Can not load Question Templates List'}))
        .then(() => (this.listLoadingInProcess = false));
    }, 100);

    this.questionTemplatesDataUnsubscribe = store.subscribe(
      questionTemplatesListData((data: IListData<IQuestionTemplate> | null) => {
        if (!data) {
          return;
        }
        this.count = data.count;
        this.items = data.results;
      }, false)
    );

    // route params listener
    this.routeDetailsUnsubscribe = store.subscribe(
      routeDetailsSelector((details: IRouteDetails) => this.onRouteChange(details), false)
    );
    const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
    this.onRouteChange(currentRoute);

    this.loadAdditionalData('methods');
    this.activeLanguageUnsubscribe = store.subscribe(
      activeLanguageSelector(() => {
        this.levels = applyDropdownTranslation(LEVELS);
      })
    );
  }

  static get styles(): CSSResultArray {
    return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, TemplatesStyles];
  }

  @property() get loadingInProcess(): boolean {
    return this.additionalDataLoading || this.listLoadingInProcess;
  }

  get additionalDataLoading(): boolean {
    return Boolean(this.additionalDataLoadingCount);
  }

  set additionalDataLoading(state: boolean) {
    const counterModification: 1 | -1 = state ? 1 : -1;
    this.additionalDataLoadingCount += counterModification;
  }

  render(): TemplateResult {
    return template.call(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.routeDetailsUnsubscribe();
    this.questionTemplatesDataUnsubscribe();
    this.activeLanguageUnsubscribe();
  }

  onLevelChanged(level: string): void {
    this.loadAdditionalData(`${level}s` as 'interventions' | 'outputs' | 'partners');
    if (this.queryParams && this.queryParams.level === level) {
      return;
    }
    updateQueryParams({level, target: null});
  }

  onTargetChanged(selectedItem: GenericObject | null): void {
    const id: number | null = selectedItem && +selectedItem.id;
    const currentTarget: number | null = (this.queryParams && +this.queryParams.target) || null;
    if (currentTarget === id) {
      return;
    }
    updateQueryParams({target: id});
  }

  getSelectedTarget(forLevel: string, collection: any): string | number | undefined {
    const {level, target}: IRouteQueryParams = this.queryParams || {};
    // we need to check that options collection is loaded already. Otherwise value-change-event will be triggered with selectedItem as null
    return Boolean(collection) && target && level === forLevel ? target : undefined;
  }

  showDetailsInput(target: HTMLElement, id: number, details: string | null): void {
    if (!hasPermission(Permissions.EDIT_QUESTION_TEMPLATES)) {
      return;
    }
    const {top, left, width} = target.getBoundingClientRect();
    this.editedDetails = {
      opened: true,
      details: details || '',
      width,
      top,
      left,
      id
    };
    setTimeout(() => this.detailsInput.focus(), 0);
  }

  getDetailsInputStyles(): string {
    if (!this.editedDetails) {
      return '';
    }
    return (
      `width: ${this.editedDetails.width || 0}px;` +
      `top: ${this.editedDetails.top || 0}px;` +
      `left: ${this.editedDetails.left || 0}px;`
    );
  }

  updateTemplate(id: number, field: 'is_active', value: boolean): void;
  updateTemplate(id: number, field: 'specific_details', value: string): void;
  updateTemplate(id: number, field: 'specific_details' | 'is_active', value: string | boolean): void {
    // close editedDetails input popover
    this.editedDetails = {opened: false};

    // find edited template in list
    const selectedTemplate: IQuestionTemplate | undefined = this.items.find(
      (questionTemplate: IQuestionTemplate) => questionTemplate.id === id
    );
    if (!selectedTemplate) {
      return;
    }

    // get current template data from object
    if (!selectedTemplate.template) {
      selectedTemplate.template = {is_active: false} as QuestionTemplateItem;
    }
    const templateData: QuestionTemplateItem = selectedTemplate.template;

    // don't make request if value is not changed
    if (templateData[field] === value) {
      return;
    }
    // display new value in table immediately. we will revert it on request fail
    selectedTemplate.template = {...templateData, [field]: value};

    // update info
    this.requestTemplateUpdate(selectedTemplate.id, selectedTemplate.template).catch(() => {
      fireEvent(this, 'toast', {text: `Can not update Question Templates with id ${id}`});
      selectedTemplate.template = templateData;
      this.requestUpdate();
    });
  }

  onDetailsKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === ENTER && !event.shiftKey) {
      this.updateTemplate(this.editedDetails.id, 'specific_details', this.editedDetails.details);
      event.preventDefault();
    } else if (event.keyCode === ESCAPE) {
      this.editedDetails = {opened: false};
      event.preventDefault();
    }
  }

  onDetailsKeyUp(): void {
    this.editedDetails.details = this.detailsInput.value;
  }

  serializeMethods(methodsIds: number[]): string {
    if (!this.methods) {
      return '';
    }
    return methodsIds
      .map((id: number) => this.methods.find((method: EtoolsMethod) => method.id === id))
      .filter<EtoolsMethod>((method: EtoolsMethod | undefined): method is EtoolsMethod => method !== undefined)
      .map(({name}: EtoolsMethod) => name)
      .join(', ');
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    setTextareasMaxHeight(this.textareas);
  }

  private requestTemplateUpdate(
    id: number,
    questionTemplate: Partial<QuestionTemplateItem>
  ): Promise<IQuestionTemplate> {
    const {level, target}: IRouteQueryParam = this.queryParams || {};
    if (!level) {
      throw new Error(`Can not update question template. Level param is ${level}`);
    }

    const endpointName: string = target ? QUESTION_TEMPLATES_WITH_TARGET : QUESTION_TEMPLATES;
    const {url}: IResultEndpoint = getEndpoint(endpointName, {level, target});
    return request<IQuestionTemplate>(`${url}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({template: questionTemplate})
    });
  }

  private onRouteChange({routeName, subRouteName, queryParams}: IRouteDetails): void {
    if (routeName !== 'templates' || subRouteName !== 'templates') {
      return;
    }

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
      const {page = 1, page_size = 10, level = LEVELS[0].value} = params || {};
      updateQueryParams({page, page_size, level});
    }
    return !invalid;
  }

  private loadAdditionalData(dataName: 'methods' | 'interventions' | 'outputs' | 'partners'): void {
    if (this[dataName]) {
      return;
    }
    const staticData: IStaticDataState = (store.getState() as IRootState).staticData;
    const data: any = staticData[dataName];
    if (data) {
      this[dataName] = data;
    } else {
      this.additionalDataLoading = true;
      store
        .dispatch<AsyncEffect>(loadStaticData(dataName))
        .then((fetchedData: any) => (this[dataName] = fetchedData))
        .finally(() => (this.additionalDataLoading = false));
    }
  }
}
