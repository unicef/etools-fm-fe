import {LitElement, html, TemplateResult, customElement, property, CSSResultArray, css} from 'lit-element';
import {translate} from '../../../../../localization/localisation';
import {repeat} from 'lit-html/directives/repeat';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../styles/card-styles';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {request} from '../../../../../endpoints/request';
import {getEndpoint} from '../../../../../endpoints/endpoints';
import {LOG_ISSUES} from '../../../../../endpoints/endpoints-list';
import {EtoolsRouter} from '../../../../../routing/routes';
import {SharedStyles} from '../../../../styles/shared-styles';
import {openDialog} from '../../../../utils/dialog';
import '../../../../common/file-components/files-popup';
import '@unicef-polymer/etools-data-table';

@customElement('issue-tracker-list')
export class IssueTrackerList extends LitElement {
  @property() isLoad: boolean = false;
  @property() items: LogIssue[] = [];
  @property() queryParams: GenericObject = {
    page: 1,
    page_size: 5
  };
  @property() count: number = 0;
  _activityId: string | null = null;
  @property() set activityId(activityId: string) {
    this.queryParams = {
      ...this.queryParams,
      activity: activityId
    };
    this.loadIssues(this.queryParams);
  }

  loadIssues(params: GenericObject): void {
    const {url}: IResultEndpoint = getEndpoint(LOG_ISSUES);
    const resultUrl: string = `${url}?${EtoolsRouter.encodeParams(params)}`;
    request<IListData<LogIssue>>(resultUrl).then((list: IListData<LogIssue>) => {
      this.items = list.results;
      this.count = list.count;
    });
  }

  getRelatedName(item: LogIssue): string {
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

  viewFiles(item: LogIssue): void {
    openDialog({
      dialog: 'files-popup',
      dialogData: item.attachments
    });
  }

  changePageParam(newValue: string | number, paramName: string): void {
    const currentValue: number | string = (this.queryParams && this.queryParams[paramName]) || 0;
    if (+newValue === +currentValue) {
      return;
    }
    const newParams: IRouteQueryParams = {[paramName]: newValue};
    if (paramName === 'page_size') {
      newParams.page = 1;
    }
    this.queryParams = {...this.queryParams, ...newParams};
    if (this.queryParams.activity) {
      this.loadIssues(this.queryParams);
    }
  }

  render(): TemplateResult {
    console.log('items', this.items);
    return html`
      <section class="elevation page-content card-container" elevation="1">
        <etools-loading
          ?active="${this.isLoad}"
          loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
        ></etools-loading>
        <div class="card-title-box with-bottom-line">
          <div class="card-title counter">${translate('ACTIVITY_ADDITIONAL_INFO.ISSUE_TRACKER')}</div>
        </div>
        <etools-data-table-header no-title no-collapse>
          <etools-data-table-column class="flex-1" field="related_to_type">
            ${translate('ISSUE_TRACKER.RELATED_TO')}
          </etools-data-table-column>
          <etools-data-table-column
            class="flex-2"
            field="name"
            sortable
            @sort-changed="${(event: CustomEvent<SortDetails>) => this.sortList(event.detail)}"
          >
            ${translate('ISSUE_TRACKER.NAME')}
          </etools-data-table-column>
          <etools-data-table-column class="flex-3" field="issue">
            ${translate('ISSUE_TRACKER.ISSUE')}
          </etools-data-table-column>
          <etools-data-table-column class="flex-1" field="attachments">
            ${translate('ISSUE_TRACKER.ATTACHMENTS')}
          </etools-data-table-column>
        </etools-data-table-header>
        ${!this.items.length
          ? html`
              <etools-data-table-row no-collapse>
                <div slot="row-data" class="layout horizontal flex">
                  <div class="col-data flex-1 truncate">-</div>
                  <div class="col-data flex-2 truncate">-</div>
                  <div class="col-data flex-3 truncate">-</div>
                  <div class="col-data flex-1 truncate">-</div>
                </div>
              </etools-data-table-row>
            `
          : ''}
        ${repeat(
          this.items,
          (logIssue: LogIssue) => html`
            <etools-data-table-row secondary-bg-on-hover no-collapse>
              <div slot="row-data" class="layout horizontal flex">
                <div class="col-data flex-1">
                  <span class="truncate">
                    ${translate(`ISSUE_TRACKER.RELATED_TYPE.${(logIssue.related_to_type as string).toUpperCase()}`)}
                  </span>
                </div>
                <div class="col-data flex-2">${this.getRelatedName(logIssue)}</div>
                <div class="col-data layout center flex-3">
                  <span class="flexible-text">${logIssue.issue}</span>
                </div>
                <div class="col-data flex-1">
                  ${logIssue.attachments.length
                    ? html`
                        <div class="files-column" @click="${() => this.viewFiles(logIssue)}">
                          ${logIssue.attachments.length} FILES
                        </div>
                      `
                    : ''}
                </div>
              </div>
            </etools-data-table-row>
          `
        )}

        <etools-data-table-footer
          id="footer"
          .pageSize="${(this.queryParams && this.queryParams.page_size) || undefined}"
          .pageNumber="${(this.queryParams && this.queryParams.page) || undefined}"
          .totalResults="${this.count}"
          @page-size-changed="${(event: CustomEvent) => this.changePageParam(event.detail.value, 'page_size')}"
          @page-number-changed="${(event: CustomEvent) => this.changePageParam(event.detail.value, 'page')}"
        >
        </etools-data-table-footer>
      </section>
    `;
  }

  sortList(sortOption: SortDetails): void {
    this.items.sort((a: LogIssue, b: LogIssue) => {
      const current: string = a.cp_output?.name || a.partner?.name || '';
      const next: string = b.cp_output?.name || b.partner?.name || '';
      return sortOption.direction === 'asc' ? current.localeCompare(next) : next.localeCompare(current);
    });
    this.requestUpdate();
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      pageLayoutStyles,
      SharedStyles,
      FlexLayoutClasses,
      CardStyles,
      elevationStyles,
      css`
        .files-column {
          color: var(--module-primary);
          cursor: pointer;
          font-weight: 500;
        }
      `
    ];
  }
}
