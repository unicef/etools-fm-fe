import {LitElement, TemplateResult, CSSResultArray, PropertyValues} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {template} from './templates-tab.tpl';
import {elevationStyles} from '../../../styles/elevation-styles';
import {updateQueryParams} from '../../../../routing/routes';
import {Unsubscribe} from 'redux';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {loadQuestionTemplates} from '../../../../redux/effects/templates.effects';
import {questionTemplatesListData} from '../../../../redux/selectors/templates.selectors';
import {QUESTION_TEMPLATES, QUESTION_TEMPLATES_WITH_TARGET} from '../../../../endpoints/endpoints-list';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {request} from '../../../../endpoints/request';
import {loadStaticData} from '../../../../redux/effects/load-static-data.effect';
import {hasPermission, Permissions} from '../../../../config/permissions';
import {INTERVENTION, LEVELS, OUTPUT, PARTNER} from '../../../common/dropdown-options';
import {SharedStyles} from '../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../styles/flex-layout-classes';
import {CardStyles} from '../../../styles/card-styles';
import {TemplatesStyles} from './templates-tab.styles';
import {ListMixin} from '../../../common/mixins/list-mixin';
import {applyDropdownTranslation} from '../../../utils/translation-helper';
import {activeLanguageSelector} from '../../../../redux/selectors/active-language.selectors';
import {get as getTranslation} from 'lit-translate';
import {
  EtoolsRouteQueryParam,
  EtoolsRouteDetails,
  EtoolsRouteQueryParams
} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

const AllowedLevels: Set<string> = new Set([PARTNER, OUTPUT, INTERVENTION]);
const ENTER = 13;
const ESCAPE = 27;

@customElement('templates-tab')
export class TemplatesTabComponent extends ListMixin()<IQuestionTemplate>(LitElement) {
  @property() listLoadingInProcess = false;
  @property() editedDetails: GenericObject = {opened: false};
  @property() levels: DefaultDropdownOption<string>[] = applyDropdownTranslation(LEVELS);
  @query('#details-input') private detailsInput!: HTMLInputElement;
  @property() private additionalDataLoadingCount = 0;
  partners!: EtoolsPartner[];
  interventions!: EtoolsIntervention[];
  outputs!: EtoolsCpOutput[];
  private readonly routeDetailsUnsubscribe: Unsubscribe;
  private readonly questionTemplatesDataUnsubscribe: Unsubscribe;
  private readonly debouncedLoading: Callback;
  private methods!: EtoolsMethod[];
  private activeLanguageUnsubscribe: Unsubscribe;

  constructor() {
    super();

    // List loading request
    this.debouncedLoading = debounce((params: EtoolsRouteQueryParam) => {
      const {level, target, ...refactoredParams} = params;

      this.listLoadingInProcess = true;
      store
        .dispatch<AsyncEffect>(
          loadQuestionTemplates(refactoredParams, String(level), target ? String(target) : undefined)
        )
        .catch(() => fireEvent(this, 'toast', {text: getTranslation('ERROR_LOAD_TEMPLATES')}))
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
      routeDetailsSelector((details: EtoolsRouteDetails) => this.onRouteChange(details), false)
    );
    const currentRoute: EtoolsRouteDetails = (store.getState() as IRootState).app.routeDetails;
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
    this.updateQueryParamsIfPageIsActive({level, target: null}, 'templates/templates');
  }

  onTargetChanged(selectedItem: GenericObject | null): void {
    const id: number | null = selectedItem && +selectedItem.id;
    const currentTarget: number | null = (this.queryParams && +this.queryParams.target) || null;
    if (currentTarget === id) {
      return;
    }
    this.updateQueryParamsIfPageIsActive({target: id}, 'templates/templates');
  }

  getSelectedTarget(forLevel: string, collection: any): string | number | undefined {
    const {level, target}: EtoolsRouteQueryParams = this.queryParams || {};
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
      fireEvent(this, 'toast', {text: `${getTranslation('ERROR_UPDATE_QUESTION_TEMPLATE')} ${id}`});
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
  }

  private requestTemplateUpdate(
    id: number,
    questionTemplate: Partial<QuestionTemplateItem>
  ): Promise<IQuestionTemplate> {
    const {level, target}: EtoolsRouteQueryParam = this.queryParams || {};
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

  private onRouteChange({routeName, subRouteName, queryParams}: EtoolsRouteDetails): void {
    if (routeName !== 'templates' || subRouteName !== 'templates') {
      return;
    }

    const paramsAreValid: boolean = this.checkParams(queryParams);
    if (paramsAreValid) {
      this.queryParams = queryParams;
      this.debouncedLoading(this.queryParams);
    }
  }

  private checkParams(params?: EtoolsRouteQueryParams | null): boolean {
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
