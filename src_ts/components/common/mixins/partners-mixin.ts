import { LitElement } from 'lit-element';
import { partnersDataSelector } from '../../../redux/selectors/static-data.selectors';
import { store } from '../../../redux/store';
import { Unsubscribe } from 'redux';
import { PropertyDeclarations } from 'lit-element/src/lib/updating-element';

// tslint:disable-next-line:typedef
export const PartnersMixin = <T extends Constructor<LitElement>>(superclass: T) => class extends superclass {
    public partners!: EtoolsPartner[];

    private partnersUnsubscribe!: Unsubscribe;

    public connectedCallback(): void {
        super.connectedCallback();
        this.partnersUnsubscribe = store.subscribe(partnersDataSelector((partners: EtoolsPartner[] | undefined) => {
            if (!partners) { return; }
            this.partners = partners;
        }));
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
