import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import '@polymer/paper-toggle-button';
import {fireEvent} from '../../../../utils/fire-custom-event';
import './completed-finding/completed-finding';
import {MethodsMixin} from '../../../../common/mixins/methods-mixin';
import {get, translate} from 'lit-translate';
import {template} from './summary-card.tpl';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {FormBuilderCardStyles} from '@unicef-polymer/etools-form-builder';
import {openDialog} from '../../../../utils/dialog';
import {BOOL_TYPE, NUMBER_TYPE, SCALE_TYPE, TEXT_TYPE} from '../../../../common/dropdown-options';
import {clone} from 'ramda';
import '@polymer/paper-radio-group/paper-radio-group';
import '@polymer/paper-radio-button/paper-radio-button';
import {RadioButtonStyles} from '../../../../styles/radio-button-styles';
import '../../../activities-and-data-collection/activity-item/activity-summary-tab/summary-checklist-attachments-popup/summary-checklist-attachments-popup';
import {store} from '../../../../../redux/store';
import {Unsubscribe} from 'redux';
import {attachmentsTypesSelector} from '../../../../../redux/selectors/attachments-list.selectors';
import {loadAttachmentsTypes} from '../../../../../redux/effects/attachments-list.effects';
import {ACTIVITY_REPORT_ATTACHMENTS} from '../../../../../endpoints/endpoints-list';
import '@unicef-polymer/etools-form-builder/dist/form-fields/text-field';
import '@unicef-polymer/etools-form-builder/dist/form-fields/number-field';

@customElement('summary-card')
export class SummaryCard extends MethodsMixin(LitElement) {
  @property() activityId: number | null = null;
  @property({type: String}) tabName = '';
  @property({type: Object}) overallInfo: SummaryOverall | null = null;
  @property({type: Array}) findings: SummaryFinding[] = [];
  @property({type: Boolean, attribute: 'readonly'}) readonly = false;
  @property() protected isEditMode = false;
  @property() protected blockEdit = false;
  @property() protected updateInProcess = false;
  @property() protected onTrackValue: boolean | null = null;
  @property() protected trackStatusText = '';
  @property() protected trackStatusColor = '';
  @property() protected orginalTrackStatus: boolean | null = null;
  @property() protected attachmentTypes: AttachmentType[] = [];
  attachmentsEndpoint?: string;

  private originalOverallInfo: SummaryOverall | null = null;
  private originalFindings: SummaryFinding[] = [];
  private attachmentsTypesUnsubscribe!: Unsubscribe;
  private _attachTypesEndpointName!: string;

  render(): TemplateResult | void {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.originalFindings = clone(this.findings);
    this.originalOverallInfo = clone(this.overallInfo);
    this._attachTypesEndpointName = ACTIVITY_REPORT_ATTACHMENTS;
    this.attachmentTypes = store.getState().attachmentsList.attachmentsTypes[this._attachTypesEndpointName];
    if (!this.attachmentTypes || !this.attachmentTypes.length) {
      store.dispatch<AsyncEffect>(
        loadAttachmentsTypes(this._attachTypesEndpointName, {id: this.originalOverallInfo!.id})
      );
    }

    this.attachmentsTypesUnsubscribe = store.subscribe(
      attachmentsTypesSelector(
        (types: AttachmentType[] | undefined) => {
          if (types) {
            this.attachmentTypes = types;
          }
        },
        [this._attachTypesEndpointName]
      )
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.attachmentsTypesUnsubscribe();
  }

  openAttachmentsPopup(): void {
    if (!this.overallInfo) {
      return;
    }
    openDialog<AttachmentsPopupData>({
      dialog: 'summary-checklist-attachments-popup',
      dialogData: {
        attachments: this.overallInfo.attachments,
        updateUrl: this.attachmentsEndpoint,
        attachmentTypes: this.attachmentTypes,
        title: `${get('ACTIVITY_ITEM.DATA_COLLECTION.ATTACHMENTS_POPUP_TITLE')} ${this.tabName}`
      },
      readonly: this.readonly || !this.attachmentsEndpoint
    }).then(({confirmed}: IEtoolsDialogResponse) => {
      if (!confirmed) {
        return;
      }

      fireEvent(this, 'attachments-updated');
    });
  }

  private get filteredOverallFindings(): CompletedOverallFinding[] {
    return (
      (this.overallInfo &&
        this.overallInfo.findings.filter((finding: CompletedOverallFinding) => Boolean(finding.narrative_finding))) ||
      []
    );
  }

  protected getFindingQuestion(finding: SummaryFinding): TemplateResult {
    return html`
      <div class="layout vertical question-container">
        <div class="question-text">${finding.activity_question.text}</div>
        <div class="question-details">${finding.activity_question.specific_details}</div>
        <div class="flex-2 layout horizontal wrap">
          ${finding.activity_question.findings.map(
            (completedFinding: CompletedFinding) => html`
              <completed-finding
                class="completed-finding"
                .completedFinding="${completedFinding}"
                .completedFindingTitle="${this.getFindingAnswer(
                  completedFinding.value,
                  finding.activity_question.question
                )}"
                .completedFindingMethod="${this.getMethodName(completedFinding.method, true)}"
                .activityId="${this.activityId}"
              ></completed-finding>
            `
          )}
        </div>
      </div>
    `;
  }

  protected getOverallFindingTemplate(): TemplateResult {
    return this.overallInfo
      ? html`
          <div class="overall-finding layout horizontal">
            <div class="flex-2 layout horizontal wrap" ?hidden="${!this.filteredOverallFindings.length}">
              ${this.filteredOverallFindings.map(
                (finding: CompletedOverallFinding) => html`
                  <completed-finding
                    class="completed-finding"
                    .completedFinding="${finding}"
                    .completedFindingTitle="${finding.narrative_finding}"
                    .completedFindingMethod="${this.getMethodName(finding.method, true)}"
                    .activityId="${this.activityId}"
                  ></completed-finding>
                `
              )}
            </div>
            <div class="flex-3">
              <paper-textarea
                id="details-input"
                class="without-border"
                .value="${(this.overallInfo && this.overallInfo.narrative_finding) || ''}"
                label="Overall finding"
                ?disabled="${!this.isEditMode}"
                placeholder="${this.isEditMode
                  ? translate('ACTIVITY_ADDITIONAL_INFO.SUMMARY.OVERALL_FINDING_PLACEHOLDER')
                  : '—'}"
                @value-changed="${({detail}: CustomEvent) =>
                  this.updateOverallFinding({narrative_finding: detail.value})}"
              ></paper-textarea>
            </div>
          </div>
        `
      : html``;
  }

  protected updateOverallFinding(newData: Partial<SummaryOverall>): void {
    const oldData: Partial<SummaryOverall> = this.overallInfo || {};
    this.overallInfo = {...oldData, ...newData} as SummaryOverall;
  }

  protected getAdditionalButtons(): TemplateResult {
    if (this.isEditMode) {
      return html` ${this.findingsStatusButton()} ${this.getAttachmentsButton()} `;
    } else {
      if (this.overallInfo?.on_track == null) {
        this.trackStatusText = 'ACTIVITY_ADDITIONAL_INFO.SUMMARY.ADDITIONAL_BUTTONS.NOT_MONITORED';
        this.trackStatusColor = 'notMonitored';
      } else {
        if (this.overallInfo?.on_track) {
          this.trackStatusText = 'ACTIVITY_ADDITIONAL_INFO.SUMMARY.ADDITIONAL_BUTTONS.ON_TRACK';
          this.trackStatusColor = '';
        } else {
          this.trackStatusText = 'ACTIVITY_ADDITIONAL_INFO.SUMMARY.ADDITIONAL_BUTTONS.OFF_TRACK';
          this.trackStatusColor = 'offTrack';
        }
      }
      return html`
        <paper-radio-group>
          <paper-radio-button name="trackStatus" checked class="epc-header-radio-button ${this.trackStatusColor}">
            ${translate(this.trackStatusText)}
          </paper-radio-button>
        </paper-radio-group>
        ${this.getAttachmentsButton()}
      `;
    }
  }

  /**
   * Open Attachments popup button. Is Hidden if OverallInfo property is null or if tab is readonly and no attachments uploaded
   */
  protected getAttachmentsButton(): TemplateResult {
    const isReadonly: boolean = this.readonly || !this.attachmentsEndpoint;
    const showAttachmentsButton = Boolean(this.overallInfo && (!isReadonly || this.overallInfo.attachments.length));
    return showAttachmentsButton
      ? html`
          <paper-button @click="${() => this.openAttachmentsPopup()}" class="attachments-button">
            <iron-icon icon="${this.overallInfo!.attachments.length ? 'file-download' : 'file-upload'}"></iron-icon>
            ${this.getAttachmentsBtnText(this.overallInfo!.attachments.length)}
          </paper-button>
        `
      : html``;
  }

  protected getAttachmentsBtnText(attachmentsCount: number): Callback {
    if (attachmentsCount === 1) {
      return translate('ACTIVITY_ITEM.DATA_COLLECTION.ATTACHMENTS_BUTTON_TEXT.SINGLE', {count: attachmentsCount});
    } else if (attachmentsCount > 1) {
      return translate('ACTIVITY_ITEM.DATA_COLLECTION.ATTACHMENTS_BUTTON_TEXT.MULTIPLE', {count: attachmentsCount});
    } else {
      return translate('ACTIVITY_ITEM.DATA_COLLECTION.ATTACHMENTS_BUTTON_TEXT.DEFAULT');
    }
  }

  protected getFindingTemplate(finding: SummaryFinding): TemplateResult {
    switch (finding.activity_question.question.answer_type) {
      case TEXT_TYPE:
        return html`
          <div class="finding-container">
            <text-field
              ?is-readonly="${!this.isEditMode}"
              .value="${finding.value}"
              @value-changed="${({detail}: CustomEvent) => this.updateFinding(finding, detail.value)}"
            >
              ${this.getFindingQuestion(finding)}
            </text-field>
          </div>
        `;
      case NUMBER_TYPE:
        return html`
          <div class="finding-container">
            <number-field
              ?is-readonly="${!this.isEditMode}"
              .value="${finding.value}"
              @value-changed="${({detail}: CustomEvent) => this.updateFinding(finding, detail.value)}"
            >
              ${this.getFindingQuestion(finding)}
            </number-field>
          </div>
        `;
      case BOOL_TYPE:
      case SCALE_TYPE:
        return html`
          <div class="finding-container">
            <scale-field
              .options="${finding.activity_question.question.options}"
              ?is-readonly="${!this.isEditMode}"
              .value="${finding.value}"
              @value-changed="${({detail}: CustomEvent) => this.updateFinding(finding, detail.value)}"
            >
              ${this.getFindingQuestion(finding)}
            </scale-field>
          </div>
        `;
      default:
        return html``;
    }
  }

  /**
   * Gets data changes, fires event
   */
  protected saveChanges(): void {
    const overall: Partial<DataCollectionOverall> | null = this.getOverallInfoChanges();
    const findings: Partial<SummaryFinding>[] | null = this.getFindingsChanges();

    if (!overall && !findings) {
      this.cancelEdit();
    } else {
      fireEvent(this, 'update-data', {findings, overall});
      this.isEditMode = false;
    }
  }

  /**
   * Reverts all changes to original data, resets original data fields, cancel edit using store.dispatch
   */
  protected cancelEdit(): void {
    this.findings = clone(this.originalFindings);
    this.overallInfo = clone(this.originalOverallInfo);
    this.isEditMode = false;
  }

  /**
   * On finding item input changes
   * we need to run requestUpdate for cancelEdit() correct behaviour
   */
  protected updateFinding(finding: SummaryFinding, value: any): void {
    finding.value = value;
    this.requestUpdate();
  }

  /**
   * Compares narrative_finding field, returns null if narrative_finding is not changed
   */
  private getOverallInfoChanges(): Partial<SummaryOverall> | null {
    if (!this.originalOverallInfo || !this.overallInfo) {
      return null;
    }
    const changes: GenericObject = {};
    if (this.originalOverallInfo.narrative_finding !== this.overallInfo.narrative_finding) {
      changes.narrative_finding = this.overallInfo.narrative_finding;
    }
    if (this.onTrackValue !== this.originalOverallInfo.on_track) {
      changes.on_track = this.onTrackValue;
    }
    if (Object.keys(changes).length) {
      changes.id = this.overallInfo.id;
      return changes;
    }
    return null;
  }

  /**
   * Compares and returns changed findings
   */
  private getFindingsChanges(): Partial<SummaryFinding>[] | null {
    const changes: Partial<SummaryFinding>[] = this.findings
      .filter((finding: SummaryFinding, index: number) => finding.value !== this.originalFindings[index].value)
      .map(({id, value}: SummaryFinding) => ({id, value}));

    return changes.length ? changes : null;
  }

  private toggleChange(onTrackState: boolean): void {
    if (!this.overallInfo) {
      return;
    }
    this.onTrackValue = onTrackState;
  }

  private getFindingAnswer(value: string, question: IChecklistQuestion): string {
    if (!question.options.length) {
      return value;
    } else {
      const option: QuestionOption | undefined = question.options.find(
        (option: QuestionOption) => option.value === value
      );
      return (option && option.label) || '';
    }
  }

  private findingsStatusButton(): TemplateResult {
    return html`
      <div class="ontrack-container layout horizontal">
        ${translate('ACTIVITY_ADDITIONAL_INFO.SUMMARY.ADDITIONAL_BUTTONS.OFF_TRACK')}
        <paper-toggle-button
          ?readonly="${this.readonly}"
          ?checked="${this.overallInfo?.on_track || false}"
          @checked-changed="${({detail}: CustomEvent) => this.toggleChange(detail.value)}"
        ></paper-toggle-button>
        ${translate('ACTIVITY_ADDITIONAL_INFO.SUMMARY.ADDITIONAL_BUTTONS.ON_TRACK')}
      </div>
    `;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      FormBuilderCardStyles,
      FlexLayoutClasses,
      RadioButtonStyles,
      css`
        .completed-finding {
          flex-basis: 50%;
        }
        paper-toggle-button {
          margin: 0 4px 0 15px;
          --paper-toggle-button-unchecked-button-color: var(--error-color);
          --paper-toggle-button-unchecked-bar-color: var(--error-color);
        }
        paper-toggle-button[readonly] {
          pointer-events: none;
        }
        .ontrack-container {
          margin-right: 40px;
        }
      `
    ];
  }
}
