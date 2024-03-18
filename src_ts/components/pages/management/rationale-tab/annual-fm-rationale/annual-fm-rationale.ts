import {css, LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {store} from '../../../../../redux/store';
import {updateRationale} from '../../../../../redux/effects/rationale.effects';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {template} from './annual-fm-rationale.tpl';
import {Unsubscribe} from 'redux';
import {rationaleUpdate, rationaleUpdateError} from '../../../../../redux/selectors/rationale.selectors';
import {DataMixin} from '../../../../common/mixins/data-mixin';
import {getDifference} from '../../../../utils/objects-diff';
import {SetRationaleUpdateError} from '../../../../../redux/actions/rationale.actions';
import dayjs from 'dayjs';

@customElement('annual-fm-rationale')
export class AnnualFmRationale extends DataMixin()<IRationale>(LitElement) {
  @property() errors: GenericObject = {};
  @property() isReadonly = true;
  @property() selectedYear: number | undefined;
  @property() savingInProcess = true;

  private updateRationaleUnsubscribe!: Unsubscribe;
  private updateRationaleErrorUnsubscribe!: Unsubscribe;

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
    this.errors = store.getState().rationale.error;
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
    this.updateRationaleErrorUnsubscribe = store.subscribe(
      rationaleUpdateError((errors: GenericObject | null) => {
        this.errors = errors ? errors : {};
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.updateRationaleUnsubscribe();
    this.updateRationaleErrorUnsubscribe();
  }

  save(): void {
    this.processRequest();
    this.isReadonly = true;
  }

  cancel(): void {
    this.editedData = JSON.parse(JSON.stringify(this.originalData));
    this.isReadonly = true;
    store.dispatch(new SetRationaleUpdateError({}));
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
    const isEmpty = !Object.keys(data).length;

    if (!isEmpty && this.selectedYear) {
      store.dispatch<AsyncEffect>(updateRationale(this.selectedYear, data));
    }
  }

  onTargetVisitsChange(value?: string): void {
    this.editedData.target_visits = value && !isNaN(+value) ? +value : 0;
    this.requestUpdate();
  }

  getChangesDate(date?: string): string {
    return date ? dayjs(date).format('DD MMM YYYY') : '';
  }

  static get styles(): CSSResultArray {
    return [
      SharedStyles,
      pageLayoutStyles,
      layoutStyles,
      CardStyles,
      css`
        .history-info {
          color: var(--gray-light);
          font-size: var(--etools-font-size-13, 13px);
          font-style: italic;
          margin-right: 20px;
          letter-spacing: 0.04em;
        }
      `
    ];
  }
}
