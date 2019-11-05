import {
    css,
    CSSResult,
    customElement,
    html,
    LitElement,
    property,
    TemplateResult
} from 'lit-element';
import { StyleInfo, styleMap } from 'lit-html/directives/style-map';

@customElement('progress-bar')
export class ProgressBar extends LitElement {
    @property() public completed: number = 0;
    @property() public planned: number = 0;
    @property() public minRequired: number | null = null;
    @property() public daysSinceLastVisit: number | null = null;
    @property() public completedLabelValue: string | null = 'Completed';
    @property() public plannedLabelValue: string | null = 'Planned';
    @property() public minRequiredLabelValue: string = `Minimum Required ${ this.minRequired ? this.minRequired : 0 }`;
    @property() public daysSinceLastVisitLabelValue: string = `Days Since Last Visit ${ this.daysSinceLastVisit ? this.daysSinceLastVisit : 0 }`;
    @property() public progressBarLabelsColor: string = 'grey';
    @property() public completedDivBackgroundColor: string = '#48B6C2';
    // public progressbarFooterComputedStyles!: StyleInfo;
    // public progressbarMinRequiredComputedStyles!: StyleInfo;
    // public progressbarCompletedComputedStyles!: StyleInfo;
    // public progressbarLabelComputedStyles!: StyleInfo;
    @property() private progressbarFooterComputedStyles: StyleInfo = {
        display: (this.minRequired ? 'flex' : 'none')
    };
    @property() private progressbarMinRequiredComputedStyles: StyleInfo = {
        display: (this.minRequired ? 'flex' : 'none'),
        width: this.getMinRequiredDivWidth()
    };
    @property() private progressbarCompletedComputedStyles: StyleInfo = {
        'background-color': this.completedDivBackgroundColor,
        'width': this.getCompletedDivWidth()
    };
    @property() private progressbarLabelComputedStyles: StyleInfo = {
        color: this.progressBarLabelsColor
    };

    public render(): TemplateResult {
        return html`
          <div class="progressbar-host">
            <!--  Top labels  -->
            <div class="progressbar__header">
              <label class="progressbar-label" style="${styleMap(this.progressbarLabelComputedStyles)}">${ this.completedLabelValue }</label>
              <label class="progressbar-label" style="${styleMap(this.progressbarLabelComputedStyles)}">${ this.plannedLabelValue }</label>
            </div>
            <!--  Progress bar  -->
            <div class="progressbar__content">
              <div class="progressbar">
                <div class="progressbar-values-container">
                  <label class="progressbar-value">${ this.completed }</label>
                  <label class="progressbar-value">${ this.planned }</label>
                </div>
                <div class="progressbar-completed" style="${styleMap(this.progressbarCompletedComputedStyles)}"></div>
                <div class="progressbar-planned"></div>
              </div>
              <div class="progressbar-min-required" style="${styleMap(this.progressbarMinRequiredComputedStyles)}"></div>
            </div>
            <!--  Bottom labels  -->
            <div class="progressbar__footer" style="${styleMap(this.progressbarFooterComputedStyles)}">
              <label class="progressbar-label" style="${styleMap(this.progressbarLabelComputedStyles)}">${ this.minRequiredLabelValue }</label>
              <label class="progressbar-label" style="${styleMap(this.progressbarLabelComputedStyles)}">${ this.daysSinceLastVisitLabelValue }</label>
            </div>
          </div>
        `;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        // this.progressbarFooterComputedStyles = {
        //     display: (this.minRequired ? 'flex' : 'none')
        // };
        // this.progressbarMinRequiredComputedStyles = {
        //     display: (this.minRequired ? 'flex' : 'none'),
        //     width: this.getMinRequiredDivWidth()
        // };
        // this.progressbarCompletedComputedStyles = {
        //     'background-color': this.completedDivBackgroundColor,
        //     'width': this.getCompletedDivWidth()
        // };
        // this.progressbarLabelComputedStyles = {
        //     color: this.progressBarLabelsColor
        // };
    }

    public getCompletedPercentage(): number {
        return this.completed / this.planned * 100;
    }

    public getCompletedDivWidth(): string {
        return `${this.completed / this.planned * 100}%`;
    }

    public getMinRequiredDivWidth(): string {
        if (!this.minRequired || !this.planned) {
            return '0%';
        } else {
            return `${ this.minRequired / this.planned * 100}%`;
        }
    }

    public static get styles(): CSSResult {
        return css`
            .progressbar-host {
                display: flex;
                flex-direction: column;
            }

            .progressbar__header,
            .progressbar__footer {
                display: flex;
                justify-content: space-between;
            }

            .progressbar__footer {
                display: none;
            }

            .progressbar__content {
                position: relative;
                height: 30px;
                display: flex;
                align-items: center;
            }

            .progressbar-min-required {
                display: none;
                position: absolute;
                left: 0;
                top: 0;
                border-bottom: 2px solid;
                border-right: 2px solid;
                border-color: lightcoral;
                width: 0;
                height: 100%;
            }

            .progressbar {
                flex-basis: 100%;
                position: relative;
                height: 65%;
                display: flex;
            }

            .progressbar-values-container {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                display: flex;
                justify-content: space-between;
            }

            .progressbar-value {
                margin-left: 1%;
                margin-right: 1%;
            }

            .progressbar-completed {
                background-color: grey;
                width: 0;
                color: white;
            }

            .progressbar-planned {
                background-color: lightgrey;
                flex-grow: 1;
                color: black;
            }

            .progressbar-label {
                color: grey;
            }
        `;
    }
}
