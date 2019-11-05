import {CSSResultArray, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {debounce} from '../../../utils/debouncer';
import {store} from '../../../../redux/store';
import {Unsubscribe} from 'redux';
import {updateQueryParams} from '../../../../routing/routes';
import {requestLogIssue} from '../../../../redux/effects/issue-tracker.effects';

import {IEtoolsFilter} from '../../../common/layout/filters/etools-filters';
import {elevationStyles} from '../../../styles/elevation-styles';
import {template} from './issue-tracker-tab.tpl';
import {issueTrackerData, issueTrackerIsLoad} from '../../../../redux/selectors/issue-tracker.selectors';
import {loadSiteLocations} from '../../../../redux/effects/site-specific-locations.effects';
import {loadStaticData} from '../../../../redux/effects/load-static-data.effect';
import {openDialog} from '../../../utils/dialog';
import './issue-tracker-popup/issue-tracker-popup';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../styles/flex-layout-classes';
import {CardStyles} from '../../../styles/card-styles';
import {IssueTrackerTabStyles} from './issue-tracker-tab.styles';
import {SharedStyles} from '../../../styles/shared-styles';
import {ListMixin} from '../../../common/mixins/list-mixin';
import {PartnersMixin} from '../../../common/mixins/partners-mixin';
import {CpOutputsMixin} from '../../../common/mixins/cp-outputs-mixin';
import {SiteMixin} from '../../../common/mixins/site-mixin';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';

export const ISSUE_STATUSES: DefaultDropdownOption<string>[] = [
  {value: 'new', display_name: 'New'},
  {value: 'past', display_name: 'Past'}
];

@customElement('issue-tracker-tab')
export class IssueTrackerTabComponent extends SiteMixin(
  CpOutputsMixin(PartnersMixin(ListMixin<LogIssue>(LitElement)))
) {
  @property({type: Boolean})
  isLoad: boolean = false;

  @property()
  filters: IEtoolsFilter[] | null = [];

  private readonly debouncedLoading: Callback;

  private routeUnsubscribe!: Unsubscribe;
  private dataUnsubscribe!: Unsubscribe;
  private isLoadUnsubscribe!: Unsubscribe;

  constructor() {
    super();
    this.debouncedLoading = debounce((params: IRouteQueryParam) => {
      // this.dispatchOnStore(new RunGlobalLoading({type: 'specificLocations', message: 'Loading Data...'}));
      store.dispatch<AsyncEffect>(requestLogIssue(params));
      // .then(() => this.dispatchOnStore(new StopGlobalLoading({type: 'specificLocations'})));
    }, 100);
    const state: IRootState = store.getState();
    if (!state.specificLocations.data) {
      store.dispatch<AsyncEffect>(loadSiteLocations());
    }
    this.loadStaticData();
  }

  static get styles(): CSSResultArray {
    return [elevationStyles, SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, IssueTrackerTabStyles];
  }

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.routeUnsubscribe = store.subscribe(
      routeDetailsSelector((details: IRouteDetails) => {
        return this.onRouteChange(details);
      }, false)
    );
    this.isLoadUnsubscribe = store.subscribe(
      issueTrackerIsLoad((isLoad: boolean | null) => {
        this.isLoad = Boolean(isLoad);
      })
    );
    this.dataUnsubscribe = store.subscribe(
      issueTrackerData((data: IListData<LogIssue> | null) => {
        if (!data) {
          return;
        }
        this.count = data.count;
        this.items = data.results;
      })
    );
    const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
    this.onRouteChange(currentRoute);
    this.addEventListener('sort-changed', ((event: CustomEvent<SortDetails>) => this.changeSort(event.detail)) as any);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.routeUnsubscribe();
    this.dataUnsubscribe();
    this.isLoadUnsubscribe();
  }

  onRouteChange(routeDetails: IRouteDetails): void {
    const {routeName, subRouteName, queryParams} = routeDetails;
    if (routeName !== 'plan' || subRouteName !== 'issue-tracker') {
      return;
    }

    const paramsAreValid: boolean = this.checkParams(queryParams);
    if (paramsAreValid) {
      this.queryParams = queryParams;
      this.debouncedLoading(this.queryParams);
    }
  }

  checkParams(params?: IRouteQueryParams | null): boolean {
    const invalid: boolean = !params || !params.page || !params.page_size;
    if (invalid) {
      updateQueryParams({page: 1, page_size: 10});
    }
    return !invalid;
  }

  getName(item: LogIssue): string {
    if (item.partner) {
      return item.partner.name;
    } else if (item.location && item.location_site) {
      return `${item.location.name} - ${item.location_site.name}`;
    } else if (item.cp_output) {
      return item.cp_output.name;
    } else {
      return '';
    }
  }

  openViewDialog(issue?: LogIssue): void {
    openDialog<LogIssue | undefined>({
      dialog: 'issue-tracker-popup',
      data: issue,
      readonly: true
    }).then(() => {});
  }

  isAllowEdit(logIssue: LogIssue): boolean {
    // todo permission
    return !!logIssue;
  }

  openLogIssue(issue?: LogIssue): void {
    openDialog<LogIssue | undefined>({
      dialog: 'issue-tracker-popup',
      data: issue
    }).then(({confirmed}: IDialogResponse<any>) => {
      if (!confirmed) {
        return;
      }
      if (!issue) {
        updateQueryParams({page: 1});
      }
      const currentParams: IRouteQueryParams | null = store.getState().app.routeDetails.queryParams;
      store.dispatch<AsyncEffect>(requestLogIssue(currentParams || {}));
    });
  }

  loadStaticData(): void {
    const data: IStaticDataState = (store.getState() as IRootState).staticData;
    if (!data.outputs) {
      store.dispatch<AsyncEffect>(loadStaticData('outputs'));
    }
    if (!data.partners) {
      store.dispatch<AsyncEffect>(loadStaticData('partners'));
    }
  }

  onOutputsChanged(items: EtoolsCpOutput[]): void {
    const currentValue: number[] = (this.queryParams && this.queryParams.cp_output__in) || [];
    const ids: number[] = items.length > 0 ? items.map((item: EtoolsCpOutput) => item.id) : [];
    if (JSON.stringify(currentValue) === JSON.stringify(ids)) {
      return;
    }
    updateQueryParams({cp_output__in: ids});
  }

  onPartnersChanged(items: EtoolsPartner[]): void {
    const currentValue: number[] = (this.queryParams && this.queryParams.partner__in) || [];
    const ids: number[] = items.length > 0 ? items.map((item: EtoolsPartner) => item.id) : [];
    if (JSON.stringify(currentValue) === JSON.stringify(ids)) {
      return;
    }
    updateQueryParams({partner__in: ids});
  }

  onLocationsChanged(items: IGroupedSites[]): void {
    const currentValue: string[] = (this.queryParams && this.queryParams.location__in) || [];
    const ids: string[] = items.length > 0 ? items.map((item: IGroupedSites) => item.id) : [];
    if (JSON.stringify(currentValue) === JSON.stringify(ids)) {
      return;
    }
    updateQueryParams({location__in: ids});
  }

  changeShowOnlyNew(value: boolean): void {
    if (value === undefined) {
      return;
    }
    if (value) {
      updateQueryParams({status: 'new'});
    } else {
      updateQueryParams({status: null});
    }
  }
}
