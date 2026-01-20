import {css, LitElement, TemplateResult, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {template} from './action-points-tab.tpl';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {store} from '../../../../../redux/store';
import {actionPointsList} from '../../../../../redux/reducers/action-points.reducer';
import {tpmActionPointsList} from '../../../../../redux/reducers/tpm-action-points.reducer';
import {Unsubscribe} from 'redux';
import {actionPointsListSelector} from '../../../../../redux/selectors/action-points.selectors';
import {tpmActionPointsListSelector} from '../../../../../redux/selectors/tpm-action-points.selectors';
import {ACTION_POINTS_CATEGORIES} from '../../../../../endpoints/endpoints-list';
import {loadStaticData} from '../../../../../redux/effects/load-static-data.effect';
import {staticDataDynamic} from '../../../../../redux/selectors/static-data.selectors';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import {CommentsMixin} from '../../../../common/comments/comments-mixin';
import {loadActionPoints, loadTPMActionPoints} from '../../../../../redux/effects/action-points.effects.ts';
import {SetActionPointsParams, SetTPMActionPointsParams} from '../../../../../redux/actions/action-points.actions.ts';
import {AsyncEffect} from '../../../../../types/redux-types';

store.addReducers({actionPointsList});
store.addReducers({tpmActionPointsList});

@customElement('action-points-tab')
export class ActionPointsTab extends CommentsMixin(LitElement) {
  @property() pageSize = 10;
  @property() pageNumber = 1;
  @property() count = 0;
  @property() tpmPageSize = 10;
  @property() tpmPageNumber = 1;
  @property() tpmCount = 0;
  @property() items: ActionPoint[] = [];
  @property() tpmItems: TPMActionPoint[] = [];
  @property() activityDetails!: IActivityDetails;
  @property() categories!: ActionPointsCategory[];
  @property() loading = false;
  @property({type: Boolean})
  lowResolutionLayout = false;
  statusMap: Map<string, string> = new Map([
    ['open', 'Open'],
    ['completed', 'Completed']
  ]);
  commentsModeInitialize = false;

  private actionPointsListUnsubscribe!: Unsubscribe;
  private tpmActionPointsListUnsubscribe!: Unsubscribe;
  private actionPointsCategoriesUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    return template.call(this);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (
      (changedProperties.has('items') || changedProperties.has('tpmItems')) &&
      this.items.length &&
      this.tpmItems.length
    ) {
      this.setCommentMode();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.loading = true;
    this.categories = store.getState().staticData.actionPointsCategories;
    if (!this.categories) {
      store.dispatch<AsyncEffect>(loadStaticData(ACTION_POINTS_CATEGORIES));
    }

    this.actionPointsListUnsubscribe = store.subscribe(
      actionPointsListSelector((actionPointsList: IListData<ActionPoint>) => {
        this.items = actionPointsList.results;
        this.count = actionPointsList.count;
        this.loading = false;
        const params = store.getState().actionPointsList.params;
        this.pageSize = params.page_size;
        this.pageNumber = params.page;
      })
    );
    this.tpmActionPointsListUnsubscribe = store.subscribe(
      tpmActionPointsListSelector((tpmActionPointsList: IListData<TPMActionPoint>) => {
        this.tpmItems = tpmActionPointsList.results;
        this.tpmCount = tpmActionPointsList.count;
        this.loading = false;
        const params = store.getState().tpmActionPointsList.params;
        this.tpmPageSize = params.page_size;
        this.tpmPageNumber = params.page;
      })
    );
    this.actionPointsCategoriesUnsubscribe = store.subscribe(
      staticDataDynamic(
        (categories: ActionPointsCategory[] | undefined) => {
          if (categories) {
            this.categories = categories;
          }
        },
        [ACTION_POINTS_CATEGORIES]
      )
    );
  }
  onPageSizeChange(pageSize: number): void {
    if (this.pageSize !== pageSize) {
      this.pageSize = pageSize;
      this.handleActionPointsParamsChange();
    }
  }

  onPageNumberChange(pageNumber: number): void {
    if (this.pageNumber !== pageNumber) {
      this.pageNumber = pageNumber;
      this.handleActionPointsParamsChange();
    }
  }

  handleActionPointsParamsChange(): void {
    store.dispatch(new SetActionPointsParams({page_size: this.pageSize, page: this.pageNumber}));
    store.dispatch<AsyncEffect>(loadActionPoints(Number(this.activityDetails.id)));
  }
  handleTpmActionPointsParamsChange(): void {
    store.dispatch(new SetTPMActionPointsParams({page_size: this.tpmPageSize, page: this.tpmPageNumber}));
    store.dispatch<AsyncEffect>(loadTPMActionPoints(Number(this.activityDetails.id)));
  }

  onTpmPageSizeChange(pageSize: number): void {
    if (this.tpmPageSize !== pageSize) {
      this.tpmPageSize = pageSize;
      this.handleTpmActionPointsParamsChange();
    }
  }

  onTpmPageNumberChange(pageNumber: number): void {
    if (this.tpmPageNumber !== pageNumber) {
      this.tpmPageNumber = pageNumber;
      this.handleTpmActionPointsParamsChange();
    }
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.actionPointsListUnsubscribe();
    this.tpmActionPointsListUnsubscribe();
    this.actionPointsCategoriesUnsubscribe();
  }

  openPopup(actionPoint?: ActionPoint): void {
    openDialog<ActionPointPopupData>({
      dialog: 'action-points-popup',
      dialogData: {
        action_point: actionPoint,
        activity_id: this.activityDetails.id,
        activityDetails: this.activityDetails
      }
    });
  }

  convertTPMActionPoint(tpmActionPoint: TPMActionPoint) {
    tpmActionPoint.id = 0;
    this.openPopup(tpmActionPoint as ActionPoint);
  }

  openTPMPopup(tpmActionPoint?: TPMActionPoint): void {
    openDialog<TPMActionPointPopupData>({
      dialog: 'tpm-action-points-popup',
      dialogData: {
        tpm_action_point: tpmActionPoint,
        activity_id: this.activityDetails.id
      }
    });
  }

  getRelatedInfo({partner, cp_output, intervention}: ActionPoint): {type: string; content: string} {
    if (partner) {
      return {type: 'Partner', content: partner.name};
    } else if (cp_output) {
      return {type: 'CP Output', content: cp_output.name};
    } else if (intervention) {
      return {type: 'Intervention', content: intervention.title};
    } else {
      return {type: '-', content: '-'};
    }
  }

  getCategoryText(categoryId: number, categories: ActionPointsCategory[]) {
    return (categories || []).find((x) => x.id === categoryId)?.description || '';
  }

  static get styles(): CSSResult[] {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      layoutStyles,
      CardStyles,
      css`
        .assignee {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;

          height: auto;
          min-height: 47px;
          min-width: 0;
          overflow: hidden;
          margin-right: 5px;
        }
        .assignee__name {
          font-weight: 700;
        }
      `
    ];
  }
}
