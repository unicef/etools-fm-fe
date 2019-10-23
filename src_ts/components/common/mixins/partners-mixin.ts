import { LitElement } from 'lit-element';
import { staticDataDynamic } from '../../../redux/selectors/static-data.selectors';
import { store } from '../../../redux/store';
import { Unsubscribe } from 'redux';
import { PropertyDeclarations } from 'lit-element/src/lib/updating-element';
import { loadStaticData } from '../../../redux/effects/load-static-data.effect';
import { PARTNERS } from '../../../endpoints/endpoints-list';

// tslint:disable-next-line:typedef
export const PartnersMixin = <T extends Constructor<LitElement>>(superclass: T) => class extends superclass {
    public partners!: EtoolsPartner[];

    private partnersUnsubscribe!: Unsubscribe;

    public connectedCallback(): void {
        super.connectedCallback();
        store.subscribe(staticDataDynamic((partners: EtoolsPartner[] | undefined) => {
            if (!partners) { return; }
            this.partners = partners;
        }, [PARTNERS]));
        const data: IStaticDataState = (store.getState() as IRootState).staticData;
        if (!data.partners) {
            store.dispatch<AsyncEffect>(loadStaticData(PARTNERS));
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.partnersUnsubscribe();
    }

    public static get properties(): PropertyDeclarations {
        // @ts-ignore
        const superProps: PropertyDeclarations = super.properties;
        return {
            ...superProps,
            partners: { type: Array }
        };
    }
};
