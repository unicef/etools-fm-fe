import {LitElement, TemplateResult, CSSResult, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {template} from './attachments-list.tpl';
import {loadAttachmentsList, loadAttachmentsTypes} from '../../../redux/effects/attachments-list.effects';
import {ACTIVITY_RELATED_DOCUMENTS, ACTIVITY_REPORT_ATTACHMENTS} from '../../../endpoints/endpoints-list';
import {store} from '../../../redux/store';
import {attachmentsListSelector, attachmentsTypesSelector} from '../../../redux/selectors/attachments-list.selectors';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import {Unsubscribe} from 'redux';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {SharedStyles} from '../../styles/shared-styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../styles/card-styles';
import {attachmentsList} from '../../../redux/reducers/attachments-list.reducer';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {CommentElementMeta, CommentsMixin} from '../comments/comments-mixin';
import {injectInfoTooltipHeightFix} from './info-tooltip-height-fix';

store.addReducers({attachmentsList});

@customElement('attachments-list')
export class AttachmentsListComponent extends CommentsMixin(LitElement) {
  @property() loadingInProcess = false;
  @property({type: String, attribute: 'tab-title-key'})
  tabTitleKey = 'ATTACHMENTS_LIST.TITLE';
  @property({type: Boolean, attribute: 'readonly'}) readonly = false;
  @property() attachmentsTypes: AttachmentType[] = [];
  @property({type: Boolean}) lowResolutionLayout = false;
  @property({type: String, attribute: 'related-to'}) relatedTo: string = '';
  @property({type: Array}) attachmentsList: IAttachment[] = [];
  additionalEndpointData: GenericObject = {};
  commentsModeInitialize = false;

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

    // subscribe on attachments list data. use DynamicSelector and endpointName
    // to determine which field we need to take from store
    this.attachmentsListUnsubscribe = store.subscribe(
      attachmentsListSelector(
        (attachments: IListData<IAttachment> | IAttachment[] | undefined) => {
          if (!attachments) {
            return;
          }
          this.attachmentsList = [...(Array.isArray(attachments) ? attachments : attachments.results)];
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
        .catch(() => fireEvent(this, 'toast', {text: getTranslation('ERROR_ATTACHEMENT_LOAD')}))
        .finally(() => (this.loadingInProcess = false));
    }, 100);
    // load attachments
    this.debouncedLoading();
  }

  render(): TemplateResult {
    return template.call(this);
  }

  /** Tooltip for a document category label (from API description in attachmentsTypes). */
  getDocumentCategoryTooltip(label: string): string {
    const type = this.attachmentsTypes?.find((t) => t.label === label);
    const description = type?.description ?? '';
    // Preserve new lines in tooltip (info-icon-tooltip renders HTML)
    return description ? description.replace(/\n/g, '<br>') : '';
  }

  /** For Related Documents we load file types from data-collection (ACTIVITY_REPORT_ATTACHMENTS). */
  private get _typesStoreKey(): string {
    return this._endpointName === ACTIVITY_RELATED_DOCUMENTS ? ACTIVITY_REPORT_ATTACHMENTS : this._endpointName;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.attachmentsTypes = store.getState().attachmentsList.attachmentsTypes[this._typesStoreKey] ?? [];
    if (!this.attachmentsTypes.length) {
      store.dispatch<AsyncEffect>(loadAttachmentsTypes(this._typesStoreKey, this.additionalEndpointData));
    }

    this.attachmentsTypesUnsubscribe = store.subscribe(
      attachmentsTypesSelector(
        (types: AttachmentType[] | undefined) => {
          if (types) {
            this.attachmentsTypes = types;
          }
        },
        [this._typesStoreKey]
      )
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.attachmentsTypesUnsubscribe();
  }

  firstUpdated(): void {
    injectInfoTooltipHeightFix(this.shadowRoot!);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (
      changedProperties.has('attachmentsList') ||
      (changedProperties.has('loadingInProcess') && this.attachmentsList.length && !this.loadingInProcess)
    ) {
      this.setCommentMode();
    }
    injectInfoTooltipHeightFix(this.shadowRoot!);
  }

  openPopup(attachment?: IAttachment): void {
    const typesFromStore = store.getState().attachmentsList?.attachmentsTypes?.[this._endpointName];
    const attachmentTypes = Array.isArray(typesFromStore) ? typesFromStore : this.attachmentsTypes;
    openDialog<IAttachmentPopupData>({
      dialog: 'edit-attachment-popup',
      dialogData: {
        editedAttachment: attachment,
        attachmentTypes: attachmentTypes || [],
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

  getSpecialElements(container: HTMLElement): CommentElementMeta[] {
    const element: HTMLElement = container.shadowRoot!.querySelector('#wrapper') as HTMLElement;
    const relatedTo: string = container.getAttribute('related-to') as string;
    const relatedToDescription = container.getAttribute('related-to-description') as string;
    return [{element, relatedTo, relatedToDescription}];
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
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      layoutStyles,
      CardStyles,
      css`
        /* Allow tooltip popup to extend outside table cell (avoid 5–6px clipped line) */
        .attachments-list-table-section {
          overflow: visible;
        }
        .attachments-list-table-section *[slot='row-data'] {
          overflow: visible;
        }
        .col-file-type-with-tooltip {
          overflow: visible;
          min-width: 0;
        }
        /* Tooltip content container: height follows content (info-icon-tooltip from etools-unicef) */
        info-icon-tooltip::part(etools-iit-content) {
          height: auto;
          min-height: auto;
          max-height: 80vh;
          overflow: auto;
        }
      `
    ];
  }
}
