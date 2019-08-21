import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { fireEvent } from '../../utils/fire-custom-event';
import { IDialogResponse, IEtoolsDialogResponse } from '../../utils/dialog';

export interface ITestDialogRequest {
    test: string;
}

export interface ITestDialogResponse {
    value: string;
}

@customElement('test-dialog')
export class TestDialog extends LitElement {

    @property()
    public data!: ITestDialogRequest;

    public render(): TemplateResult | void {
        return html`
              <etools-dialog dialog-title="test dialog" opened @close="${(e: CustomEvent) => this.onTest(e)}">
                ${this.data.test}
              </etools-dialog>
        `;
    }

    public onTest(e: CustomEvent<IEtoolsDialogResponse>): any {
        let response: IDialogResponse<ITestDialogResponse> = {
            confirmed: e.detail.confirmed
        };
        if (e.detail.confirmed) {
            response = { ...response, ...{ value: this.data.test } };
        }
        return fireEvent(this, 'response', response);
    }
}
