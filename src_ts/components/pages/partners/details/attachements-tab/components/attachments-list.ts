import {CSSResult, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {template} from './attachments-list.tpl';
import {loadAttachmentsListWithOptions} from '../../../../../../redux/effects/attachments-list.effects';
import {store} from '../../../../../../redux/store';
import {
  attachmentsListSelector,
  attachmentsPermissionsSelector,
  attachmentsTypesSelector
} from '../../../../../../redux/selectors/attachments-list.selectors';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import {Unsubscribe} from 'redux';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../../../styles/card-styles';
import {attachmentsList} from '../../../../../../redux/reducers/attachments-list.reducer';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {get as getTranslation} from 'lit-translate';
import {getFromPath} from '../../../../../utils/utils';
import './edit-attachments-popup/partner-edit-attachments-popup';
import './remove-attachment-popup/partner-remove-attachment-popup';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

store.addReducers({attachmentsList});

@customElement('partner-attachments-list')
export class PartnerAttachmentsListComponent extends LitElement {
  @property() loadingInProcess = false;
  @property({type: String, attribute: 'tab-title-key'})
  tabTitleKey = 'ATTACHMENTS_LIST.TITLE';
  @property({type: Boolean, attribute: 'readonly'}) readonly = true;
  @property() attachmentsTypes: AttachmentType[] = [];
  @property({type: Boolean})
  lowResolutionLayout = false;
  attachmentsList: IAttachment[] = [];
  additionalEndpointData: GenericObject = {};

  private attachmentsListUnsubscribe: Unsubscribe | undefined;
  private debouncedLoading: Callback | undefined;
  private attachmentsTypesUnsubscribe!: Unsubscribe;
  private attachmentsPermissionsUnsubscribe!: Unsubscribe;
  private _endpointName = '';

  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles, layoutStyles, CardStyles];
  }

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

    // subscribe on attachments list data. use DynamicSelector and endpointName to
    // determine which field we need to take from store
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
        .dispatch<AsyncEffect>(loadAttachmentsListWithOptions(this._endpointName, this.additionalEndpointData))
        .catch(() => fireEvent(this, 'toast', {text: getTranslation('ERROR_ATTACHEMENT_LOAD')}))
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
    this.attachmentsPermissionsUnsubscribe = store.subscribe(
      attachmentsPermissionsSelector((permissions) => {
        if (permissions) {
          this.readonly = this.isTabReadonly(permissions);
        }
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.attachmentsTypesUnsubscribe();
    this.attachmentsPermissionsUnsubscribe();
  }

  isTabReadonly(permissions: GenericObject): boolean {
    return !(getFromPath(permissions, ['actions', 'PUT']) || getFromPath(permissions, ['actions', 'POST']));
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
      dialog: 'partner-edit-attachment-popup',
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
      dialog: 'partner-remove-attachment-popup',
      dialogData: {id, endpointName: this._endpointName, additionalEndpointData: this.additionalEndpointData}
    }).then(({confirmed}: IDialogResponse<any>) => {
      if (!confirmed || !this.debouncedLoading) {
        return;
      }
      this.debouncedLoading();
    });
  }
}
