import {CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {template} from './attachments-list.tpl';
import {loadAttachmentsList, loadAttachmentsTypes} from '../../../redux/effects/attachments-list.effects';
import {store} from '../../../redux/store';
import {attachmentsListSelector, attachmentsTypesSelector} from '../../../redux/selectors/attachments-list.selectors';
import {elevationStyles} from '../../styles/elevation-styles';
import {openDialog} from '../../utils/dialog';
import {Unsubscribe} from 'redux';
import {debounce} from '../../utils/debouncer';
import {SharedStyles} from '../../styles/shared-styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../styles/flex-layout-classes';
import {CardStyles} from '../../styles/card-styles';
import {attachmentsList} from '../../../redux/reducers/attachments-list.reducer';
import {fireEvent} from '../../utils/fire-custom-event';
import {translate} from 'lit-translate';

store.addReducers({attachmentsList});

@customElement('attachments-list')
export class AttachmentsListComponent extends LitElement {
  @property() loadingInProcess = false;
  @property({type: String, attribute: 'tab-title-key'})
  tabTitleKey = 'ATTACHMENTS_LIST.TITLE';
  @property({type: Boolean, attribute: 'readonly'}) readonly = false;
  @property() attachmentsTypes: AttachmentType[] = [];
  attachmentsList: IAttachment[] = [];
  additionalEndpointData: GenericObject = {};

  private attachmentsListUnsubscribe: Unsubscribe | undefined;
  private debouncedLoading: Callback | undefined;
  private attachmentsTypesUnsubscribe!: Unsubscribe;
  private _endpointName = '';

  // on endpoint-name attribute changes
  @property({attribute: 'endpoint-name'}) set endpointName(endpointName: string) {
    if (!endpointName) {
      return;
    }
    // save endpointName
    this._endpointName = endpointName;

    if (this.attachmentsListUnsubscribe) {
      this.attachmentsListUnsubscribe();
    }

    // subscribe on attachments list data. use DynamicSelector and endpointName to determine which field we need to take from store
    this.attachmentsListUnsubscribe = store.subscribe(
      attachmentsListSelector(
        (attachments: IListData<IAttachment> | IAttachment[] | undefined) => {
          if (!attachments) {
            return;
          }
          this.attachmentsList = Array.isArray(attachments) ? attachments : attachments.results;
        },
        [endpointName],
        false
      )
    );

    // save new function for attachments list loading
    this.debouncedLoading = debounce(() => {
      this.loadingInProcess = true;
      store
        .dispatch<AsyncEffect>(loadAttachmentsList(this._endpointName, this.additionalEndpointData))
        .catch(() => fireEvent(this, 'toast', {text: translate('ERROR_ATTACHEMENT_LOAD')}))
        .finally(() => (this.loadingInProcess = false));
    }, 100);
    // load attachments
    this.debouncedLoading();
  }

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.attachmentsTypes = store.getState().attachmentsList.attachmentsTypes[this._endpointName];
    if (!this.attachmentsTypes || !this.attachmentsTypes.length) {
      store.dispatch<AsyncEffect>(loadAttachmentsTypes(this._endpointName, this.additionalEndpointData));
    }

    this.attachmentsTypesUnsubscribe = store.subscribe(
      attachmentsTypesSelector(
        (types: AttachmentType[] | undefined) => {
          if (types) {
            this.attachmentsTypes = types;
          }
        },
        [this._endpointName]
      )
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.attachmentsTypesUnsubscribe();
  }

  formatDate(value: string, format = 'DD MMM YYYY'): string {
    if (!value) {
      return '';
    }

    const date: Date = new Date(value);
    return date.toString() !== 'Invalid Date' ? dayjs.utc(date).format(format) : '';
  }

  openPopup(attachment?: IAttachment): void {
    openDialog<IAttachmentPopupData>({
      dialog: 'edit-attachment-popup',
      dialogData: {
        editedAttachment: attachment,
        attachmentTypes: this.attachmentsTypes,
        endpointName: this._endpointName,
        additionalEndpointData: this.additionalEndpointData
      }
    }).then(({confirmed}: IDialogResponse<any>) => {
      if (!confirmed || !this.debouncedLoading) {
        return;
      }
      this.debouncedLoading();
    });
  }

  openDeletePopup(id: number): void {
    openDialog<IRemmoveAttachmentPopupData>({
      dialog: 'remove-attachment-popup',
      dialogData: {id, endpointName: this._endpointName, additionalEndpointData: this.additionalEndpointData}
    }).then(({confirmed}: IDialogResponse<any>) => {
      if (!confirmed || !this.debouncedLoading) {
        return;
      }
      this.debouncedLoading();
    });
  }

  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles];
  }
}
