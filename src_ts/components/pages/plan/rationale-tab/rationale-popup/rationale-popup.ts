import {
    CSSResultArray,
    customElement,
    LitElement,
    property,
    PropertyValues,
    queryAll,
    TemplateResult
} from 'lit-element';
import { template } from './rationale-popup.tpl';
import { clone } from 'ramda';
import { store } from '../../../../../redux/store';
import { fireEvent } from '../../../../utils/fire-custom-event';
import { Unsubscribe } from 'redux';
import { rationaleUpdate } from '../../../../../redux/selectors/rationale.selectors';
import { getDifference } from '../../../../utils/objects-diff';
import { updateRationale } from '../../../../../redux/effects/rationale.effects';
import { PaperTextareaElement } from '@polymer/paper-input/paper-textarea';
import { setTextareasMaxHeight } from '../../../../utils/textarea-max-rows-helper';
import { SharedStyles } from '../../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../../styles/page-layout-styles';
import { FlexLayoutClasses } from '../../../../styles/flex-layout-classes';
import { CardStyles } from '../../../../styles/card-styles';

@customElement('rationale-popup')
export class RationalePopupComponent extends LitElement {
    @property() public dialogOpened: boolean = true;
    @property() public errors: GenericObject = {};
    public savingInProcess: boolean = false;
    public editedModel: Partial<IRationale> = {};
    @queryAll('paper-textarea') public textareas!: PaperTextareaElement[];

    private originalData: IRationale | null = null;
    private selectedYear: number | undefined;
    private readonly updateRationaleUnsubscribe: Unsubscribe;

    public set data(data: RationaleModalData) {
        if (!data) { return; }
        const { model, year }: RationaleModalData = data;

        this.selectedYear = year;
        if (!model) { return; }
        this.editedModel = { ...this.editedModel, ...model };
        this.originalData = clone(model);
    }

    public constructor() {
        super();
        this.updateRationaleUnsubscribe = store.subscribe(rationaleUpdate((updateInProcess: boolean | null) => {
            // set updating state for spinner
            this.savingInProcess = Boolean(updateInProcess);
            if (updateInProcess) { return; }

            // check errors on update(create) complete
            this.errors = store.getState().rationale.error;
            if (this.errors && Object.keys(this.errors).length) { return; }

            // close popup if update(create) was successful
            this.dialogOpened = false;
            fireEvent(this, 'response', { confirmed: true });
        }, false));
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.updateRationaleUnsubscribe();
    }

    public onClose(): void {
        fireEvent(this, 'response', { confirmed: false });
    }

    public processRequest(): void {
        if (!this.selectedYear) {
            throw new Error('You need to provide year argument for rationale modal');
        }

        this.errors = {};
        const data: Partial<IRationale> = this.originalData !== null ?
            getDifference<Partial<IRationale>>(this.originalData, this.editedModel, { toRequest: true }) :
            this.editedModel;
        const isEmpty: boolean = !Object.keys(data).length;

        if (isEmpty) {
            this.dialogOpened = false;
            this.onClose();
        } else {
            store.dispatch<AsyncEffect>(updateRationale(this.selectedYear, data));
        }
    }

    public resetFieldError(fieldName: string): void {
        if (!this.errors) { return; }
        delete this.errors[fieldName];
        this.performUpdate();
    }

    public onTargetVisitsChange(value?: string): void {
        this.editedModel.target_visits = value && !isNaN(+value) ? +value : 0;
    }

    public updateModelValue(fieldName: keyof IRationale, value: any): void {
        this.editedModel[fieldName] = value;
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated(_changedProperties);
        setTextareasMaxHeight(this.textareas);
    }

    public static get styles(): CSSResultArray {
        return [SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles];
    }
}
