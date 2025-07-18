import {css, LitElement, TemplateResult, html, CSSResultArray} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query.js';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';
import {request} from '../../../../../endpoints/request';
import {getEndpoint} from '../../../../../endpoints/endpoints';
import {LOG_ISSUES} from '../../../../../endpoints/endpoints-list';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {SharedStyles} from '../../../../styles/shared-styles';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import '../../../../common/file-components/files-popup';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {EtoolsRouteQueryParams} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {CommentElementMeta, CommentsMixin} from '../../../../common/comments/comments-mixin';

@customElement('issue-tracker-list')
export class IssueTrackerList extends CommentsMixin(LitElement) {
  @property() loading = false;
  @property() items: LogIssue[] = [];
  @property() queryParams: GenericObject = {
    page: 1,
    page_size: 5
  };
  @property({type: Boolean})
  lowResolutionLayout = false;
  @property() count = 0;
  _activityId: string | null = null;
  @property() set activityId(activityId: string) {
    this.queryParams = {
      ...this.queryParams,
      activity: activityId
    };
    this.loadIssues(this.queryParams);
  }

  commentsModeInitialize = false;

  loadIssues(params: GenericObject): void {
    this.loading = true;
    const {url}: IResultEndpoint = getEndpoint(LOG_ISSUES);
    const resultUrl = `${url}?${EtoolsRouter.encodeQueryParams(params)}&status=new`;
    request<IListData<LogIssue>>(resultUrl).then((list: IListData<LogIssue>) => {
      this.items = list.results;
      this.count = list.count;
      this.loading = false;
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
    const newParams: EtoolsRouteQueryParams = {[paramName]: newValue};
    if (paramName === 'page_size') {
      newParams.page = 1;
    }
    this.queryParams = {...this.queryParams, ...newParams};
    if (this.queryParams.activity) {
      this.loadIssues(this.queryParams);
    }
  }

  render(): TemplateResult {
    return html`
      <style>
        ${dataTableStylesLit}
      </style>
      <etools-media-query
        query="(max-width: 767px)"
        @query-matches-changed="${(e: CustomEvent) => {
          this.lowResolutionLayout = e.detail.value;
        }}"
      ></etools-media-query>
      <section class="elevation page-content card-container" elevation="1">
        <etools-loading
          ?active="${this.loading}"
          loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
        ></etools-loading>
        <div class="card-title-box with-bottom-line">
          <div class="card-title counter">${translate('ACTIVITY_ADDITIONAL_INFO.ISSUE_TRACKER')}</div>
        </div>
        <etools-data-table-header no-title no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
          <etools-data-table-column class="col-data col-md-1" field="related_to_type">
            ${translate('ISSUE_TRACKER.RELATED_TO')}
          </etools-data-table-column>
          <etools-data-table-column class="col-data col-md-4" field="name" sortable>
            ${translate('ISSUE_TRACKER.NAME')}
          </etools-data-table-column>
          <etools-data-table-column class="col-data col-md-6" field="issue">
            ${translate('ISSUE_TRACKER.ISSUE')}
          </etools-data-table-column>
          <etools-data-table-column class="col-data col-md-1" field="attachments">
            ${translate('ISSUE_TRACKER.ATTACHMENTS')}
          </etools-data-table-column>
        </etools-data-table-header>
        ${!this.items.length
          ? html`
              <etools-data-table-row no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
                <div slot="row-data" class="row">
                  <div class="col-data col-12 no-data">${translate('NO_RECORDS')}</div>
                </div>
              </etools-data-table-row>
            `
          : ''}
        ${repeat(
          this.items,
          (logIssue: LogIssue) => html`
            <etools-data-table-row
              related-to="additional_info_points_of_note-${logIssue.id}"
              related-to-description="${logIssue.issue}"
              comments-container
              secondary-bg-on-hover
              no-collapse
              .lowResolutionLayout="${this.lowResolutionLayout}"
            >
              <div slot="row-data" class="row">
                <div class="col-data col-md-1" data-col-header-label="${translate('ISSUE_TRACKER.RELATED_TO')}">
                  <span class="truncate">
                    ${translate(`ISSUE_TRACKER.RELATED_TYPE.${(logIssue.related_to_type as string).toUpperCase()}`)}
                  </span>
                </div>
                <div class="col-data col-md-4" data-col-header-label="${translate('ISSUE_TRACKER.NAME')}">
                  ${this.getRelatedName(logIssue)}
                </div>
                <div
                  class="col-data layout align-items-center col-md-6"
                  data-col-header-label="${translate('ISSUE_TRACKER.ISSUE')}"
                >
                  <span class="flexible-text">${logIssue.issue}</span>
                </div>
                <div class="col-data col-md-1" data-col-header-label="${translate('ISSUE_TRACKER.ATTACHMENTS')}">
                  ${logIssue.attachments.length
                    ? html`
                        <div class="files-column" @click="${() => this.viewFiles(logIssue)}">
                          ${logIssue.attachments.length} ${logIssue.attachments.length > 1 ? 'FILES' : 'FILE'}
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
          .lowResolutionLayout="${this.lowResolutionLayout}"
          .rowsPerPageText="${translate('ROWS_PER_PAGE')}"
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

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('sort-changed', ((event: CustomEvent<SortDetails>) => {
      const params: GenericObject = {
        ...this.queryParams,
        ordering: `${event.detail.direction === 'desc' ? '-' : ''}${event.detail.field}`
      };
      this.loadIssues(params);
    }) as any);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('items') && this.items.length) {
      this.setCommentMode();
    }
  }

  getSpecialElements(container: HTMLElement): CommentElementMeta[] {
    const element: HTMLElement = container.shadowRoot!.querySelector('#wrapper') as HTMLElement;
    const relatedTo: string = container.getAttribute('related-to') as string;
    const relatedToDescription = container.getAttribute('related-to-description') as string;
    return [{element, relatedTo, relatedToDescription}];
  }

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      pageLayoutStyles,
      SharedStyles,
      layoutStyles,
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
