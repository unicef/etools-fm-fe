import {css, CSSResultArray, customElement, html, property, TemplateResult} from 'lit-element';
import {translate} from '../../../../../../localization/localisation';
import {elevationStyles} from '../../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../../styles/shared-styles';
import {BaseDetailsCard} from './base-details-card';
import {store} from '../../../../../../redux/store';
import {SetEditedDetailsCard} from '../../../../../../redux/actions/activity-details.actions';
import {CpOutputsMixin} from '../../../../../common/mixins/cp-outputs-mixin';
import {PartnersMixin} from '../../../../../common/mixins/partners-mixin';
import './entities-list-and-popups/entries-list';
import {FlexLayoutClasses} from '../../../../../styles/flex-layout-classes';
import {simplifyValue} from '../../../../../utils/objects-diff';
import clone from 'ramda/es/clone';
import {openDialog} from '../../../../../utils/dialog';
import './entities-list-and-popups/partner-popup';
import './entities-list-and-popups/cp-output-popup';
import './entities-list-and-popups/intervention-popup';

export const CARD_NAME: string = 'entities-monitor';

@customElement('entities-monitor-card')
export class EntitiesMonitorCard extends PartnersMixin(CpOutputsMixin(BaseDetailsCard)) {
  @property() activityPartners: IActivityPartner[] = [];
  @property() activityCpOutputs: IActivityCPOutput[] = [];
  @property() activityInterventions: IActivityIntervention[] = [];

  set data(data: IActivityDetails) {
    super.data = data;
    this.activityPartners = (clone(data.partners) as unknown) as IActivityPartner[];
    this.activityCpOutputs = (clone(data.cp_outputs) as unknown) as IActivityCPOutput[];
    this.activityInterventions = (clone(data.interventions) as unknown) as IActivityIntervention[];
  }

  getEntities<T>(ids: number[], options: (T & {id: number})[]): (T & {id: number})[] {
    return options.filter((option: T & {id: number}) => ids.includes(option.id));
  }

  mapEntities<T>(ids: number[], options: (T & {id: number})[]): (T & {id: number})[] {
    return options.filter((option: T & {id: number}) => ids.includes(option.id));
  }

  render(): TemplateResult {
    return html`
      <etools-card
        card-title="${translate('ACTIVITY_DETAILS.ENTRIES_TO_MONITOR')}"
        ?is-editable="${!this.editedCard || this.editedCard === CARD_NAME}"
        ?edit="${!this.isReadonly}"
        @start-edit="${() => this.startEdit()}"
        @save="${() => this.save()}"
        @cancel="${() => this.cancel()}"
      >
        <div class="card-content" slot="content">
          <etools-loading
            ?active="${this.isLoad}"
            loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
          ></etools-loading>
          <etools-loading
            ?active="${this.isUpdate}"
            loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
          ></etools-loading>
          <div class="layout horizontal">
            <entries-list
              class="entries-list"
              .nameList="${translate('ACTIVITY_DETAILS.PARTNERS')}"
              .formatItem="${(item: EtoolsPartner) => item.name}"
              .items="${this.activityPartners}"
              ?is-readonly="${this.isReadonly}"
              @add-entry="${() => this.openAddPartner()}"
              @remove-entry="${({detail}: CustomEvent) =>
                this.removeItem<EtoolsPartner>(detail.id, 'partners', 'activityPartners')}"
            >
            </entries-list>
            <entries-list
              class="entries-list"
              .nameList="${translate('ACTIVITY_DETAILS.CP_OUTPUTS')}"
              .formatItem="${(item: EtoolsCpOutput) => item.name}"
              .items="${this.activityCpOutputs}"
              ?is-readonly="${this.isReadonly}"
              @add-entry="${() => this.openAddCpOutput()}"
              @remove-entry="${({detail}: CustomEvent) =>
                this.removeItem<EtoolsCpOutput>(detail.id, 'cp_outputs', 'activityCpOutputs')}"
            >
            </entries-list>
            <entries-list
              class="entries-list"
              .nameList="${translate('ACTIVITY_DETAILS.INTERVENTIONS')}"
              .formatItem="${(item: EtoolsIntervention) => item.title}"
              .items="${this.activityInterventions}"
              ?is-readonly="${this.isReadonly}"
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

  startEdit(): void {
    super.startEdit();
    store.dispatch(new SetEditedDetailsCard(CARD_NAME));
  }

  openAddPartner(): void {
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

  openAddCpOutput(): void {
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

  openAddIntervention(): void {
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

          this.editedData.interventions = [...interventionIds];
          this.editedData.cp_outputs = [...outputIds];
          this.editedData.partners = [...partnerIds];

          const outputs: IActivityPartner[] = this.getActiveEntities<IActivityCPOutput>(outputIds, this.outputs);
          const partners: IActivityPartner[] = this.getActiveEntities<IActivityPartner>(partnerIds, this.partners);

          this.activityCpOutputs = [...outputs];
          this.activityPartners = [...partners];

          this.activityInterventions = [...this.activityInterventions, response];
        }
      }
    );
  }

  getActiveEntities<T>(ids: number[], options: (T & {id: number})[]): (T & {id: number})[] {
    return options.filter((option: T & {id: number}) => ids.includes(option.id));
  }

  removeItem<T extends EtoolsCpOutput | EtoolsPartner | EtoolsIntervention>(
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

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      elevationStyles,
      SharedStyles,
      FlexLayoutClasses,
      css`
        .card-content {
          padding: 25px 18px;
        }
        .entries-list {
          margin: 0 7px;
        }
      `
    ];
  }
}
