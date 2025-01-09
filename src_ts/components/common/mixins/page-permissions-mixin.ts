import {LitElement, PropertyDeclarations} from 'lit';
import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {currentUser} from '../../../redux/selectors/user.selectors';

/* @LitMixin */
export const PagePermissionsMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    permissionsReady = false;

    private userUnsubscribe!: Unsubscribe;

    static get properties(): PropertyDeclarations {
      // @ts-ignore
      const superProps: PropertyDeclarations = super.properties;
      return {
        ...superProps,
        permissionsReady: {type: Boolean}
      };
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.userUnsubscribe = store.subscribe(
        currentUser((userData: IEtoolsUserModel | null) => {
          if (userData) {
            this.permissionsReady = true;
          }
        })
      );
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.userUnsubscribe();
    }
  };
