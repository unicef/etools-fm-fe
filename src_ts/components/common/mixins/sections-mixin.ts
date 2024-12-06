import {LitElement, PropertyDeclarations} from 'lit';
import {sectionsDataSelector} from '../../../redux/selectors/static-data.selectors';
import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {loadStaticData} from '../../../redux/effects/load-static-data.effect';
import {SECTIONS} from '../../../endpoints/endpoints-list';

/* @LitMixin */
export const SectionsMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    sections: EtoolsSection[] = [];

    private sectionsUnsubscribe!: Unsubscribe;

    static get properties(): PropertyDeclarations {
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
