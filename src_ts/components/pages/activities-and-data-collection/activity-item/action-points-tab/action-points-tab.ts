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

store.addReducers({actionPointsList});
store.addReducers({tpmActionPointsList});

@customElement('action-points-tab')
export class ActionPointsTab extends CommentsMixin(LitElement) {
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

  private actionPointsListUnsubscribe!: Unsubscribe;
  private tpmActionPointsListUnsubscribe!: Unsubscribe;
  private actionPointsCategoriesUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.loading = true;
    this.categories = store.getState().staticData.actionPointsCategories;
    if (!this.categories) {
      store.dispatch<AsyncEffect>(loadStaticData(ACTION_POINTS_CATEGORIES));
    }

    this.actionPointsListUnsubscribe = store.subscribe(
      actionPointsListSelector((actionPointsList: ActionPoint[]) => {
        this.items = actionPointsList;
        this.loading = false;
      })
    );
    this.tpmActionPointsListUnsubscribe = store.subscribe(
      tpmActionPointsListSelector((actionPointsList: TPMActionPoint[]) => {
        this.tpmItems = actionPointsList;
        this.loading = false;
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
