import {CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {clone} from 'ramda';
import './finding-types/text-finding';
import './finding-types/number-finding';
import './finding-types/scale-finding';
import {template} from './data-collection-card.tpl';
import {DataCollectionCardStyles} from './data-collection-card.styles';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {store} from '../../../../../redux/store';
import {
  editedFindingsTab,
  updateOverallAndFindingsState
} from '../../../../../redux/selectors/data-collection.selectors';
import {SetEditedDCChecklistCard} from '../../../../../redux/actions/data-collection.actions';
import {Unsubscribe} from 'redux';
import {BOOLEAN_TYPE, NUMBER_TYPE, SCALE_TYPE, TEXT_TYPE} from '../../../../common/dropdown-options';

@customElement('data-collection-card')
export class DataCollectionCard extends LitElement {
  @property({type: String}) cardId: string = (Math.random() * 100000000).toFixed();
  @property({type: String}) tabName: string = '';
  @property({type: Object}) overallInfo: DataCollectionOverall | null = null;
  @property({type: Array}) findings: DataCollectionFinding[] = [];
  @property({type: Boolean, attribute: 'readonly'}) readonly: boolean = false;

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
     * Subscription on store.dataCollection.editedFindingsTab
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

  protected getFindingTemplate(finding: DataCollectionFinding): TemplateResult {
    switch (finding.activity_question.question.answer_type) {
      case TEXT_TYPE:
        return html`
          <div class="finding-container">
            <text-finding
              .questionText="${finding.activity_question.question.text}"
              .isReadonly="${!this.isEditMode}"
              .value="${finding.value}"
              @value-changed="${({detail}: CustomEvent) => this.updateFinding(finding, detail.value)}"
            ></text-finding>
          </div>
        `;
      case NUMBER_TYPE:
        return html`
          <div class="finding-container">
            <number-finding
              .questionText="${finding.activity_question.question.text}"
              .isReadonly="${!this.isEditMode}"
              .value="${finding.value}"
              @value-changed="${({detail}: CustomEvent) => this.updateFinding(finding, detail.value)}"
            ></number-finding>
          </div>
        `;
      case BOOLEAN_TYPE:
      case SCALE_TYPE:
        return html`
          <div class="finding-container">
            <scale-finding
              .questionText="${finding.activity_question.question.text}"
              .options="${finding.activity_question.question.options}"
              .isReadonly="${!this.isEditMode}"
              .value="${finding.value}"
              @value-changed="${({detail}: CustomEvent) => this.updateFinding(finding, detail.value)}"
            ></scale-finding>
          </div>
        `;
      default:
        return html``;
    }
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
    store.dispatch(new SetEditedDCChecklistCard(null));
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
    return [DataCollectionCardStyles];
  }
}
