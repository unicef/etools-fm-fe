import '@polymer/paper-button/paper-button';

import { SharedStyles } from '../../styles/shared-styles';
import '../../common/layout/page-content-header/page-content-header';
import { pageContentHeaderSlottedStyles } from
        '../../common/layout/page-content-header/page-content-header-slotted-styles';
import { pageLayoutStyles } from '../../styles/page-layout-styles';
import { CSSResultArray, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { ROOT_PATH } from '../../../config/config';
import { EtoolsFilterTypes, IEtoolsFilter } from '../../common/layout/filters/etools-filters';
import { elevationStyles } from '../../styles/lit-styles/elevation-styles';

/**
 * @LitElement
 * @customElement
 */
@customElement('engagements-list')
export class EngagementsList extends LitElement {

    @property({ type: Array })
    public listData: GenericObject[] = [];

    @property({ type: Array })
    public partnerTypes: any[] = [
        {
            value: 'cso',
            label: 'CSO Partner'
        },
        {
            value: 'gov',
            label: 'Government Partner'
        },
        {
            value: 'cso_national',
            label: 'CSO/National Partner'
        }
    ];

    @property({ type: Array })
    public partnerSyncedOpts: any[] = [
        {
            value: 'no',
            label: 'No'
        },
        {
            value: 'yes',
            label: 'Yes'
        }
    ];

    @property({ type: Array })
    public selectedFilters: GenericObject = {
        q: '',
        partner_type: [],
        synced: null,
        show_hidden: true,
        created_after: null
    };

    @property({ type: Array })
    public filters: IEtoolsFilter[] = [];

    private readonly rootPath: string = ROOT_PATH;

    public connectedCallback(): void {
        super.connectedCallback();
        this.filters = [
            {
                filterName: 'Search partner',
                filterKey: 'q',
                type: EtoolsFilterTypes.Search,
                selectedValue: '',
                selected: true
            },
            {
                filterName: 'Partner Type',
                filterKey: 'partner_type',
                type: EtoolsFilterTypes.DropdownMulti,
                selectionOptions: this.partnerTypes,
                selectedValue: [],
                selected: true,
                minWidth: '350px',
                hideSearch: true,
                disabled: this.partnerTypes.length === 0
            },
            {
                filterName: 'Synced',
                filterKey: 'synced',
                type: EtoolsFilterTypes.Dropdown,
                selectionOptions: this.partnerSyncedOpts,
                selectedValue: null,
                selected: false,
                minWidth: '350px',
                hideSearch: true,
                disabled: this.partnerSyncedOpts.length === 0
            },
            {
                filterName: 'Show hidden',
                filterKey: 'show_hidden',
                type: EtoolsFilterTypes.Toggle,
                selectedValue: true,
                selected: true
            },
            {
                filterName: 'Created After',
                filterKey: 'created_after',
                type: EtoolsFilterTypes.Date,
                selectedValue: null,
                selected: false
            }
        ];
    }

    public filtersChange(e: CustomEvent): void {
        console.log('filters change event handling...', e.detail);
        this.selectedFilters = { ...this.selectedFilters, ...e.detail };
        // DO filter stuff here
    }

    public static get styles(): CSSResultArray {
        return [elevationStyles];
    }

    public render(): TemplateResult {
        // main template
        // language=HTML
        return html`
          ${SharedStyles} ${pageContentHeaderSlottedStyles} ${pageLayoutStyles}

          <page-content-header>
            <h1 slot="page-title">Engagements list</h1>

            <div slot="title-row-actions" class="content-header-actions">
              <paper-button raised>Export</paper-button>
            </div>
          </page-content-header>

          <section class="elevation page-content filters" elevation="1">
            <etools-filters .filters="${this.filters}"
                            @filter-change="${this.filtersChange}"></etools-filters>
          </section>

          <section class="elevation page-content" elevation="1">
            Engagements list will go here.... TODO<br>
            <a href="${this.rootPath}engagements/23/details">Go to engagement details pages :)</a>
          </section>
    `;
    }
}
