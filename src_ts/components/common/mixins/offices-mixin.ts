import {LitElement, PropertyDeclarations} from 'lit';
import {officesDataSelector} from '../../../redux/selectors/static-data.selectors';
import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {loadStaticData} from '../../../redux/effects/load-static-data.effect';
import {ACTION_POINTS_OFFICES} from '../../../endpoints/endpoints-list';

/* @LitMixin */
export const OfficesMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    allOffices: ActionPointsOffice[] = [];

    private officesUnsubscribe!: Unsubscribe;

    static get properties(): PropertyDeclarations {
      // @ts-ignore
      const superProps: PropertyDeclarations = super.properties;
      return {
        ...superProps,
        allOffices: {type: Array}
      };
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.officesUnsubscribe = store.subscribe(
        officesDataSelector((offices: ActionPointsOffice[] | undefined) => {
          if (!offices) {
            return;
          }
          this.allOffices = offices;
        })
      );
      const data: IStaticDataState = (store.getState() as IRootState).staticData;
      if (!data.offices) {
        store.dispatch<AsyncEffect>(loadStaticData(ACTION_POINTS_OFFICES));
      }
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.officesUnsubscribe();
    }
  };
