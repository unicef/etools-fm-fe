import {html, TemplateResult} from 'lit-element';
import {ActionPointsTab} from './action-points-tab';
import {InputStyles} from '../../../../styles/input-styles';
import '@unicef-polymer/etools-data-table';
import './action-points-popup/action-points-popup';
import {translate} from 'lit-translate';

export function template(this: ActionPointsTab): TemplateResult {
  return html`
    ${InputStyles}
    <section class="elevation page-content card-container" elevation="1">
      <etools-loading
        ?active="${this.loading}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <!--   Card Header   -->
      <div class="card-title-box with-bottom-line">
        <div class="card-title counter">${translate('ACTIVITY_ITEM.ACTION_POINTS.TITLE')}</div>
        <div class="buttons-container">
          <paper-icon-button
            ?hidden="${!this.activityDetails.permissions.edit.action_points}"
            @tap="${() => this.openPopup()}"
            class="panel-button"
            data-type="add"
            icon="add-box"
          ></paper-icon-button>
        </div>
      </div>

      <!--   Table header   -->
      <etools-data-table-header no-title ?no-collapse="${!this.items.length}">
        <etools-data-table-column class="flex-1 col-data">
          ${translate('ACTIVITY_ITEM.ACTION_POINTS.REFERENCE')}
        </etools-data-table-column>
        <etools-data-table-column class="flex-2 col-data">
          ${translate('ACTIVITY_ITEM.ACTION_POINTS.DESCRIPTION')}
        </etools-data-table-column>
        <etools-data-table-column class="flex-2 col-data">
          <div class="assignee">
            <label>${translate('ACTIVITY_ITEM.ACTION_POINTS.ASSIGNEE')}</label>
            <label>(${translate('ACTIVITY_ITEM.ACTION_POINTS.SECTION_OFFICE')})</label>
          </div>
        </etools-data-table-column>
        <etools-data-table-column class="flex-1 col-data">
          ${translate('ACTIVITY_ITEM.ACTION_POINTS.STATUS')}
        </etools-data-table-column>
        <etools-data-table-column class="flex-1 col-data">
          ${translate('ACTIVITY_ITEM.ACTION_POINTS.DUE_ON')}
        </etools-data-table-column>
        <etools-data-table-column class="flex-1 col-data">
          ${translate('ACTIVITY_ITEM.ACTION_POINTS.PRIORITY')}
        </etools-data-table-column>
        <etools-data-table-column></etools-data-table-column>
      </etools-data-table-header>

      ${!this.items.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="layout horizontal flex">
                <div class="col-data flex-1">-</div>
                <div class="col-data flex-2">-</div>
                <div class="col-data flex-2">-</div>
                <div class="col-data flex-1">-</div>
                <div class="col-data flex-1">-</div>
                <div class="col-data flex-1">-</div>
              </div>
            </etools-data-table-row>
          `
        : ''}

      <!--   Table content   -->
      ${this.items.map(
        (item: ActionPoint) => html`
          <etools-data-table-row secondary-bg-on-hover>
            <div slot="row-data" class="layout horizontal editable-row flex">
              <div class="col-data flex-1">
                <a class="link-cell link-content" href="/apd/action-points/detail/${item.id}/" target="_blank">
                  <label class="link-text">${item.reference_number}</label>
                  <paper-icon-button icon="icons:launch"></paper-icon-button>
                </a>
              </div>
              <div class="col-data flex-2">${item.description}</div>
              <div class="flex-2 assignee">
                <label class="assignee__name">${item.assigned_to.name}</label>
                <label>(${item.section.name} / ${item.office.name})</label>
              </div>
              <div class="col-data flex-1">${this.statusMap.get(item.status)}</div>
              <div class="col-data flex-1">${this.formatDate(item.due_date)}</div>
              <div class="col-data flex-1 editable-row">${item.high_priority ? 'High' : ''}</div>
              <div class="hover-block" ?hidden="${!this.activityDetails.permissions.edit.action_points}">
                <iron-icon icon="icons:create" @tap="${() => this.openPopup(item)}"></iron-icon>
              </div>
            </div>

            <!--   Collapse content   -->
            <div slot="row-data-details" class="layout horizontal">
              <div class="row-details-content w160px">
                <div class="rdc-title">${translate('ACTIVITY_ITEM.ACTION_POINTS.RELATED_TO')}</div>
                <div class="truncate">
                  ${this.getRelatedInfo(item).type}
                </div>
              </div>
              <div class="row-details-content">
                <div class="rdc-title">${translate('ACTIVITY_ITEM.ACTION_POINTS.CONTENT')}</div>
                <div>${this.getRelatedInfo(item).content}</div>
              </div>
            </div>
          </etools-data-table-row>
        `
      )}
    </section>
  `;
}
