import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';

import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { etoolsPaginationStyles } from './etools-pagination-style';
import { IEtoolsPaginator } from './paginator';
import { fireEvent } from '../../../../utils/fire-custom-event';

/**
 * TODO: add some page btns between page navigation controls
 * @customElement
 * @LitElement
 */
@customElement('etools-pagination')
export class EtoolsPagination extends LitElement {

  @property({ type: Object })
  public paginator!: IEtoolsPaginator;

  @property({ type: Array })
  public pageSizeOptions: number[] = [5, 10, 20, 50];

  public render(): TemplateResult {
    return html`
      ${etoolsPaginationStyles}
      <span class="pagination-item">
        <span id="rows">Rows per page:</span>
        <paper-dropdown-menu vertical-align="bottom" horizontal-align="left" noink no-label-float
          @value-changed="${this.onPageSizeChanged}">
          <paper-listbox slot="dropdown-content" attr-for-selected="name" .selected="${this.paginator.page_size}">
            ${this.pageSizeOptions.map((sizeOption: number) => html`<paper-item name="${sizeOption}">
              ${sizeOption}</paper-item>`)}
          </paper-listbox>
        </paper-dropdown-menu>
        <span id="range">
          ${this.paginator.visible_range[0]}-${this.paginator.visible_range[1]} of ${this.paginator.count}
        </span>
      </span>
      <span class="pagination-item pagination-btns">
        <paper-icon-button icon="first-page" @tap="${this.goToFirstPage}"
                           ?disabled="${this.paginator.page === 1}"></paper-icon-button>
        <paper-icon-button icon="chevron-left" @tap="${this.pageLeft}"
                           ?disabled="${this.paginator.page === 1}"></paper-icon-button>
        <paper-icon-button icon="chevron-right" @tap="${this.pageRight}"
                           ?disabled="${this.paginator.page === this.paginator.total_pages}"></paper-icon-button>
        <paper-icon-button icon="last-page" @tap="${this.goToLastPage}"
                           ?disabled="${this.paginator.page === this.paginator.total_pages}"></paper-icon-button>
      </span>
    `;
  }

  public goToFirstPage(): void {
    if (this.paginator.page > 1) {
      this.firePaginatorChangeEvent({ page: 1 });
    }
  }

  public goToLastPage(): void {
    if (this.paginator.page < this.paginator.total_pages) {
      this.firePaginatorChangeEvent({ page: this.paginator.total_pages });
    }
  }

  public pageLeft(): void {
    if (this.paginator.page > 1) {
      this.firePaginatorChangeEvent({ page: this.paginator.page - 1 });
    }
  }

  public pageRight(): void {
    if (this.paginator.page < this.paginator.total_pages) {
      this.firePaginatorChangeEvent({ page: this.paginator.page + 1 });
    }
  }

  public onPageSizeChanged(e: CustomEvent): void {
    if (!e.detail.value) {
      return;
    }
    const newPageSize: number = Number(e.detail.value);
    if (newPageSize !== this.paginator.page_size) {
      this.firePaginatorChangeEvent({ page: 1, page_size: newPageSize });
    }
  }

  public firePaginatorChangeEvent(paginatorData: any): void {
    fireEvent(this, 'paginator-change', { ...this.paginator, ...paginatorData });
  }

}
