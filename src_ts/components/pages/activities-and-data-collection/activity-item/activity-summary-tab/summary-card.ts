import {css, LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import './completed-finding/completed-finding';
import {MethodsMixin} from '../../../../common/mixins/methods-mixin';
import {get, translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {template} from './summary-card.tpl';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
// import {FormBuilderCardStyles} from '@unicef-polymer/etools-form-builder/dist/lib/styles/form-builder-card.styles';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import {BOOL_TYPE, NUMBER_TYPE, SCALE_TYPE, TEXT_TYPE} from '../../../../common/dropdown-options';
import {clone} from 'ramda';
import '@unicef-polymer/etools-unicef/src/etools-radio/etools-radio-group';
import '@shoelace-style/shoelace/dist/components/radio/radio.js';
import {RadioButtonStyles} from '../../../../styles/radio-button-styles';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';

// eslint-disable-next-line
import '../../../activities-and-data-collection/activity-item/activity-summary-tab/summary-checklist-attachments-popup/summary-checklist-attachments-popup';
import {store} from '../../../../../redux/store';
import {Unsubscribe} from 'redux';
import {attachmentsTypesSelector} from '../../../../../redux/selectors/attachments-list.selectors';
import {loadAttachmentsTypes} from '../../../../../redux/effects/attachments-list.effects';
import {ACTIVITY_REPORT_ATTACHMENTS} from '../../../../../endpoints/endpoints-list';
import '@unicef-polymer/etools-form-builder/dist/form-fields/single-fields/text-field';
import '@unicef-polymer/etools-form-builder/dist/form-fields/single-fields/number-field';
import SlSwitch from '@shoelace-style/shoelace/dist/components/switch/switch';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

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
  @property() protected onTrackValue: boolean | null | undefined = null;
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
    this.onTrackValue = this.originalOverallInfo?.on_track;
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
      <div class="layout-vertical question-container">
        <div class="question-text">${finding.activity_question.text}</div>
        <div class="question-details">${finding.activity_question.specific_details}</div>
        <div class="flex-2 layout-horizontal layout-wrap">
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
                ?show-copy-arrow="${!finding.value &&
                this.isEditMode &&
                [TEXT_TYPE, NUMBER_TYPE].includes(finding.activity_question.question.answer_type)}"
                @copy-answer="${() => this.updateFinding(finding, completedFinding.value)}"
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
          <div class="overall-finding layout-horizontal ${this.isEditMode ? '' : 'readonly'}">
            <div class="flex-2 layout-horizontal layout-wrap" ?hidden="${!this.filteredOverallFindings.length}">
              ${this.filteredOverallFindings.map(
                (finding: CompletedOverallFinding) => html`
                  <completed-finding
                    class="completed-finding"
                    .completedFinding="${finding}"
                    .completedFindingTitle="${finding.narrative_finding}"
                    .completedFindingMethod="${this.getMethodName(finding.method, true)}"
                    .activityId="${this.activityId}"
                    ?show-copy-arrow="${(!this.overallInfo || !this.overallInfo.narrative_finding) && this.isEditMode}"
                    @copy-answer="${() => this.updateOverallFinding({narrative_finding: finding.narrative_finding})}"
                  ></completed-finding>
                `
              )}
            </div>
            <div class="flex-3">
              <etools-textarea
                id="details-input"
                .value="${(this.overallInfo && this.overallInfo.narrative_finding) || ''}"
                label="${translate('ACTIVITY_ADDITIONAL_INFO.SUMMARY.OVERALL_FINDING')}"
                ?readonly="${!this.isEditMode}"
                placeholder="${this.isEditMode
                  ? translate('ACTIVITY_ADDITIONAL_INFO.SUMMARY.OVERALL_FINDING_PLACEHOLDER')
                  : '—'}"
                @value-changed="${({detail}: CustomEvent) =>
                  this.updateOverallFinding({narrative_finding: detail.value})}"
              ></etools-textarea>
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
        <etools-radio-group value="checked">
          <sl-radio name="trackStatus" value="checked" class="epc-header-radio-button ${this.trackStatusColor}">
            ${translate(this.trackStatusText)}
          </sl-radio>
        </etools-radio-group>
        ${this.getAttachmentsButton()}
      `;
    }
  }

  /**
   * Open Attachments popup button. Is Hidden if OverallInfo property is null or if tab
   * is readonly and no attachments uploaded
   */
  protected getAttachmentsButton(): TemplateResult {
    const isReadonly: boolean = this.readonly || !this.attachmentsEndpoint;
    const showAttachmentsButton = Boolean(this.overallInfo && (!isReadonly || this.overallInfo.attachments.length));
    return showAttachmentsButton
      ? html`
          <etools-button id="editAo" variant="primary" @click="${this.openAttachmentsPopup}">
            <etools-icon name="${this.overallInfo!.attachments.length ? 'file-download' : 'file-upload'}"></etools-icon>
            ${this.getAttachmentsBtnText(this.overallInfo!.attachments.length)}
          </etools-button>
        `
      : html``;
  }

  protected getAttachmentsBtnText(attachmentsCount: number): string {
    if (attachmentsCount === 1) {
      return get('ACTIVITY_ITEM.DATA_COLLECTION.ATTACHMENTS_BUTTON_TEXT.SINGLE', {count: attachmentsCount});
    } else if (attachmentsCount > 1) {
      return get('ACTIVITY_ITEM.DATA_COLLECTION.ATTACHMENTS_BUTTON_TEXT.MULTIPLE', {count: attachmentsCount});
    } else {
      return get('ACTIVITY_ITEM.DATA_COLLECTION.ATTACHMENTS_BUTTON_TEXT.DEFAULT');
    }
  }

  protected getFindingTemplate(finding: SummaryFinding): TemplateResult {
    switch (finding.activity_question.question.answer_type) {
      case TEXT_TYPE:
        return html`
          ${this.getQuestionTooltip(finding.activity_question.question?.show_mandatory_warning)}
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
            ${this.getQuestionTooltip(finding.activity_question.question?.show_mandatory_warning)}
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
            ${this.getQuestionTooltip(finding.activity_question.question?.show_mandatory_warning)}
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

  getQuestionTooltip(show_mandatory_warning: boolean) {
    return show_mandatory_warning
      ? html`<sl-tooltip for="information-icon" placement="top" content="${translate('PLEASE_ANSWER')}">
          <etools-icon id="information-icon" name="info"></etools-icon>
        </sl-tooltip>`
      : ``;
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
    fireEvent(this, 'child-in-edit-mode-changed', {inEditMode: false});
  }

  /**
   * Reverts all changes to original data, resets original data fields, cancel edit using store.dispatch
   */
  protected cancelEdit(): void {
    this.findings = clone(this.originalFindings);
    this.overallInfo = clone(this.originalOverallInfo);
    this.isEditMode = false;
    fireEvent(this, 'child-in-edit-mode-changed', {inEditMode: false});
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
    if (Boolean(this.onTrackValue) !== this.originalOverallInfo.on_track) {
      changes.on_track = Boolean(this.onTrackValue);
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
      <div class="ontrack-container layout-horizontal">
        ${translate('ACTIVITY_ADDITIONAL_INFO.SUMMARY.ADDITIONAL_BUTTONS.OFF_TRACK')}
        <sl-switch
          ?readonly="${this.readonly}"
          ?checked="${this.overallInfo?.on_track || false}"
          @sl-change="${(event: CustomEvent) => this.toggleChange((event.target as SlSwitch).checked)}"
        ></sl-switch>
        ${translate('ACTIVITY_ADDITIONAL_INFO.SUMMARY.ADDITIONAL_BUTTONS.ON_TRACK')}
      </div>
    `;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      // FormBuilderCardStyles,
      layoutStyles,
      RadioButtonStyles,
      css`
        .completed-finding {
          flex-basis: 50%;
        }
        sl-switch {
          margin: 0 4px 0 15px;
        }
        sl-switch[readonly] {
          pointer-events: none;
        }
        .ontrack-container {
          margin-inline-end: 40px;
        }
        .flex-2 {
          -ms-flex: 2;
          -webkit-flex: 2;
          flex: 2;
        }
        .flex-3 {
          -ms-flex: 3;
          -webkit-flex: 3;
          flex: 3;
        }
        #information-icon {
          color: var(--warning-color);
          margin-bottom: -50px;
          margin-left: 15px;
        }
        .overall-finding {
          background-color: #ffffff;
        }
        .readonly {
          background-color: var(--secondary-background-color);
        }
      `
    ];
  }
}
