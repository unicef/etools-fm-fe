import {LitElement} from 'lit';
import {staticDataDynamic} from '../../../redux/selectors/static-data.selectors';
import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {PropertyDeclarations} from 'lit-element/src/lib/updating-element';
import {loadStaticData} from '../../../redux/effects/load-static-data.effect';
import {INTERVENTIONS, INTERVENTIONS_ACTIVE} from '../../../endpoints/endpoints-list';

/* eslint-disable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
/* @LitMixin */
export const InterventionsMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    /* eslint-enable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
    interventions: EtoolsIntervention[] = [];
    interventionsActive: EtoolsIntervention[] = [];

    private interventionsUnsubscribe!: Unsubscribe;
    private interventionsActiveUnsubscribe!: Unsubscribe;

    static get properties(): PropertyDeclarations {
      // eslint-disable-next-line
      // @ts-ignore
      const superProps: PropertyDeclarations = super.properties;
      return {
        ...superProps,
        interventions: {type: Array},
        interventionsActive: {type: Array}
      };
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.interventionsUnsubscribe = store.subscribe(
        staticDataDynamic(
          (interventions: EtoolsIntervention[] | undefined) => {
            if (!interventions) {
              return;
            }
            this.interventions = interventions;
          },
          [INTERVENTIONS]
        )
      );
      this.interventionsActiveUnsubscribe = store.subscribe(
        staticDataDynamic(
          (interventionsActive: EtoolsIntervention[] | undefined) => {
            if (!interventionsActive) {
              return;
            }
            this.interventionsActive = interventionsActive;
          },
          [INTERVENTIONS_ACTIVE]
        )
      );
      const data: IStaticDataState = (store.getState() as IRootState).staticData;
      if (!data.interventions) {
        store.dispatch<AsyncEffect>(loadStaticData(INTERVENTIONS));
      }
      if (!data.interventionsActive) {
        store.dispatch<AsyncEffect>(loadStaticData(INTERVENTIONS_ACTIVE));
      }
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.interventionsUnsubscribe();
      this.interventionsActiveUnsubscribe();
    }
  };
