import '@polymer/iron-icons/iron-icons';
import '@polymer/paper-icon-button/paper-icon-button';
import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';

import { etoolsTableStyles } from './etools-table-styles';
import { fireEvent } from '../../../utils/fire-custom-event';
import { prettyDate } from '../../../utils/date-utility';
import { IEtoolsPaginator } from './pagination/paginator';
import './pagination/etools-pagination';

export enum EtoolsTableColumnType {
  Text,
  Date,
  Link,
  Number
}

export enum EtoolsTableColumnSort {
  Asc = 'asc',
  Desc = 'desc'
}

export enum EtoolsTableActionType {
  Edit,
  Delete
}

export interface IEtoolsTableColumn {
  label: string; // column header label
  name: string; // property name from item object
  type: EtoolsTableColumnType;
  sort?: EtoolsTableColumnSort;
  /**
   * used only for EtoolsTableColumnType.Link to specify url template (route with a single param)
   * ex: `${ROOT_PATH}engagements/:id/details`
   *    - id will be replaced with item object id property
   */
  link_tmpl?: string;
}

/**
 * @customElement
 * @LitElement
 */
@customElement('etools-table')
export class EtoolsTable extends LitElement {

  public get paginationHtml(): TemplateResult {
    return html`<tr><td class="pagination" colspan="${this.columns.length + (this.showRowActions() ? 1 : 0)}">
      <etools-pagination .paginator="${this.paginator}"></etools-pagination></td></tr>`;
  }

  @property({ type: String })
  public dateFormat: string = 'D MMM YYYY';

  @property({ type: Boolean, reflect: true })
  public showEdit!: boolean;

  @property({ type: Boolean, reflect: true })
  public showDelete!: boolean;

  @property({ type: String })
  public caption: string = '';

  @property({ type: Array })
  public columns: IEtoolsTableColumn[] = [];

  @property({ type: Array })
  public items: GenericObject[] = [];

  @property({ type: Object })
  public paginator!: IEtoolsPaginator;

  public render(): TemplateResult {
    // language=HTML
    return html`
      ${etoolsTableStyles}
      <table>
        <caption ?hidden="${this.showCaption(this.caption)}">${this.caption}</caption>
        <thead>
          <tr>
            ${this.columns.map((column: IEtoolsTableColumn) => this.getColumnHtml(column))}
            ${this.showRowActions() ? html`<th></th>` : ''}
          </tr>
        </thead>
        <tbody>
          ${this.items.map((item: any) => this.getRowDataHtml(item))}
          ${this.paginator ? this.paginationHtml : ''}
        </tbody>
      </table>
    `;
  }

  public getColumnHtml(column: IEtoolsTableColumn): TemplateResult {
    if (!this.columnHasSort(column.sort)) {
      return html`
        <th class="${this.getColumnClassList(column)}">${column.label}</th>
      `;
    } else {
      return this.getColumnHtmlWithSort(column);
    }
  }

  public getColumnHtmlWithSort(column: IEtoolsTableColumn): TemplateResult {
    return html`
      <th class="${this.getColumnClassList(column)}" @tap="${() => this.toggleAndSortBy(column)}">
        ${column.label}
        ${this.columnHasSort(column.sort) ? html`<iron-icon
            .icon="${this.getSortIcon(column.sort as EtoolsTableColumnSort)}">
          </iron-icon>` : ''}
      </th>
    `;
  }

  public getLinkTmpl(pathTmpl: string | undefined, item: any, key: string): TemplateResult {
    if (!pathTmpl) {
      throw new Error(`[EtoolsTable.getLinkTmpl]: column "${item[key]}" has no link tmpl defined`);
    }
    const path: string[] = pathTmpl.split('/');
    path.forEach((p: string, index: number) => {
      if (p.slice(0, 1) === ':') {
        const param: string = p.slice(1);
        path[index] = item[param];
      }
    });
    const aHref: string = path.join('/');
    return html`
      <a class="" href="${aHref}">${item[key]}</a>
    `;
  }

  public getRowDataHtml(item: any): TemplateResult {
    const columnsKeys: string[] = this.getColumnsKeys();
    return html`
      <tr>
        ${columnsKeys.map((k: string) => html`<td class="${this.getRowDataColumnClassList(k)}">
          ${this.getItemValue(item, k)}</td>`)}
        ${this.showRowActions() ? html`<td class="row-actions">${this.getRowActionsTmpl(item)}` : ''}
      </tr>
    `;
  }

  public getRowActionsTmpl(item: any): TemplateResult {
    return html`
      <div class="actions">
        <paper-icon-button ?hidden="${!this.showEdit}"
          icon="create" @tap="${() => this.triggerAction(EtoolsTableActionType.Edit, item)}"></paper-icon-button>
        <paper-icon-button ?hidden="${!this.showDelete}"
          icon="delete" @tap="${() => this.triggerAction(EtoolsTableActionType.Delete, item)}"></paper-icon-button>
      </div>
    `;
  }

  public showCaption(caption: string): boolean {
    return !caption;
  }

  // Columns
  public getColumnClassList(column: IEtoolsTableColumn): string {
    const classList: string[] = [];

    if (column.type === EtoolsTableColumnType.Number) {
      classList.push('right-align');
    }

    if (this.columnHasSort(column.sort)) {
      classList.push('sort');
    }

    return classList.join(' ');
  }

  public columnHasSort(sort: EtoolsTableColumnSort | undefined): boolean {
    return sort === EtoolsTableColumnSort.Asc || sort === EtoolsTableColumnSort.Desc;
  }

  public getSortIcon(sort: EtoolsTableColumnSort): string {
    return sort === EtoolsTableColumnSort.Asc ? 'arrow-upward' : 'arrow-downward';
  }

  public getColumnDetails(name: string): IEtoolsTableColumn {
    const column: IEtoolsTableColumn | undefined = this.columns.find((c: IEtoolsTableColumn) => c.name === name);
    if (!column) {
      throw new Error(`[EtoolsTable.getColumnDetails]: column "${name}" not found`);
    }
    return column;
  }

  // Rows
  public getRowDataColumnClassList(key: string): string {
    const column: IEtoolsTableColumn = this.getColumnDetails(key);
    switch (column.type) {
      case EtoolsTableColumnType.Number:
        return 'right-align';
      default:
        return '';
    }
  }

  public getColumnsKeys(): string[] {
    return this.columns.map((c: IEtoolsTableColumn) => c.name);
  }

  public getItemValue(item: any, key: string): any | string | '' | Response | TemplateResult {
    // get column object to determine how data should be displayed (date, string, link, number...)
    const column: IEtoolsTableColumn = this.getColumnDetails(key);
    switch (column.type) {
      case EtoolsTableColumnType.Date:
        return prettyDate(item[key], this.dateFormat);
      case EtoolsTableColumnType.Link:
        return this.getLinkTmpl(column.link_tmpl, item, key);
      case EtoolsTableColumnType.Number:
      default:
        return item[key];

    }
  }

  // row actions
  public showRowActions(): boolean {
    return this.showDelete || this.showEdit;
  }

  public triggerAction(type: EtoolsTableActionType, item: any): void {
    if (!this.showRowActions()) {
      return;
    }
    switch (type) {
      case EtoolsTableActionType.Edit:
        fireEvent(this, 'edit-item', item);
        break;
      case EtoolsTableActionType.Delete:
        fireEvent(this, 'delete-item', item);
        break;
    }
  }

  public toggleAndSortBy(column: IEtoolsTableColumn): void {
    if (column.sort === undefined) {
      return;
    }
    column.sort = this.toggleColumnSort(column.sort);
    fireEvent(this, 'sort-change', [...this.columns]);
  }

  public toggleColumnSort(sort: EtoolsTableColumnSort): EtoolsTableColumnSort {
    return sort === EtoolsTableColumnSort.Asc ? EtoolsTableColumnSort.Desc : EtoolsTableColumnSort.Asc;
  }

}
