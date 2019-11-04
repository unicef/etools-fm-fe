import { html, TemplateResult } from 'lit-element';
import { PartnershipTab } from './partnership-tab';
import '../../../../common/progressbar/progress-bar';

export function template(this: PartnershipTab): TemplateResult {
    return html`
        <style>
            .partner-coverage {
                display: flex;
                flex-direction: column;
                padding: 1%;
            }
            .partner-coverage__header {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 2%;
            }
            .partner-coverage__header-item {
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex-basis: 50%;
            }
            .coverage-legend {
                display: flex;
                justify-content: space-evenly;
            }
            .coverage-legend__mark {
                width: 16px;
                height: 16px;
                display: flex;
                justify-content: center;
            }
            .coverage-legend__mark-completed {
                background-color: #48B6C2;
            }
            .coverage-legend__mark-required {
                height: 100%;
                width: 0;
                border: 1px solid #FF9044;
            }
            .coverage-legend__label {
                flex-basis: 90%;
            }
            .progressbar-container {
                margin-bottom: 2%;
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
            }
            .progressbar-container__header {
                font-style: normal;
                font-weight: normal;
                font-size: 16px;
                line-height: 36px;
                color: grey;
            }
        </style>
        <div class="partner-coverage">
            <div class="partner-coverage__header">
                <div class="partner-coverage__header-item">
                    <div class="coverage-legend">
                        <div class="coverage-legend__mark coverage-legend__mark-completed"></div><label class="coverage-legend__label">Completed Tasks</label>
                    </div>
                    <div class="coverage-legend">
                        <div class="coverage-legend__mark coverage-legend__mark-completed"></div><label class="coverage-legend__label">Completed Tasks that are HACT-compliant</label>
                    </div>
                    <div class="coverage-legend">
                        <div class="coverage-legend__mark"><div class="coverage-legend__mark-required"></div></div><label class="coverage-legend__label">Minimum Required Programmatic Visits</label>
                    </div>
                </div>
                <div class="partner-coverage__header-item">
                    <etools-dropdown .selected="${ this.selectedSortingOption }"
                                     label="Sort by"
                                     .options="${ this.sortingOptions }"
                                     option-label="label"
                                     option-value="value"
                                     trigger-value-change-event
                                     @etools-selected-item-changed="${ ({ detail }: CustomEvent) => this.onSelectionChange(detail.selectedItem.value) }"
                                     hide-search allow-outside-scroll>
                    </etools-dropdown>
                </div>
            </div>
            ${ this.progressbarData.map((progressBar: {headline: string; progressbarData: ProgressBarData}) => html`
                <div class="progressbar-container">
                    <div class="progressbar-container__header ">${ progressBar.headline }</div>
                    <progress-bar .progressbarData="${ progressBar.progressbarData }"></progress-bar>
                </div>
            `) }
        </div>
    `;
}
