type NullOrNumber = null | number;
import { months } from '../../../../common-elements/month-list';

class MonthCounterInput extends Polymer.Element {
    private count!: number[];
    public static get is() { return 'month-counter-input'; }

    public static get properties() {
        return {
            months: {
                type: Array,
                value: () => months
            },
            count: {
                type: Array,
                value: () => [],
            }
        };
    }

    public getMonthName(month: string, lettersCount = month.length): string {
        return month.slice(0, lettersCount);
    }

    public getCountForMonth(countArray: number[], index: number): NullOrNumber {
        const count = (countArray || [])[index];
        return isNaN(count) ? 0 : count;
    }

    public onCountChange({target}: KeyboardEvent) {
        const index = _.get(target, 'dataset.index');
        const value = _.get(target, 'value', 0);

        if (value !== `${+value}`) {
            _.set(target, 'value', +value || 0);
        }

        if (!isNaN(index)) {
            this.count[index] = +value || 0;
        }
    }
}

customElements.define(MonthCounterInput.is, MonthCounterInput);
