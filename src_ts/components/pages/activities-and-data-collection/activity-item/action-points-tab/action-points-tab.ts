import {css, CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {template} from './action-points-tab.tpl';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../styles/card-styles';
import {store} from '../../../../../redux/store';
import {actionPointsList} from '../../../../../redux/reducers/action-points.reducer';
import {loadActionPoints} from '../../../../../redux/effects/action-points.effects';
import {Unsubscribe} from 'redux';
import {actionPointsListSelector} from '../../../../../redux/selectors/action-points.selectors';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';

store.addReducers({actionPointsList});

@customElement('action-points-tab')
export class ActionPointsTab extends LitElement {
  @property() items: ActionPoint[] = [];
  @property() activityDetails!: IActivityDetails;
  @property() loading = false;

  statusMap: Map<string, string> = new Map([
    ['open', 'Open'],
    ['completed', 'Completed']
  ]);

  private actionPointsListUnsubscribe!: Unsubscribe;

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.loading = true;
    store.dispatch<AsyncEffect>(loadActionPoints(this.activityDetails.id));
    this.actionPointsListUnsubscribe = store.subscribe(
      actionPointsListSelector((actionPointsList: ActionPoint[]) => {
        this.items = actionPointsList;
        this.loading = false;
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.actionPointsListUnsubscribe();
  }

  openPopup(actionPoint?: ActionPoint): void {
    openDialog<ActionPointPopupData>({
      dialog: 'action-points-popup',
      dialogData: {
        action_point: actionPoint,
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

  static get styles(): CSSResult[] {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      FlexLayoutClasses,
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
