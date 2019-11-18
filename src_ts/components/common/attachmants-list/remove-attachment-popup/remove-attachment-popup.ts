import {CSSResultArray, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {template} from './remove-attachment-popup.tpl';
import {fireEvent} from '../../../utils/fire-custom-event';
import {store} from '../../../../redux/store';
import {listAttachmentUpdate} from '../../../../redux/selectors/attachments-list.selectors';
import {Unsubscribe} from 'redux';
import {deleteListAttachment} from '../../../../redux/effects/attachments-list.effects';
import {SharedStyles} from '../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../styles/flex-layout-classes';

@customElement('remove-attachment-popup')
export class RemoveAttachmentPopupComponent extends LitElement {
  @property() dialogOpened: boolean = true;
  @property() removeInProcess: boolean = false;
  private attachmentToDelete!: number;
  private endpointName!: string;
  private additionalEndpointData: GenericObject = {};
  private readonly updateAttachmentsUnsubscribe: Unsubscribe;

  constructor() {
    super();
    this.updateAttachmentsUnsubscribe = store.subscribe(
      listAttachmentUpdate((updateInProcess: boolean | null) => {
        // set updating state for spinner
        this.removeInProcess = Boolean(updateInProcess);
        if (updateInProcess) {
          return;
        }

        // check errors on request complete
        // this.errors = store.getState().attachmentsList.error;
        // if (this.errors && Object.keys(this.errors).length) { return; }

        // close popup if delete was successful
        this.dialogOpened = false;
        fireEvent(this, 'response', {confirmed: true});
      }, false)
    );
  }

  static get styles(): CSSResultArray {
    return [SharedStyles, pageLayoutStyles, FlexLayoutClasses];
  }

  set dialogData(data: IRemmoveAttachmentPopupData) {
    if (!data) {
      return;
    }
    const {id, endpointName, additionalEndpointData}: IRemmoveAttachmentPopupData = data;
    this.attachmentToDelete = id;
    this.endpointName = endpointName;
    this.additionalEndpointData = additionalEndpointData;
  }

  render(): TemplateResult {
    return template.call(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.updateAttachmentsUnsubscribe();
  }

  processRequest(): void {
    store.dispatch<AsyncEffect>(
      deleteListAttachment(this.endpointName, this.additionalEndpointData, this.attachmentToDelete)
    );
  }

  onClose(): void {
    fireEvent(this, 'response', {confirmed: false});
  }
}
