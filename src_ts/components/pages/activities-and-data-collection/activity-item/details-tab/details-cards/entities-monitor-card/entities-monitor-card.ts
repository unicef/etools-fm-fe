import {css, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {SharedStyles} from '../../../../../../styles/shared-styles';
import {BaseDetailsCard} from '../base-details-card';
import {store} from '../../../../../../../redux/store';
import {SetEditedDetailsCard} from '../../../../../../../redux/actions/activity-details.actions';
import {CpOutputsMixin} from '../../../../../../common/mixins/cp-outputs-mixin';
import {PartnersMixin} from '../../../../../../common/mixins/partners-mixin';
import './entities-list-and-popups/entries-list';
import clone from 'ramda/es/clone';
import './entities-list-and-popups/partner-popup';
import './entities-list-and-popups/cp-output-popup';
import './entities-list-and-popups/intervention-popup';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import {simplifyValue} from '@unicef-polymer/etools-utils/dist/equality-comparisons.util';
import {InterventionsMixin} from '../../../../../../common/mixins/interventions-mixin';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {FormBuilderCardStyles} from '@unicef-polymer/etools-form-builder/dist/lib/styles/form-builder-card.styles';
import {CommentElementMeta, CommentsMixin} from '../../../../../../common/comments/comments-mixin';

export const CARD_NAME = 'entities-monitor';
const ELEMENT_FIELDS: (keyof IActivityDetails)[] = ['cp_outputs', 'partners', 'interventions'];

@customElement('entities-monitor-card')
export class EntitiesMonitorCard extends CommentsMixin(
  InterventionsMixin(PartnersMixin(CpOutputsMixin(BaseDetailsCard)))
) {
  @property() activityPartners: IActivityPartner[] = [];
  @property() activityCpOutputs: IActivityCPOutput[] = [];
  @property() activityInterventions: IActivityIntervention[] = [];

  set data(data: IActivityDetails) {
    super.data = data;
    this.activityPartners = clone(data?.partners);
    this.activityCpOutputs = clone(data?.cp_outputs);
    this.activityInterventions = clone(data?.interventions);
  }

  render(): TemplateResult {
    return html`
      <style>
        ${FormBuilderCardStyles}
      </style>
      <etools-card
        related-to="entities_to_monitor"
        comments-container
        card-title="${translate('ACTIVITY_DETAILS.ENTRIES_TO_MONITOR')}"
        ?is-editable="${this.havePossibilityToEditCard(CARD_NAME, ELEMENT_FIELDS)}"
        ?edit="${this.isEditMode}"
        @start-edit="${() => this.startEdit()}"
        @save="${() => this.save()}"
        @cancel="${() => this.cancel()}"
      >
        <div class="card-content" slot="content">
          <!--   Spinner for loading data   -->
          <etools-loading
            ?active="${this.isLoad}"
            loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
          ></etools-loading>

          <!--   Spinner for updating data   -->
          <etools-loading
            ?active="${this.isUpdate}"
            loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
          ></etools-loading>

          <div class="row">
            <!--    Partners List    -->
            <entries-list
              class="col-md-4 col-12"
              .nameList="${translate('ACTIVITY_DETAILS.PARTNERS')}"
              .formatItem="${(item: EtoolsPartner) => item.name}"
              .items="${this.activityPartners}"
              ?is-readonly="${!this.isEditMode}"
              @add-entry="${() => this.openAddPartner()}"
              @remove-entry="${({detail}: CustomEvent) =>
                this.removeItem<EtoolsPartner>(detail.id, 'partners', 'activityPartners')}"
            >
            </entries-list>

            <!--    CP Outputs List    -->
            <entries-list
              class="col-md-4 col-12"
              .nameList="${translate('ACTIVITY_DETAILS.CP_OUTPUTS')}"
              .formatItem="${(item: EtoolsCpOutput) => item.name}"
              .items="${this.activityCpOutputs}"
              ?is-readonly="${!this.isEditMode}"
              @add-entry="${() => this.openAddCpOutput()}"
              @remove-entry="${({detail}: CustomEvent) =>
                this.removeItem<EtoolsCpOutput>(detail.id, 'cp_outputs', 'activityCpOutputs')}"
            >
            </entries-list>

            <!--    Interventions List    -->
            <entries-list
              class="col-md-4 col-12"
              .nameList="${translate('ACTIVITY_DETAILS.INTERVENTIONS')}"
              .formatItem="${(item: EtoolsIntervention) => this.getPDText(item)}"
              .items="${this.activityInterventions}"
              ?is-readonly="${!this.isEditMode}"
              @add-entry="${() => this.openAddIntervention()}"
              @remove-entry="${({detail}: CustomEvent) =>
                this.removeItem<EtoolsIntervention>(detail.id, 'interventions', 'activityInterventions')}"
            >
            </entries-list>
          </div>
        </div>
      </etools-card>
    `;
  }

  getSpecialElements(container: HTMLElement): CommentElementMeta[] {
    const element: HTMLElement = container.shadowRoot!.querySelector('.card-container') as HTMLElement;
    const relatedTo: string = container.getAttribute('related-to') as string;
    const relatedToDescription = container.getAttribute('related-to-description') as string;
    return [{element, relatedTo, relatedToDescription}];
  }

  protected startEdit(): void {
    super.startEdit();
    store.dispatch(new SetEditedDetailsCard(CARD_NAME));
  }

  protected openAddPartner(): void {
    openDialog({dialog: 'partner-popup'}).then(({confirmed, response}: IDialogResponse<EtoolsPartner>) => {
      if (!confirmed) {
        return;
      }
      if (response) {
        this.activityPartners = [...this.activityPartners, response];
        this.editedData.partners = simplifyValue(this.activityPartners);
      }
    });
  }

  protected openAddCpOutput(): void {
    openDialog({dialog: 'cp-output-popup'}).then(({confirmed, response}: IDialogResponse<EtoolsCpOutput>) => {
      if (!confirmed) {
        return;
      }
      if (response) {
        this.activityCpOutputs = [...this.activityCpOutputs, response];
        this.editedData.cp_outputs = simplifyValue(this.activityCpOutputs);
      }
    });
  }

  protected openAddIntervention(): void {
    openDialog({dialog: 'intervention-popup'}).then(
      ({confirmed, response}: IDialogResponse<EtoolsInterventionShort>) => {
        if (!confirmed) {
          return;
        }
        let interventionIds: number[] = simplifyValue(this.editedData.interventions) || [];
        if (response && !interventionIds.includes(response.id)) {
          let outputIds: number[] = simplifyValue(this.editedData.cp_outputs) || [];
          let partnerIds: number[] = simplifyValue(this.editedData.partners) || [];

          interventionIds = Array.from(new Set([...interventionIds, response.id]));
          outputIds = Array.from(new Set([...outputIds, ...response.cp_outputs]));
          partnerIds = Array.from(new Set([...partnerIds, response.partner]));

          const interventions: IActivityIntervention[] = this.getActiveEntities<IActivityIntervention>(
            interventionIds,
            this.interventions
          );
          const outputs: IActivityPartner[] = this.getActiveEntities<IActivityCPOutput>(outputIds, this.outputs);
          const partners: IActivityPartner[] = this.getActiveEntities<IActivityPartner>(partnerIds, this.partners);
          this.activityInterventions = [...interventions];
          this.activityCpOutputs = [...outputs];
          this.activityPartners = [...partners];

          this.editedData.interventions = [...interventions];
          this.editedData.cp_outputs = [...outputs];
          this.editedData.partners = [...partners];
        }
      }
    );
  }

  protected getActiveEntities<T>(ids: number[], options: (T & {id: number})[]): (T & {id: number})[] {
    return options.filter((option: T & {id: number}) => ids.includes(option.id));
  }

  protected removeItem<T extends EtoolsCpOutput | EtoolsPartner | EtoolsIntervention>(
    id: number,
    field: keyof IActivityDetails,
    arrayName: 'activityCpOutputs' | 'activityPartners' | 'activityInterventions'
  ): void {
    const collection: T[] = this[arrayName] as T[];
    const items: T[] = [...collection];
    const index: number = items.findIndex((item: T) => item.id === id);
    items.splice(index, 1);
    (this[arrayName] as T[]) = items;
    this.editedData[field] = simplifyValue(items);
  }

  protected getPDText(item: EtoolsIntervention) {
    return item.title.includes(item.number) ? item.title : `${item.number} ${item.title}`;
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      elevationStyles,
      SharedStyles,
      layoutStyles,
      css`
        .card-content {
          padding: 25px 18px;
        }
      `
    ];
  }
}
