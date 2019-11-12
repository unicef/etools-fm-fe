import {CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {clone} from 'ramda';
import '../../../../common/layout/etools-card';
import '@polymer/paper-input/paper-textarea';
import './finding-types/text-finding';
import {InputStyles} from '../../../../styles/input-styles';
import {DataCollectionCardStyles} from './data-collection-card.styles';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {store} from '../../../../../redux/store';
import {
  editedFindingsTab,
  updateOverallAndFindingsState
} from '../../../../../redux/selectors/data-collection.selectors';
import {SetEditedDCChecklistCard} from '../../../../../redux/actions/data-collection.actions';
import {Unsubscribe} from 'redux';
import {translate} from '../../../../../localization/localisation';

@customElement('data-collection-card')
export class DataCollectionCard extends LitElement {
  @property({type: String}) cardId: string = (Math.random() * 100000000).toFixed();
  @property({type: String}) tabName: string = '';
  @property({type: Object}) overallInfo: DataCollectionOverall | null = null;
  @property({type: Array}) findings: DataCollectionFinding[] = [];

  @property() protected isEditMode: boolean = false;
  @property() protected blockEdit: boolean = false;
  @property() protected updateInProcess: boolean = false;

  private originalOverallInfo: DataCollectionOverall | null = null;
  private originalFindings: DataCollectionFinding[] = [];
  private updateUnsubscribe!: Unsubscribe;
  private editedTabUnsubscribe!: Unsubscribe;

  render(): TemplateResult | void {
    return html`
      ${InputStyles}
      <etools-card
        card-title="${this.tabName}"
        is-collapsible
        is-editable
        ?edit="${this.isEditMode && !this.updateInProcess}"
        ?hide-edit-button="${this.blockEdit}"
        @start-edit="${() => store.dispatch(new SetEditedDCChecklistCard(this.cardId))}"
        @save="${() => this.saveChanges()}"
        @cancel="${() => this.cancelEdit()}"
      >
        <div slot="content">
          <!-- Spinner -->
          <etools-loading
            ?active="${this.updateInProcess}"
            loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
          ></etools-loading>

          <!-- Overall Finding field. Is Hidden if overallInfo property is null -->
          ${this.overallInfo
            ? html`
                <div class="overall-finding">
                  <paper-textarea
                    id="details-input"
                    class="without-border"
                    .value="${(this.overallInfo && this.overallInfo.narrative_finding) || ''}"
                    max-rows="3"
                    label="Overall finding"
                    ?disabled="${!this.isEditMode}"
                    placeholder="${this.isEditMode ? 'Enter Overall finding' : '-'}"
                    @value-changed="${({detail}: CustomEvent) =>
                      this.updateOverallFinding({narrative_finding: detail.value})}"
                  ></paper-textarea>
                </div>
              `
            : ''}

          <!-- Findings table with different findings types -->
          ${this.findings
            .filter((finding: DataCollectionFinding) => finding.activity_question.question.answer_type === 'text')
            .map(
              (finding: DataCollectionFinding) => html`
                <div class="finding-container">
                  <text-finding
                    .questionText="${finding.activity_question.question.text}"
                    .isReadonly="${!this.isEditMode}"
                    .value="${finding.value}"
                    @value-changed="${({detail}: CustomEvent) => this.updateFinding(finding, detail.value)}"
                  ></text-finding>
                </div>
              `
            )}
        </div>
      </etools-card>
    `;
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

  /**
   * On overall finding input changes
   * we need to perform update for cancelEdit() correct behaviour
   */
  private updateOverallFinding(newData: Partial<DataCollectionOverall>): void {
    const oldData: Partial<DataCollectionOverall> = this.overallInfo || {};
    this.overallInfo = {...oldData, ...newData} as DataCollectionOverall;
  }

  /**
   * On finding item input changes
   * we need to run performUpdate for cancelEdit() correct behaviour
   */
  private updateFinding(finding: DataCollectionFinding, value: any): void {
    finding.value = value;
    this.performUpdate();
  }

  static get styles(): CSSResultArray {
    return [DataCollectionCardStyles];
  }
}
