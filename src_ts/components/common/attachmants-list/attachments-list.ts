import { CSSResult, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { template } from './attachments-list.tpl';
import { loadAttachmentsList } from '../../../redux/effects/attachments-list.effects';
import { store } from '../../../redux/store';
import { attachmentsListSelector } from '../../../redux/selectors/attachments-list.selectors';
import { elevationStyles } from '../../styles/elevation-styles';
import { IDialogResponse, openDialog } from '../../utils/dialog';
import { Unsubscribe } from 'redux';
import { debounce } from '../../utils/debouncer';
import { SharedStyles } from '../../styles/shared-styles';
import { pageLayoutStyles } from '../../styles/page-layout-styles';
import { FlexLayoutClasses } from '../../styles/flex-layout-classes';
import { CardStyles } from '../../styles/card-styles';
import { attachmentsList } from '../../../redux/reducers/attachments-list.reducer';
import { fireEvent } from '../../utils/fire-custom-event';

store.addReducers({ attachmentsList });
const FILE_TYPES: DefaultDropdownOption[] = [{ display_name: 'SOP', value: 34 }, { display_name: 'Other', value: 35 }];

@customElement('attachments-list')
export class AttachmentsListComponent extends LitElement {
    @property() public loadingInProcess: boolean = false;
    @property({ type: String, attribute: 'tab-title-key' }) public tabTitleKey: string = 'ATTACHMENTS_LIST.TITLE';
    public attachmentsList: Attachment[] = [];
    public additionalEndpointData: GenericObject = {};

    private attachmentsListUnsubscribe: Unsubscribe | undefined;
    private _endpointName: string = '';
    private debouncedLoading: Callback | undefined;

    // on endpoint-name attribute changes
    @property({ attribute: 'endpoint-name' }) public set endpointName(endpointName: string) {
        if (!endpointName) { return; }
        // save endpointName
        this._endpointName = endpointName;

        if (this.attachmentsListUnsubscribe) {
            this.attachmentsListUnsubscribe();
        }

        // subscribe on attachments list data. use DynamicSelector and endpointName to determine which field we need to take from store
        this.attachmentsListUnsubscribe = store.subscribe(attachmentsListSelector((attachments: IListData<Attachment> | Attachment[] | undefined) => {
            if (!attachments) { return; }
            this.attachmentsList = Array.isArray(attachments) ? attachments : attachments.results;
        }, [endpointName], false));

        // save new function for attachments list loading
        this.debouncedLoading = debounce(() => {
            this.loadingInProcess = true;
            store
                .dispatch<AsyncEffect>(loadAttachmentsList(this._endpointName, this.additionalEndpointData))
                .catch(() => fireEvent(this, 'toast', { text: 'Can not load attachments' }))
                .finally(() => this.loadingInProcess = false);
        }, 100);
        // load attachments
        this.debouncedLoading();
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public formatDate(value: string, format: string = 'DD MMM YYYY'): string {
        if (!value) { return ''; }

        const date: Date = new Date(value);
        return date.toString() !== 'Invalid Date' ? moment.utc(date).format(format) : '';
    }

    public getTypeDisplayName(id: number): string {
        const type: DefaultDropdownOption | undefined = FILE_TYPES.find(({ value }: DefaultDropdownOption) => value === id);
        return type && type.display_name || '';
    }

    public openPopup(attachment?: Attachment): void {
        openDialog<IAttachmentPopupData>({
            dialog: 'edit-attachment-popup',
            data: {
                editedAttachment: attachment,
                attachmentTypes: FILE_TYPES,
                endpointName: this._endpointName,
                additionalEndpointData: this.additionalEndpointData
            }
        }).then(({ confirmed }: IDialogResponse<any>) => {
            if (!confirmed || !this.debouncedLoading) { return; }
            this.debouncedLoading();
        });
    }

    public openDeletePopup(id: number): void {
        openDialog<IRemmoveAttachmentPopupData>({
            dialog: 'remove-attachment-popup',
            data: { id, endpointName: this._endpointName, additionalEndpointData: this.additionalEndpointData }
        }).then(({ confirmed }: IDialogResponse<any>) => {
            if (!confirmed || !this.debouncedLoading) { return; }
            this.debouncedLoading();
        });
    }

    public static get styles(): CSSResult[] {
        return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles];
    }
}
