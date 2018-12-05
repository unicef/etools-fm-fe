type NullOrNumber = null | number;
import { months } from '../../../../common-elements/month-list';

class MonthCounterInput extends Polymer.Element {
    private count!: number[];
    public static get is() { return 'month-counter-input'; }

    public static get properties() {
        return {
            year: {
                type: Number,
                value: 0
            },
            months: {
                type: Array,
                value: () => months
            },
            count: {
                type: Array,
                value: () => [],
            },
            readonly: {
                type: Boolean,
                value: false,
                observer: 'updateStyles'
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

    public isReadonly(readonly: boolean, month: number, year: number) {
        if (readonly || isNaN(+month) || !year) { return true; }
        const date = new Date(+year, +month + 1);
        return new Date().getTime() >= date.getTime();
    }
}

customElements.define(MonthCounterInput.is, MonthCounterInput);
