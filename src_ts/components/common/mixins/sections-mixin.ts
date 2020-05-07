import {LitElement} from 'lit-element';
import {sectionsDataSelector} from '../../../redux/selectors/static-data.selectors';
import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {PropertyDeclarations} from 'lit-element/src/lib/updating-element';
import {loadStaticData} from '../../../redux/effects/load-static-data.effect';
import {SECTIONS} from '../../../endpoints/endpoints-list';

/* eslint-disable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
/* @polymerMixin */
export const SectionsMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    /* eslint-enable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
    sections: EtoolsSection[] = [];

    private sectionsUnsubscribe!: Unsubscribe;

    static get properties(): PropertyDeclarations {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const superProps: PropertyDeclarations = super.properties;
      return {
        ...superProps,
        sections: {type: Array}
      };
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.sectionsUnsubscribe = store.subscribe(
        sectionsDataSelector((sections: EtoolsSection[] | undefined) => {
          if (!sections) {
            return;
          }
          this.sections = sections;
        })
      );
      const data: IStaticDataState = (store.getState() as IRootState).staticData;
      if (!data.sections) {
        store.dispatch<AsyncEffect>(loadStaticData(SECTIONS));
      }
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.sectionsUnsubscribe();
    }
  };
