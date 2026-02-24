import {LitElement} from 'lit';
import {staticDataDynamic} from '../../../redux/selectors/static-data.selectors';
import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {loadStaticData} from '../../../redux/effects/load-static-data.effect';
import {PARTNERS} from '../../../endpoints/endpoints-list';

/* @LitMixin */
export const PartnersMixin = <T extends Constructor<LitElement>>(superclass: T) =>
  class extends superclass {
    partners: EtoolsPartner[] = [];
    allPartners: EtoolsPartner[] = [];
    _activityId: string | null = null;
    private _isGpd: undefined | boolean = undefined;
    set isGpd(isGpd: undefined | boolean) {
      this._isGpd = isGpd;
      this.filterPartners(isGpd);
    }
    get isGpd(): undefined | boolean {
      return this._isGpd;
    }

    private partnersUnsubscribe!: Unsubscribe;

    connectedCallback(): void {
      super.connectedCallback();
      this.loadPartners();
    }

    filterPartners(isGpd: undefined | boolean) {
      if (isGpd === undefined) {
        this.partners = this.allPartners;
      } else {
        this.partners = isGpd
          ? this.allPartners.filter((x: any) => x.organization_type === 'Government')
          : this.allPartners.filter((x: any) => x.organization_type !== 'Government');
      }
    }

    loadPartners() {
      this.partnersUnsubscribe = store.subscribe(
        staticDataDynamic(
          (partners: EtoolsPartner[] | undefined) => {
            if (!partners) {
              return;
            }
            this.allPartners = partners;
            this.filterPartners(this.isGpd);
          },
          [PARTNERS]
        )
      );

      const data: IStaticDataState = (store.getState() as IRootState).staticData;
      if (!data.partners) {
        store.dispatch<AsyncEffect>(loadStaticData(PARTNERS));
      }
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.partnersUnsubscribe();
    }
  };
