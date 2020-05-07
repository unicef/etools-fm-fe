import {LitElement} from 'lit-element';
import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {PropertyDeclarations} from 'lit-element/src/lib/updating-element';
import {currentUser} from '../../../redux/selectors/user.selectors';

/* eslint-disable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
/* @polymerMixin */
export const PagePermissionsMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    /* eslint-enable @typescript-eslint/typedef,@typescript-eslint/explicit-function-return-type */
    permissionsReady: boolean = false;

    private userUnsubscribe!: Unsubscribe;

    static get properties(): PropertyDeclarations {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
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
