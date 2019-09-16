import { RemoveAttachmentPopupComponent } from './remove-attachment-popup';
import { html, TemplateResult } from 'lit-element';
import { translate } from '../../../../localization/localisation';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { TabInputsStyles } from '../../../styles/tab-inputs-styles';

export function template(this: RemoveAttachmentPopupComponent): TemplateResult {
    return html`
        ${SharedStyles} ${pageLayoutStyles} ${FlexLayoutClasses} ${TabInputsStyles}
        <etools-dialog
                size="md"
                no-padding
                keep-dialog-open
                theme="confirmation"
                ?opened="${ this.dialogOpened }"
                ok-btn-text="${ translate( 'MAIN.BUTTONS.DELETE') }"
                @confirm-btn-clicked="${() => this.processRequest()}"
                @close="${ this.onClose }">
            <etools-loading ?active="${ this.removeInProcess }" loading-text="${ translate('MAIN.SAVING_DATA_IN_PROCESS') }"></etools-loading>
            <div class="container layout horizontal">
                <div>${ translate('ATTACHMENTS_LIST.DELETE_POPUP_TITLE') }</div>
            </div>
        </etools-dialog>
    `;
}
