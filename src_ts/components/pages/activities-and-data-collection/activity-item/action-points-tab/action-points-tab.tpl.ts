import {html, TemplateResult} from 'lit';
import {ActionPointsTab} from './action-points-tab';
import {InputStyles} from '../../../../styles/input-styles';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query.js';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import '@unicef-polymer/etools-unicef/src/etools-info-tooltip/info-icon-tooltip';
import './action-points-popup/action-points-popup';
import './tpm-action-points-popup/tpm-action-points-popup';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {formatDate} from '@unicef-polymer/etools-utils/dist/date.util';

export function template(this: ActionPointsTab): TemplateResult {
  return html`
    ${InputStyles}
    <style>
      .link-content {
        display: block;
      }
      ${dataTableStylesLit}
    </style>
    <etools-media-query
      query="(max-width: 767px)"
      @query-matches-changed="${(e: CustomEvent) => {
        this.lowResolutionLayout = e.detail.value;
      }}"
    ></etools-media-query>
    <section
      class="elevation page-content card-container"
      elevation="1"
      ?hidden="${!this.activityDetails.permissions.view.action_points}"
    >
      <etools-loading
        ?active="${this.loading}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <!--   Card Header   -->
      <div class="card-title-box with-bottom-line">
        <div class="card-title counter">${translate('ACTIVITY_ITEM.ACTION_POINTS.TITLE')}</div>
        <div class="buttons-container">
          <etools-icon-button
            ?hidden="${!this.activityDetails.permissions.edit.action_points}"
            @click="${() => this.openPopup()}"
            class="panel-button"
            data-type="add"
            name="add-box"
          ></etools-icon-button>
        </div>
      </div>

      <!--   Table header   -->
      <etools-data-table-header
        no-title
        ?no-collapse="${!this.items.length}"
        .lowResolutionLayout="${this.lowResolutionLayout}"
      >
        <etools-data-table-column class="col-md-3 col-data">
          ${translate('ACTIVITY_ITEM.ACTION_POINTS.REFERENCE')}
        </etools-data-table-column>
        <etools-data-table-column class="col-md-3 col-data">
          ${translate('ACTIVITY_ITEM.ACTION_POINTS.DESCRIPTION')}
        </etools-data-table-column>
        <etools-data-table-column class="col-md-3 col-data">
          <div class="assignee">
            <label>${translate('ACTIVITY_ITEM.ACTION_POINTS.ASSIGNEE')}</label>
            <label>(${translate('ACTIVITY_ITEM.ACTION_POINTS.SECTION_OFFICE')})</label>
          </div>
        </etools-data-table-column>
        <etools-data-table-column class="col-md-1 col-data">
          ${translate('ACTIVITY_ITEM.ACTION_POINTS.STATUS')}
        </etools-data-table-column>
        <etools-data-table-column class="col-md-1 col-data">
          ${translate('ACTIVITY_ITEM.ACTION_POINTS.DUE_ON')}
        </etools-data-table-column>
        <etools-data-table-column class="col-md-1 col-data">
          ${translate('ACTIVITY_ITEM.ACTION_POINTS.PRIORITY')}
        </etools-data-table-column>
        <etools-data-table-column></etools-data-table-column>
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

      <!--   Table content   -->
      ${this.items.map(
        (item: ActionPoint) => html`
          <etools-data-table-row
            related-to="action_points-${item.id}"
            related-to-description="${item.reference_number} - ${item.description}"
            comments-container
            secondary-bg-on-hover
            .lowResolutionLayout="${this.lowResolutionLayout}"
          >
            <div slot="row-data" class="layout-horizontal editable-row">
              <div
                class="col-data col-md-3"
                data-col-header-label="${translate('ACTIVITY_ITEM.ACTION_POINTS.REFERENCE')}"
              >
                <a class="link-cell link-content" href="/apd/action-points/detail/${item.id}/" target="_blank">
                  <etools-icon-button name="launch"></etools-icon-button>
                  <label class="link-text">${item.reference_number}</label>
                </a>
              </div>
              <div
                class="col-data col-md-3"
                data-col-header-label="${translate('ACTIVITY_ITEM.ACTION_POINTS.DESCRIPTION')}"
              >
                ${item.description}
              </div>
              <div
                class="col-md-3 assignee"
                data-col-header-label="${translate('ACTIVITY_ITEM.ACTION_POINTS.ASSIGNEE')}"
              >
                <label class="assignee__name">${item.assigned_to.name}</label>
                <label>(${item.section.name} / ${item.office.name})</label>
              </div>
              <div class="col-data col-md-1" data-col-header-label="${translate('ACTIVITY_ITEM.ACTION_POINTS.STATUS')}">
                ${this.statusMap.get(item.status)}
              </div>
              <div class="col-data col-md-1" data-col-header-label="${translate('ACTIVITY_ITEM.ACTION_POINTS.DUE_ON')}">
                ${formatDate(item.due_date) || '-'}
              </div>
              <div
                class="col-data col-md-1 editable-row"
                data-col-header-label="${translate('ACTIVITY_ITEM.ACTION_POINTS.PRIORITY')}"
              >
                ${item.high_priority ? 'High' : ''}
              </div>
              <div class="hover-block" ?hidden="${!this.activityDetails.permissions.edit.action_points}">
                <etools-icon name="create" @click="${() => this.openPopup(item)}"></etools-icon>
              </div>
            </div>

            <!--   Collapse content   -->
            <div slot="row-data-details" class="layout-horizontal">
              <div class="row-details-content w160px">
                <div class="rdc-title">${translate('ACTIVITY_ITEM.ACTION_POINTS.RELATED_TO')}</div>
                <div class="truncate">${this.getRelatedInfo(item).type}</div>
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

    <section
      class="elevation page-content card-container"
      elevation="1"
      ?hidden="${!this.activityDetails.permissions.view.tpm_concerns}"
      comment-element="tpm_concerns"
    >
      <etools-loading
        ?active="${this.loading}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <!--   Card Header   -->
      <div class="card-title-box with-bottom-line">
        <div class="card-title counter">
          ${translate('TPM_RAISED_ISSUES')}
          <info-icon-tooltip id="iit-geo" .tooltipText="${translate('TPM_RAISED_ISSUES_INFO')}"></info-icon-tooltip>
        </div>
        <div class="buttons-container">
          <etools-icon-button
            ?hidden="${!this.activityDetails.permissions.edit.tpm_concerns}"
            @click="${() => this.openTPMPopup()}"
            class="panel-button"
            data-type="add"
            name="add-box"
          ></etools-icon-button>
        </div>
      </div>
      <!--   Table header   -->
      <etools-data-table-header
        no-title
        ?no-collapse="${!this.tpmItems.length}"
        .lowResolutionLayout="${this.lowResolutionLayout}"
      >
        <etools-data-table-column class="col-md-9 col-data">
          ${translate('ACTIVITY_ITEM.ACTION_POINTS.DESCRIPTION')}
        </etools-data-table-column>
        <etools-data-table-column class="col-md-2 col-data">
          ${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.CATEGORIES')}
        </etools-data-table-column>
        <etools-data-table-column class="col-md-1 col-data">
          ${translate('ACTIVITY_ITEM.ACTION_POINTS.PRIORITY')}
        </etools-data-table-column>
        <etools-data-table-column></etools-data-table-column>
      </etools-data-table-header>

      ${!this.tpmItems.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="row">
                <div class="col-data col-12 no-data">${translate('NO_RECORDS')}</div>
              </div>
            </etools-data-table-row>
          `
        : ''}

      <!--   Table content   -->
      ${this.tpmItems.map(
        (item: TPMActionPoint) => html`
          <etools-data-table-row
            related-to="tpm_concerns-${item.id}"
            related-to-description="${item.description}"
            comments-container
            no-collapse
            secondary-bg-on-hover
            .lowResolutionLayout="${this.lowResolutionLayout}"
          >
            <div slot="row-data" class="layout-horizontal editable-row">
              <div
                class="col-data col-md-9"
                data-col-header-label="${translate('ACTIVITY_ITEM.ACTION_POINTS.DESCRIPTION')}"
              >
                ${item.description}
              </div>
              <div
                class="col-data col-md-2"
                data-col-header-label="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.CATEGORIES')}"
              >
                ${this.getCategoryText(item.category, this.categories)}
              </div>
              <div
                class="col-data col-md-1 editable-row"
                data-col-header-label="${translate('ACTIVITY_ITEM.ACTION_POINTS.PRIORITY')}"
              >
                ${item.high_priority ? 'High' : ''}
              </div>
              <div
                class="hover-block"
                ?hidden="${!this.activityDetails.permissions.edit.tpm_concerns &&
                !this.activityDetails.permissions.edit.action_points}"
              >
                <etools-icon
                  name="create"
                  @click="${() => this.openTPMPopup(item)}"
                  ?hidden="${!this.activityDetails.permissions.edit.tpm_concerns}"
                ></etools-icon>
                <etools-icon
                  name="autorenew"
                  @click="${() => this.convertTPMActionPoint(item)}"
                  ?hidden="${!this.activityDetails.permissions.edit.action_points}"
                ></etools-icon>
              </div>
            </div>
          </etools-data-table-row>
        `
      )}
    </section>
  `;
}
