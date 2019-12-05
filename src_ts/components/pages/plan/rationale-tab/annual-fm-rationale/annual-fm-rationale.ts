import {CSSResultArray, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {store} from '../../../../../redux/store';
import {updateRationale} from '../../../../../redux/effects/rationale.effects';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../styles/card-styles';
import {template} from './annual-fm-rationale.tpl';
import {Unsubscribe} from 'redux';
import {rationaleUpdate} from '../../../../../redux/selectors/rationale.selectors';
import {DataMixin} from '../../../../common/mixins/data-mixin';
import {getDifference} from '../../../../utils/objects-diff';

@customElement('annual-fm-rationale')
export class AnnualFmRationale extends DataMixin()<IRationale>(LitElement) {
  @property() errors: GenericObject = {};
  @property() isReadonly: boolean = true;
  @property() selectedYear: number | undefined;
  savingInProcess: boolean = false;

  private updateRationaleUnsubscribe!: Unsubscribe;

  set editedModel(yearPlan: IRationale) {
    if (!yearPlan) {
      return;
    }
    this.editedData = yearPlan;
  }

  connectedCallback(): void {
    super.connectedCallback();
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
    this.editedData = JSON.parse(JSON.stringify(this.originalData));
    this.isReadonly = true;
  }

  startEdit(): void {
    this.originalData = JSON.parse(JSON.stringify(this.editedData));
    this.isReadonly = false;
  }

  processRequest(): void {
    this.errors = {};
    const data: Partial<IRationale> =
      this.originalData !== null
        ? getDifference<Partial<IRationale>>(this.originalData, this.editedData, {toRequest: true})
        : this.editedData;
    const isEmpty: boolean = !Object.keys(data).length;

    if (!isEmpty && this.selectedYear) {
      store.dispatch<AsyncEffect>(updateRationale(this.selectedYear, data));
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
    this.editedData.target_visits = value && !isNaN(+value) ? +value : 0;
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles];
  }
}
