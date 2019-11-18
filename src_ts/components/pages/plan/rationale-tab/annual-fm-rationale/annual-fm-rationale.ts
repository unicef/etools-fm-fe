import {
  CSSResultArray,
  customElement,
  LitElement,
  property,
  PropertyValues,
  queryAll,
  TemplateResult
} from 'lit-element';
import {store} from '../../../../../redux/store';
import {updateRationale} from '../../../../../redux/effects/rationale.effects';
import {PaperTextareaElement} from '@polymer/paper-input/paper-textarea';
import {setTextareasMaxHeight} from '../../../../utils/textarea-max-rows-helper';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../styles/card-styles';
import {template} from './annual-fm-rationale.tpl';
import {Unsubscribe} from 'redux';
import {rationaleUpdate} from '../../../../../redux/selectors/rationale.selectors';

@customElement('annual-fm-rationale')
export class AnnualFmRationale extends LitElement {
  @property() errors: GenericObject = {};
  @queryAll('paper-textarea') textareas!: PaperTextareaElement[];
  @property() data!: Partial<IRationale>;
  untouchedData!: Partial<IRationale>;
  @property() isReadonly: boolean = true;
  @property() selectedYear: number | undefined;
  savingInProcess: boolean = false;

  private readonly updateRationaleUnsubscribe: Unsubscribe;

  constructor() {
    super();
    this.updateRationaleUnsubscribe = store.subscribe(
      rationaleUpdate((updateInProcess: boolean | null) => {
        // set updating state for spinner
        this.savingInProcess = Boolean(updateInProcess);
        if (updateInProcess) {
          return;
        }

        // check errors on update(create) complete
        this.errors = store.getState().rationale.error;
        if (this.errors && Object.keys(this.errors).length) {
          console.log('errors', this.errors);
          this.isReadonly = false;
          return;
        }
      }, false)
    );
  }

  render(): TemplateResult {
    return template.call(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.updateRationaleUnsubscribe();
  }

  save(): void {
    this.processRequest();
    this.isReadonly = true;
  }

  cancel(): void {
    this.data = JSON.parse(JSON.stringify(this.untouchedData));
    this.isReadonly = true;
  }

  startEdit(): void {
    this.untouchedData = JSON.parse(JSON.stringify(this.data));
    this.isReadonly = false;
  }

  processRequest(): void {
    this.errors = {};
    // const data: Partial<IRationale> =
    //   this.originalData !== null
    //     ? getDifference<Partial<IRationale>>(this.originalData, this.editedModel, {toRequest: true})
    //     : this.editedModel;
    // const isEmpty: boolean = !Object.keys(data).length;

    // if (!isEmpty && this.selectedYear) {
    //   store.dispatch<AsyncEffect>(updateRationale(this.selectedYear, data));
    // }
    if (this.selectedYear) {
      store.dispatch<AsyncEffect>(updateRationale(this.selectedYear, this.data));
    }
  }

  resetFieldError(fieldName: string): void {
    if (!this.errors) {
      return;
    }
    delete this.errors[fieldName];
    this.performUpdate();
  }

  onTargetVisitsChange(value?: string): void {
    this.data.target_visits = value && !isNaN(+value) ? +value : 0;
  }

  updateModelValue(fieldName: keyof IRationale, value: any): void {
    this.data[fieldName] = value;
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    setTextareasMaxHeight(this.textareas);
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles];
  }
}
