import { CSSResult, customElement, LitElement, property, TemplateResult } from 'lit-element';
import { template } from './rationale-tab.tpl';
import { store } from '../../../../redux/store';
import { routeDetailsSelector } from '../../../../redux/selectors/app.selectors';
import { Unsubscribe } from 'redux';
import { updateQueryParams } from '../../../../routing/routes';
import { debounce } from '../../../utils/debouncer';
import { fireEvent } from '../../../utils/fire-custom-event';
import { loadRationale } from '../../../../redux/effects/rationale.effects';
import { rationaleData } from '../../../../redux/selectors/rationale.selectors';
import { elevationStyles } from '../../../styles/lit-styles/elevation-styles';

@customElement('rationale-tab')
export class RationaleTabComponent extends LitElement {
    public selectedYear: number | undefined;
    public loadingInProcess: boolean = false;
    @property() public yearPlan: IRationale | undefined;
    public readonly yearOptions: { label: number; value: number }[];

    private readonly routeDetailsUnsubscribe: Unsubscribe;
    private readonly debouncedLoading: Callback;
    private readonly rationaleDataUnsubscribe: Unsubscribe;

    public constructor() {
        super();

        this.debouncedLoading = debounce((year: number) => {
            this.loadingInProcess = true;
            store.dispatch<AsyncEffect>(loadRationale(year))
                .catch(() => fireEvent(this, 'toast', { text: 'Can not Plan for selected Year' }))
                .then(() => this.loadingInProcess = false);
        }, 100);

        const currentYear: number = new Date().getFullYear();
        this.yearOptions = [currentYear, currentYear + 1].map((year: number) => ({ label: year, value: year }));

        this.routeDetailsUnsubscribe = store.subscribe(routeDetailsSelector((details: IRouteDetails) => this.onRouteChange(details), false));
        const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
        this.onRouteChange(currentRoute);

        this.rationaleDataUnsubscribe = store.subscribe(rationaleData((rationale: IRationale | null) => {
            if (!rationale) { return; }
            this.yearPlan = rationale;
        }));
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.routeDetailsUnsubscribe();
        this.rationaleDataUnsubscribe();
    }

    public onYearSelected(year: number): void {
        if (year !== this.selectedYear) {
            updateQueryParams({ year });
        }
    }

    public getChangesDate(date?: string): string {
        // @ts-ignore
        return date ? moment(date).format('DD MMM YYYY') : '';
    }

    public formatValue(value?: string | number): string {
        const isEmptyValue: boolean = value === null || value === undefined || value === '';
        return isEmptyValue ? '...' : value as string;
    }

    public openPopup(): void {}

    private onRouteChange({ routeName, subRouteName, queryParams }: IRouteDetails): void {
        if (routeName !== 'plan' || subRouteName !== 'rationale') { return; }

        const paramsAreValid: boolean = queryParams && queryParams.year && !isNaN(+queryParams.year) || false;
        if (paramsAreValid) {
            this.selectedYear = +(queryParams as IRouteQueryParams).year;
            this.debouncedLoading(this.selectedYear);
        } else {
            updateQueryParams({ year: this.yearOptions[0].value });
        }
    }

    public static get styles(): CSSResult[] {
        return [elevationStyles];
    }
}
