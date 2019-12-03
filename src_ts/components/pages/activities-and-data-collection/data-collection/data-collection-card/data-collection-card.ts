import {CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {clone} from 'ramda';
import './finding-types/text-finding';
import './finding-types/number-finding';
import './finding-types/scale-finding';
import './attachments-popup/checklist-attachments';
import {template} from './data-collection-card.tpl';
import {DataCollectionCardStyles} from './data-collection-card.styles';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {store} from '../../../../../redux/store';
import {Unsubscribe} from 'redux';
import {BOOLEAN_TYPE, NUMBER_TYPE, SCALE_TYPE, TEXT_TYPE} from '../../../../common/dropdown-options';
import {openDialog} from '../../../../utils/dialog';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {
  editedFindingsTab,
  updateOverallAndFindingsState
} from '../../../../../redux/selectors/findings-components.selectors';
import {SetEditedFindingsCard} from '../../../../../redux/actions/findings-components.actions';

@customElement('data-collection-card')
export class DataCollectionCard extends LitElement {
  @property({type: String}) cardId: string = (Math.random() * 100000000).toFixed();
  @property({type: String}) tabName: string = '';
  @property({type: Object}) overallInfo: DataCollectionOverall | null = null;
  @property({type: Array}) findings: DataCollectionFinding[] = [];
  @property({type: Boolean, attribute: 'readonly'}) readonly: boolean = false;
  attachmentsEndpoint?: string;

  @property() protected isEditMode: boolean = false;
  @property() protected blockEdit: boolean = false;
  @property() protected updateInProcess: boolean = false;

  private originalOverallInfo: DataCollectionOverall | null = null;
  private originalFindings: DataCollectionFinding[] = [];
  private updateUnsubscribe!: Unsubscribe;
  private editedTabUnsubscribe!: Unsubscribe;

  render(): TemplateResult | void {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    /**
     * Subscription on store.findingsComponents.editedFindingsComponent
     * Toggle isEditMode property
     * Hide edit button if current tub is not edited tab (blockEdit property)
     */
    this.editedTabUnsubscribe = store.subscribe(
      editedFindingsTab((editedTab: null | string) => {
        const needToEnableEdit: boolean = editedTab === this.cardId && !this.isEditMode;
        const needToDisableEdit: boolean = editedTab === null && this.isEditMode;
        if (needToEnableEdit) {
          this.enableEditMode();
        } else if (needToDisableEdit) {
          this.isEditMode = false;
        }
        this.blockEdit = editedTab !== null && editedTab !== this.cardId;
      }, false)
    );

    /**
     * Show etools-loading only if current card is now editable and request is in process
     */
    this.updateUnsubscribe = store.subscribe(
      updateOverallAndFindingsState((updateState: null | boolean) => {
        this.updateInProcess = this.isEditMode && Boolean(updateState);
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.editedTabUnsubscribe();
    this.updateUnsubscribe();
  }

  openAttachmentsPopup(): void {
    if (!this.overallInfo) {
      return;
    }
    openDialog<AttachmentsPopupData, AttachmentDialogResponse>({
      dialog: 'checklist-attachments-popup',
      dialogData: {
        attachments: this.overallInfo.attachments,
        updateUrl: this.attachmentsEndpoint,
        title: `Attachments for ${this.tabName}`
      },
      readonly: this.readonly || !this.attachmentsEndpoint
    }).then(({confirmed, response}: IDialogResponse<AttachmentDialogResponse>) => {
      if (!confirmed || (response && response.noChanges)) {
        return;
      }

      fireEvent(this, 'attachments-updated');
    });
  }

  protected getAttachmentsBtnText(attachmentsCount: number): string {
    if (attachmentsCount === 1) {
      return `${attachmentsCount} File`;
    } else if (attachmentsCount > 1) {
      return `${attachmentsCount} Files`;
    } else {
      return 'Upload Files';
    }
  }

  protected getFindingTemplate(finding: DataCollectionFinding): TemplateResult {
    switch (finding.activity_question.question.answer_type) {
      case TEXT_TYPE:
        return html`
          <div class="finding-container">
            <text-finding
              ?is-readonly="${!this.isEditMode}"
              .value="${finding.value}"
              @value-changed="${({detail}: CustomEvent) => this.updateFinding(finding, detail.value)}"
            >
              ${this.getFindingQuestion(finding)}
            </text-finding>
          </div>
        `;
      case NUMBER_TYPE:
        return html`
          <div class="finding-container">
            <number-finding
              ?is-readonly="${!this.isEditMode}"
              .value="${finding.value}"
              @value-changed="${({detail}: CustomEvent) => this.updateFinding(finding, detail.value)}"
            >
              ${this.getFindingQuestion(finding)}
            </number-finding>
          </div>
        `;
      case BOOLEAN_TYPE:
      case SCALE_TYPE:
        return html`
          <div class="finding-container">
            <scale-finding
              .options="${finding.activity_question.question.options}"
              ?is-readonly="${!this.isEditMode}"
              .value="${finding.value}"
              @value-changed="${({detail}: CustomEvent) => this.updateFinding(finding, detail.value)}"
            >
              ${this.getFindingQuestion(finding)}
            </scale-finding>
          </div>
        `;
      default:
        return html``;
    }
  }

  protected getFindingQuestion(finding: DataCollectionFinding): TemplateResult {
    return html`
      <div class="layout vertical question-container">
        <div class="question-text">${finding.activity_question.question.text}</div>
        <div class="question-details">${finding.activity_question.specific_details}</div>
      </div>
    `;
  }

  protected getOverallFindingTemplate(): TemplateResult {
    return this.overallInfo
      ? html`
          <div class="overall-finding">
            <paper-textarea
              id="details-input"
              class="without-border"
              .value="${(this.overallInfo && this.overallInfo.narrative_finding) || ''}"
              label="Overall finding"
              ?disabled="${!this.isEditMode}"
              placeholder="${this.isEditMode ? 'Enter Overall finding' : '-'}"
              @value-changed="${({detail}: CustomEvent) =>
                this.updateOverallFinding({narrative_finding: detail.value})}"
            ></paper-textarea>
          </div>
        `
      : html``;
  }

  /**
   * Open Attachments popup button. Is Hidden if OverallInfo property is null or if tab is readonly and no attachments uploaded
   */
  protected getAdditionalButtons(): TemplateResult {
    const isReadonly: boolean = this.readonly || !this.attachmentsEndpoint;
    const showAttachmentsButton: boolean = Boolean(
      this.overallInfo && (!isReadonly || this.overallInfo.attachments.length)
    );
    return showAttachmentsButton
      ? html`
          <paper-button @click="${() => this.openAttachmentsPopup()}" class="attachments-button">
            <iron-icon icon="${this.overallInfo!.attachments.length ? 'file-download' : 'file-upload'}"></iron-icon>
            ${this.getAttachmentsBtnText(this.overallInfo!.attachments.length)}
          </paper-button>
        `
      : html``;
  }

  /**
   * Enables edit mode, saves copy of original data that allows to get changes later
   */
  protected enableEditMode(): void {
    if (this.isEditMode) {
      return;
    }
    this.isEditMode = true;
    this.originalOverallInfo = clone(this.overallInfo);
    this.originalFindings = clone(this.findings);
  }

  /**
   * Gets data changes, fires event
   */
  protected saveChanges(): void {
    const overall: Partial<DataCollectionOverall> | null = this.getOverallInfoChanges();
    const findings: Partial<DataCollectionFinding>[] | null = this.getFindingsChanges();
    if (!overall && !findings) {
      this.cancelEdit();
    } else {
      fireEvent(this, 'update-data', {findings, overall});
    }
  }

  /**
   * Reverts all changes to original data, resets original data fields, cancel edit using store.dispatch
   */
  protected cancelEdit(): void {
    this.findings = this.originalFindings;
    this.overallInfo = this.originalOverallInfo;
    this.originalOverallInfo = null;
    this.originalFindings = [];
    store.dispatch(new SetEditedFindingsCard(null));
  }

  /**
   * On overall finding input changes
   * we need to perform update for cancelEdit() correct behaviour
   */
  protected updateOverallFinding(newData: Partial<DataCollectionOverall>): void {
    const oldData: Partial<DataCollectionOverall> = this.overallInfo || {};
    this.overallInfo = {...oldData, ...newData} as DataCollectionOverall;
  }

  /**
   * On finding item input changes
   * we need to run performUpdate for cancelEdit() correct behaviour
   */
  protected updateFinding(finding: DataCollectionFinding, value: any): void {
    finding.value = value;
    this.performUpdate();
  }

  /**
   * Compares narrative_finding field, returns null if narrative_finding is not changed
   */
  private getOverallInfoChanges(): Partial<DataCollectionOverall> | null {
    if (!this.originalOverallInfo || !this.overallInfo) {
      return null;
    }
    const finding: string | null =
      this.originalOverallInfo.narrative_finding !== this.overallInfo.narrative_finding
        ? this.overallInfo.narrative_finding
        : null;
    return finding
      ? {
          id: this.overallInfo.id,
          narrative_finding: finding
        }
      : null;
  }

  /**
   * Compares and returns changed findings
   */
  private getFindingsChanges(): Partial<DataCollectionFinding>[] | null {
    const changes: Partial<DataCollectionFinding>[] = this.findings
      .filter((finding: DataCollectionFinding, index: number) => finding.value !== this.originalFindings[index].value)
      .map(({id, value}: DataCollectionFinding) => ({id, value}));
    return changes.length ? changes : null;
  }

  static get styles(): CSSResultArray {
    return [DataCollectionCardStyles, FlexLayoutClasses];
  }
}
