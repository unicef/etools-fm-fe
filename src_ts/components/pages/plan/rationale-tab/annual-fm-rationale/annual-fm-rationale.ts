import {CSSResultArray, css, customElement, LitElement, property, TemplateResult} from 'lit-element';
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
  @property() savingInProcess: boolean = true;

  private updateRationaleUnsubscribe!: Unsubscribe;

  set editedModel(yearPlan: IRationale) {
    if (yearPlan) {
      this.editedData = yearPlan;
      this.savingInProcess = false;
    }
  }

  render(): TemplateResult {
    return template.call(this);
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
    this.errors = {};
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

  onTargetVisitsChange(value?: string): void {
    this.editedData.target_visits = value && !isNaN(+value) ? +value : 0;
  }

  getChangesDate(date?: string): string {
    return date ? moment(date).format('DD MMM YYYY') : '';
  }

  static get styles(): CSSResultArray {
    return [
      SharedStyles,
      pageLayoutStyles,
      FlexLayoutClasses,
      CardStyles,
      css`
        .history-info {
          color: var(--gray-light);
          font-size: 13px;
          font-style: italic;
          margin-right: 20px;
          letter-spacing: 0.04em;
        }
      `
    ];
  }
}
