import {CSSResult, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {CP_OUTPUTS} from '../../../../endpoints/endpoints-list';
import {updateQueryParams} from '../../../../routing/routes';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {CpOutcomesMixin} from '../../../common/mixins/cp-outcomes.mixin';

import {fullReportData} from '../../../../redux/selectors/co-overview.selectors';
import {outputsDataSelector} from '../../../../redux/selectors/static-data.selectors';
import {loadStaticData} from '../../../../redux/effects/load-static-data.effect';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {loadFullReport} from '../../../../redux/effects/co-overview.effects';
import {fullReports} from '../../../../redux/reducers/co-overview.reducer';
import {store} from '../../../../redux/store';
import {Unsubscribe} from 'redux';

import {CoOverviewTabStyles} from './country-overview.styles';
import {template} from './country-overview.tpl';

import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {leafletStyles} from '../../../styles/leaflet-styles';
import {SharedStyles} from '../../../styles/shared-styles';
import {CardStyles} from '../../../styles/card-styles';
import {get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {currentUser} from '../../../../redux/selectors/user.selectors';

store.addReducers({fullReports});

@customElement('country-overview-tab')
export class CoOverviewTabComponent extends CpOutcomesMixin(LitElement) {
  @property()
  queryParams: GenericObject | null = null;

  @property({type: Array})
  filteredCpOutputs: EtoolsCpOutput[] = [];

  @property({type: Object})
  fullReports: GenericObject<FullReportData> = {};

  @property() isLoad = false;
  @property() isUnicefUser = false;

  private cpOutputs: EtoolsCpOutput[] = [];

  private routeUnsubscribe!: Unsubscribe;
  private cpOutputUnsubscribe!: Unsubscribe;
  private fullReportsUnsubscribe!: Unsubscribe;
  private userUnsubscribe!: Unsubscribe;

  static get styles(): CSSResult[] {
    return [
      CoOverviewTabStyles,
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      layoutStyles,
      CardStyles,
      leafletStyles
    ];
  }

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.routeUnsubscribe = store.subscribe(
      routeDetailsSelector((details: EtoolsRouteDetails) => this.onRouteChange(details), false)
    );
    this.fullReportsUnsubscribe = store.subscribe(
      fullReportData((fullReports: GenericObject<FullReportData>) => (this.fullReports = fullReports))
    );
    this.userUnsubscribe = store.subscribe(
      currentUser((user: IEtoolsUserModel | null) => {
        this.isUnicefUser = user && user.is_unicef_user;
      })
    );

    this.loadStaticData();
    if (!this.cpOutputs.length) {
      this.cpOutputUnsubscribe = store.subscribe(
        outputsDataSelector((outputs: EtoolsCpOutput[] | undefined) => {
          this.isLoad = false;
          if (!outputs) {
            return;
          }
          this.cpOutputs = outputs;
          this.refreshData();
        }, false)
      );
    }
    const currentRoute: EtoolsRouteDetails = (store.getState() as IRootState).app.routeDetails;
    this.onRouteChange(currentRoute);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.routeUnsubscribe();
    if (typeof this.cpOutputUnsubscribe === 'function') {
      this.cpOutputUnsubscribe();
    }
    this.fullReportsUnsubscribe();
    this.userUnsubscribe();
  }

  filterValueChanged(selectedItem: CpOutcome | null): void {
    const id: number | null = selectedItem && +selectedItem.id;
    const currentTarget: number | null = (this.queryParams && +this.queryParams.cp_outcome) || null;
    if (!id || currentTarget === id) {
      return;
    }
    updateQueryParams({cp_outcome: id});
  }

  toggleDetails(newCpOutputId: number): void {
    const oldCpOutputId: number | null = (this.queryParams && +this.queryParams.cp_output) || null;
    if (oldCpOutputId === newCpOutputId) {
      updateQueryParams({cp_output: null});
      return;
    }
    delete this.fullReports[newCpOutputId];
    updateQueryParams({cp_output: newCpOutputId});
  }

  private onRouteChange({routeName, subRouteName, queryParams}: EtoolsRouteDetails): void {
    if (routeName !== 'analyze' || subRouteName !== 'country-overview') {
      return;
    }

    if (queryParams) {
      this.queryParams = queryParams;
    }

    const fullReportId: number | null = (this.queryParams && +this.queryParams.cp_output) || null;
    if (typeof fullReportId === 'number') {
      this.loadFullReport(fullReportId);
    }

    this.refreshData();
  }

  private refreshData(): void {
    if (!this.cpOutputs || !this.cpOutputs.length) {
      return;
    }

    const cpOutcome: number | null = (this.queryParams && +this.queryParams.cp_outcome) || null;

    if (cpOutcome) {
      this.filteredCpOutputs = this.cpOutputs.filter((cpOutput: EtoolsCpOutput) => cpOutput.parent === cpOutcome);
    }

    const fullReportId: number | null = (this.queryParams && +this.queryParams.cp_output) || null;
    const exists = !!this.filteredCpOutputs.find(
      (filteredCpOutoput: EtoolsCpOutput) => filteredCpOutoput.id === fullReportId
    );

    if (!exists) {
      updateQueryParams({cp_output: null});
    } else if (typeof fullReportId === 'number' && !this.fullReports[fullReportId]) {
      this.loadFullReport(fullReportId);
    }
  }

  private loadStaticData(): void {
    const data: IStaticDataState = (store.getState() as IRootState).staticData;
    if (!data.outputs) {
      this.isLoad = true;
      store.dispatch<AsyncEffect>(loadStaticData(CP_OUTPUTS));
    } else {
      this.cpOutputs = data.outputs;
    }
  }

  private loadFullReport(fullReportId: number): void {
    store
      .dispatch<AsyncEffect>(loadFullReport(fullReportId))
      .catch(() => fireEvent(this, 'toast', {text: getTranslation('ERROR_LOAD_REPORT')}));
  }
}
